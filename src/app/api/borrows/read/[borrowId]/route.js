import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Borrow from "@/models/Borrow";
import { cloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Turbopack/edge cases sometimes pass empty params; fallback to parsing URL.
    const borrowId =
      params?.borrowId ||
      new URL(request.url).pathname.split("/").filter(Boolean).slice(-1)[0];
    if (!borrowId) {
      return NextResponse.json({ error: "Borrow ID required" }, { status: 400 });
    }

    await connectDB();
    const borrow = await Borrow.findOne({ _id: borrowId, user: session.id, status: "active" })
      .populate("book")
      .lean();

    if (!borrow?.book) {
      return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    }

    const book = borrow.book;
    const { searchParams } = new URL(request.url);

    // Preferred: private PDF via signed, short-lived URL
    if (book.filePublicId) {
      const expiresAt = Math.floor(Date.now() / 1000) + 60; // 60 seconds
      const signedUrl = cloudinary.url(book.filePublicId, {
        resource_type: "raw",
        type: "private",
        sign_url: true,
        expires_at: expiresAt,
      });

      // Stream the PDF through our server to force inline viewing + correct filename.
      if (searchParams.get("stream") === "1") {
        const upstream = await fetch(signedUrl, { redirect: "follow" });
        if (!upstream.ok) {
          return NextResponse.json({ error: "Failed to fetch book file" }, { status: 502 });
        }
        const buf = await upstream.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="book.pdf"',
            "Cache-Control": "no-store",
          },
        });
      }

      if (searchParams.get("json") === "1") {
        return NextResponse.json({ url: signedUrl, expiresAt });
      }
      return NextResponse.redirect(signedUrl);
    }

    // Legacy fallback (public URL) - still protected by borrow check above
    if (book.fileUrl) {
      if (searchParams.get("stream") === "1") {
        const upstream = await fetch(book.fileUrl, { redirect: "follow" });
        if (!upstream.ok) {
          return NextResponse.json({ error: "Failed to fetch book file" }, { status: 502 });
        }
        const buf = await upstream.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="book.pdf"',
            "Cache-Control": "no-store",
          },
        });
      }

      if (searchParams.get("json") === "1") {
        return NextResponse.json({ url: book.fileUrl, expiresAt: null });
      }
      return NextResponse.redirect(book.fileUrl);
    }

    return NextResponse.json({ error: "Book file not available" }, { status: 404 });
  } catch (err) {
    console.error("Read book error:", err);
    return NextResponse.json({ error: "Failed to open book" }, { status: 500 });
  }
}

