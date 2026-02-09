"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BookCard } from "@/components/ui/BookCard";
import { BookOpen, Search, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

function StudentBorrowedContent() {
  const { toast } = useToast();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    fetch("/api/borrows")
      .then((r) => r.json())
      .then((data) => setBorrows(Array.isArray(data) ? data : []))
      .catch(() => toast({ title: "Failed to load", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (borrowId) => {
    setReturning(borrowId);
    try {
      const res = await fetch("/api/borrows/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to return");
      setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
      toast({ title: "Book returned!" });
    } catch (err) {
      toast({ title: err.message || "Return failed", variant: "destructive" });
    } finally {
      setReturning(null);
    }
  };

  const borrowedBooks = borrows.map((b) => ({ ...b.book, borrowId: b._id, dueDate: b.dueDate })).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-16">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">My Borrowed Books</h1>
              <p className="text-slate-500 font-medium">Books you have borrowed from Libzone.</p>
            </div>
          </div>
          {borrowedBooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">No borrowed books yet</h3>
              <p className="text-slate-500 mb-6">Browse our collection and borrow your first book!</p>
              <Link href="/student">
                <Button className="bg-primary hover:bg-blue-600">Browse Books</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {borrowedBooks.map((item) => (
                  <div key={item._id} className="flex flex-col gap-2">
                    <BookCard book={{ ...item, id: item._id }} hideBorrow />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleReturn(item.borrowId)}
                      disabled={returning === item.borrowId}
                    >
                      {returning === item.borrowId ? "Returning..." : "Return Book"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 sm:px-8 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl safe-area-pb">
        <Link href="/student" className="flex flex-col items-center gap-1 text-slate-400">
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Browse</span>
        </Link>
        <Link href="/student/borrowed" className="flex flex-col items-center gap-1 text-primary">
          <BookOpen className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Library</span>
        </Link>
        <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 p-0 text-slate-400" onClick={() => toast({ title: "Coming Soon" })}>
          <Clock className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">History</span>
        </Button>
      </div>
    </div>
  );
}

export default function StudentBorrowed() {
  return (
    <ProtectedRoute requireRole="student">
      <StudentBorrowedContent />
    </ProtectedRoute>
  );
}
