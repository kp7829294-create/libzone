import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Borrow from "@/models/Borrow";
import Book from "@/models/Book";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { borrowId } = await request.json();
    if (!borrowId) {
      return NextResponse.json({ error: "Borrow ID required" }, { status: 400 });
    }
    await connectDB();
    const borrow = await Borrow.findOne({ _id: borrowId, user: session.id, status: "active" });
    if (!borrow) {
      return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    }
    borrow.status = "returned";
    borrow.returnedAt = new Date();
    await borrow.save();
    await Book.findByIdAndUpdate(borrow.book, { $inc: { available: 1 } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Return error:", err);
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 });
  }
}
