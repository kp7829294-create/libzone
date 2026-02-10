import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Book from "@/models/Book";

function getIdFromRequest(request, params) {
  return (
    params?.id ||
    new URL(request.url).pathname.split("/").filter(Boolean).slice(-1)[0]
  );
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const id = getIdFromRequest(request, params);
    if (!id) return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    const book = await Book.findById(id).lean();
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (err) {
    console.error("Book GET error:", err);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { title, author, category, total, available, image, filePublicId, rating } = body;
    await connectDB();
    const id = getIdFromRequest(request, params);
    if (!id) return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    const book = await Book.findById(id);
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    if (title != null) book.title = title;
    if (author != null) book.author = author;
    if (category != null) book.category = category;
    if (total != null) {
      const t = Math.max(1, parseInt(total) || 1);
      book.total = t;
      book.available = Math.min(book.available, t);
    }
    if (available != null) book.available = Math.max(0, Math.min(book.total, parseInt(available) ?? book.available));
    if (image != null) book.image = image;
    if (filePublicId != null) book.filePublicId = filePublicId;
    if (rating != null) book.rating = parseFloat(rating) || 4.5;
    await book.save();
    return NextResponse.json(book);
  } catch (err) {
    console.error("Book PUT error:", err);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const id = getIdFromRequest(request, params);
    if (!id) return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    const book = await Book.findByIdAndDelete(id);
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Book DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
