import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Book from "@/models/Book";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    const books = await Book.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(books);
  } catch (err) {
    console.error("Books GET error:", err);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { title, author, category, total, available, image, filePublicId, rating } = body;
    if (!title || !author || !category || !image || !filePublicId) {
      return NextResponse.json({ error: "Title, author, category, cover image and PDF are required" }, { status: 400 });
    }
    await connectDB();
    const totalNum = Math.max(1, parseInt(total) || 1);
    const availNum = Math.min(totalNum, Math.max(0, parseInt(available) ?? totalNum));
    const book = await Book.create({
      title,
      author,
      category,
      total: totalNum,
      available: availNum,
      image,
      filePublicId,
      rating: parseFloat(rating) || 4.5,
    });
    return NextResponse.json(book);
  } catch (err) {
    console.error("Books POST error:", err);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
