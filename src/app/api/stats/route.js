import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Book from "@/models/Book";
import User from "@/models/User";
import Borrow from "@/models/Borrow";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const [totalBooks, activeUsers, issuedBooks, overdue] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "student" }),
      Borrow.countDocuments({ status: "active" }),
      Borrow.countDocuments({ status: "active", dueDate: { $lt: new Date() } }),
    ]);
    return NextResponse.json({
      totalBooks,
      activeUsers,
      issuedBooks,
      overdue,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
