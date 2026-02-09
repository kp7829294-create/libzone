"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BookCard } from "@/components/ui/BookCard";
import { BookOpen, Search, ArrowLeftRight, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

function StudentDashboardContent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);
  const [returning, setReturning] = useState(null);

  const categories = ["All", "Technology", "Design", "Science", "Art"];
  const borrowedIds = borrows.map((b) => String(b.book?._id || b.book)).filter(Boolean);
  const borrowMap = Object.fromEntries(
    borrows.map((b) => {
      const bid = String(b.book?._id || b.book);
      return bid ? [bid, b._id] : [];
    }).filter((e) => e.length)
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/books").then((r) => r.json()),
      fetch("/api/borrows").then((r) => r.json()),
    ])
      .then(([booksData, borrowsData]) => {
        setBooks(Array.isArray(booksData) ? booksData : []);
        setBorrows(Array.isArray(borrowsData) ? borrowsData : []);
      })
      .catch(() => toast({ title: "Failed to load", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const handleBorrow = async (id) => {
    if (borrowedIds.includes(id)) {
      toast({ title: "Already Borrowed", description: "You already have this book.", variant: "destructive" });
      return;
    }
    setBorrowing(id);
    try {
      const res = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to borrow");
      setBorrows((prev) => [...prev, data]);
      toast({ title: "Book Borrowed!", description: "You have successfully borrowed this book." });
    } catch (err) {
      toast({ title: err.message || "Borrow failed", variant: "destructive" });
    } finally {
      setBorrowing(null);
    }
  };

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

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || (b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q));
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const borrowedBooks = books.filter((b) => borrowedIds.includes(b._id));

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
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Explore Books</h1>
              <p className="text-slate-500 font-medium">Libzone library is open for you, {user?.name?.split(" ")[0] || "Student"}.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search books, authors..." className="pl-10 h-11 bg-white border-slate-200 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 px-4 gap-2 border-slate-200 bg-white shadow-sm font-bold">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Library</SheetTitle>
                  </SheetHeader>
                  <div className="py-8 space-y-6">
                    <div className="space-y-4">
                      <p className="text-sm font-black uppercase tracking-widest text-slate-400">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Badge key={cat} variant={activeCategory === cat ? "default" : "secondary"} className="cursor-pointer px-4 py-2 rounded-lg font-bold" onClick={() => setActiveCategory(cat)}>
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "My Library", value: borrowedIds.length, icon: BookOpen, color: "bg-blue-600" },
              { label: "Borrowed", value: borrowedIds.length, icon: ArrowLeftRight, color: "bg-indigo-600" },
              { label: "Next Return", value: borrowedIds.length ? "14d" : "—", icon: Clock, color: "bg-amber-600" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <div className={cn("p-2.5 rounded-xl text-white shadow-lg shrink-0", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 leading-none truncate">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1.5 tracking-tighter">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-slate-900">Recommended for you</h2>
            </div>
            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No books found. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredBooks.map((book) => {
                  const bid = String(book._id);
                  const isBorrowed = borrowedIds.includes(bid);
                  return (
                    <BookCard
                      key={book._id}
                      book={{
                        ...book,
                        id: book._id,
                        available: book.available ?? 0,
                        total: book.total ?? 1,
                        borrowId: borrowMap[bid],
                      }}
                      onBorrow={handleBorrow}
                      onReturn={handleReturn}
                      borrowing={borrowing === book._id}
                      returning={returning}
                      isBorrowed={isBorrowed}
                    />
                  );
                })}
              </div>
            )}
          </section>
          {borrowedBooks.length > 0 && (
            <section className="space-y-6 pt-12 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Active Borrows</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {borrowedBooks.map((book) => (
                  <BookCard key={`borrowed-${book._id}`} book={{ ...book, id: book._id }} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 sm:px-8 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl safe-area-pb">
        <Link href="/student" className="flex flex-col items-center gap-1 text-primary">
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Browse</span>
        </Link>
        <Link href="/student/borrowed" className="flex flex-col items-center gap-1 text-slate-400">
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

export default function StudentDashboard() {
  return (
    <ProtectedRoute requireRole="student">
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}
