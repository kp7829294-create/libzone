import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Borrow from "@/models/Borrow";
import Book from "@/models/Book";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const borrows = await Borrow.find({ user: session.id, status: "active" })
      .populate("book")
      .sort({ borrowedAt: -1 })
      .lean();
    return NextResponse.json(borrows);
  } catch (err) {
    console.error("Borrows GET error:", err);
    return NextResponse.json({ error: "Failed to fetch borrows" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { bookId } = await request.json();
    if (!bookId) {
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    }
    await connectDB();
    const book = await Book.findById(bookId);
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    if (book.available < 1) {
      return NextResponse.json({ error: "Book not available" }, { status: 400 });
    }
    const existing = await Borrow.findOne({ user: session.id, book: bookId, status: "active" });
    if (existing) {
      return NextResponse.json({ error: "Already borrowed" }, { status: 400 });
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    await Borrow.create({ user: session.id, book: bookId, dueDate });
    book.available -= 1;
    await book.save();
    const borrow = await Borrow.findOne({ user: session.id, book: bookId, status: "active" }).populate("book").lean();
    return NextResponse.json(borrow);
  } catch (err) {
    console.error("Borrow POST error:", err);
    return NextResponse.json({ error: "Failed to borrow" }, { status: 500 });
  }
}
