import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";

export async function POST() {
  try {
    await connectDB();
    const count = await Book.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Already seeded", count });
    }
    await Book.insertMany([
      { title: "The Future of Code", author: "Elena R.", category: "Technology", total: 20, available: 12, image: "/book-1.png", rating: 4.8 },
      { title: "Design Systems", author: "Marcus Chen", category: "Design", total: 15, available: 3, image: "/book-2.png", rating: 4.9 },
      { title: "Sustainable Tech", author: "Sarah Greene", category: "Science", total: 10, available: 8, image: "/book-3.png", rating: 4.5 },
      { title: "Digital Art Mastery", author: "Alex V.", category: "Art", total: 5, available: 0, image: "/book-4.png", rating: 4.7 },
      { title: "Minimalist UI", author: "John D.", category: "Design", total: 8, available: 5, image: "/book-2.png", rating: 4.6 },
    ]);
    return NextResponse.json({ message: "Seeded", count: 5 });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
