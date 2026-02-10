"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, AlertCircle, TrendingUp, Edit, Trash2, Plus, Library, Search, Filter, Settings, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

const ICONS = {
  totalBooks: BookOpen,
  activeUsers: Users,
  issuedBooks: TrendingUp,
  overdue: AlertCircle,
};

const BOOK_CATEGORIES = ["Technology", "Design", "Science", "Art"];

function AdminDashboardContent() {
  const { toast } = useToast();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, activeUsers: 0, issuedBooks: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", category: "", total: "10", available: "10", image: "", filePublicId: "" });

  const fetchData = async () => {
    try {
      const [booksRes, statsRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/stats"),
      ]);
      const booksData = await booksRes.json();
      const statsData = await statsRes.json();
      setBooks(Array.isArray(booksData) ? booksData : []);
      setStats(statsData);
    } catch {
      toast({ title: "Failed to load", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (book) => {
    try {
      const res = await fetch(`/api/books/${book._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      toast({ title: "Book removed" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    const { title, author, category, total, available, image, filePublicId } = formData;
    if (!title?.trim() || !author?.trim() || !category?.trim() || !image || !filePublicId || !total || !available) {
      toast({ title: "All fields are required, including cover image and PDF", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const url = editingBook ? `/api/books/${editingBook._id}` : "/api/books";
      const method = editingBook ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category: category.trim(),
          total: parseInt(total) || 10,
          available: (parseInt(available) ?? parseInt(total)) || 10,
          image,
          filePublicId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editingBook) {
        setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? data : b)));
      } else {
        setBooks((prev) => [data, ...prev]);
      }
      toast({ title: "Saved successfully" });
      setShowAddModal(false);
      setEditingBook(null);
      setFormData({ title: "", author: "", category: "", total: "10", available: "10", image: "", filePublicId: "" });
      fetchData();
    } catch (err) {
      toast({ title: err.message || "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Please upload JPEG, PNG, or WebP image", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "libzone/books");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFormData((prev) => ({ ...prev, image: data.url }));
      toast({ title: "Cover uploaded" });
    } catch (err) {
      toast({ title: err.message || "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Please upload a PDF file", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "PDF must be under 20MB", variant: "destructive" });
      e.target.value = "";
      return;
    }
    setUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "libzone/books");
      const res = await fetch("/api/upload/pdf", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFormData((prev) => ({ ...prev, filePublicId: data.publicId }));
      toast({ title: "Book PDF uploaded" });
    } catch (err) {
      toast({ title: err.message || "Upload failed", variant: "destructive" });
    } finally {
      setUploadingPdf(false);
      e.target.value = "";
    }
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      total: String(book.total || 10),
      available: String(book.available ?? book.total ?? 10),
      image: book.image || "",
      filePublicId: book.filePublicId || "",
    });
    setShowAddModal(true);
  };

  const statItems = [
    { label: "Total Books", value: String(stats.totalBooks ?? 0), change: "", trend: "neutral", key: "totalBooks" },
    { label: "Active Users", value: String(stats.activeUsers ?? 0), change: "", trend: "neutral", key: "activeUsers" },
    { label: "Issued Books", value: String(stats.issuedBooks ?? 0), change: "", trend: "neutral", key: "issuedBooks" },
    { label: "Overdue", value: String(stats.overdue ?? 0), change: "", trend: "neutral", key: "overdue" },
  ];

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-16">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 pb-24 lg:pb-0">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
              <p className="text-slate-500 font-medium">Libzone management system</p>
            </div>
            <Button onClick={() => { setEditingBook(null); setFormData({ title: "", author: "", category: "", total: "10", available: "10", image: "", filePublicId: "" }); setShowAddModal(true); }} className="bg-primary hover:bg-blue-600 shadow-xl shadow-blue-500/20 gap-2 h-12 px-8 rounded-2xl font-bold shrink-0">
              <Plus className="h-5 w-5" />
              Add New Book
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat) => (
              <StatCard key={stat.key} label={stat.label} value={stat.value} change={stat.change} trend={stat.trend} icon={ICONS[stat.key]} />
            ))}
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <Library className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 truncate">Inventory Management</h3>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-widest mt-0.5">Live Stock Status</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
                  <Input placeholder="Filter by title, author, category..." className="pl-12 h-12 bg-slate-50 border-none rounded-xl font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 bg-slate-50/50">
                    <TableHead className="w-[100px] pl-4 md:pl-8">Cover</TableHead>
                    <TableHead>Title & Author</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right pr-4 md:pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book._id} className="hover:bg-slate-50/50 h-24">
                      <TableCell className="pl-4 md:pl-8">
                        <div className="relative w-10 h-14 shrink-0">
                          <Image src={book.image || "/book-1.png"} alt="" fill className="object-cover rounded shadow-sm ring-1 ring-slate-100" sizes="40px" />
                        </div>
                      </TableCell>
                      <TableCell className="min-w-0">
                        <div className="font-bold text-slate-900 leading-tight truncate">{book.title}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight truncate">{book.author}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="border-slate-100 text-slate-500 font-bold">
                          {book.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 w-24">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>Stock</span>
                            <span>{Math.round(((book.available || 0) / (book.total || 1)) * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", (book.available || 0) > 5 ? "bg-green-500" : "bg-amber-500")} style={{ width: `${((book.available || 0) / (book.total || 1)) * 100}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4 md:pr-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl shrink-0" onClick={() => openEdit(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl shrink-0" onClick={() => handleDelete(book)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredBooks.length === 0 && (
                <div className="p-12 text-center text-slate-500">No books found.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 sm:px-8 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl safe-area-pb">
        <Link href="/admin" className="flex flex-col items-center gap-1 text-primary">
          <LayoutGrid className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Dashboard</span>
        </Link>
        <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 p-0 text-slate-400" onClick={() => toast({ title: "Use Dashboard" })}>
          <Library className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Books</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 p-0 text-slate-400" onClick={() => toast({ title: "Coming Soon" })}>
          <Users className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Users</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 p-0 text-slate-400" onClick={() => toast({ title: "Coming Soon" })}>
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase">Settings</span>
        </Button>
      </div>

      <Dialog open={showAddModal} onOpenChange={(v) => { if (!v) { setShowAddModal(false); setEditingBook(null); } }}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-black">{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
            <DialogDescription className="font-medium">Complete the details below to update the inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-bold text-slate-700">Book Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="h-12 rounded-xl bg-slate-50 border-none font-medium" placeholder="Enter title" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author" className="font-bold text-slate-700">Author</Label>
                <Input id="author" value={formData.author} onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))} className="h-12 rounded-xl bg-slate-50 border-none font-medium" placeholder="Author" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="font-bold text-slate-700">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="flex h-12 w-full rounded-xl bg-slate-50 border border-transparent px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select category</option>
                  {[...new Set([formData.category, ...BOOK_CATEGORIES])].filter(Boolean).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Book PDF</Label>
              <p className="text-xs text-slate-500 -mt-1">Upload the PDF file for this book (max 20MB)</p>
              <div className="flex flex-wrap gap-4 items-center">
                {formData.filePublicId && (
                  <p className="text-xs text-emerald-600 font-medium break-all">PDF uploaded</p>
                )}
                <input
                  id="book-pdf-upload"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                />
                <Button asChild type="button" variant="outline" disabled={uploadingPdf} className="min-w-[120px]">
                  <label htmlFor="book-pdf-upload" className="cursor-pointer">
                    {uploadingPdf ? "Uploading..." : formData.filePublicId ? "Change PDF" : "Upload PDF"}
                  </label>
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Cover Image</Label>
              <p className="text-xs text-slate-500 -mt-1">JPEG, PNG or WebP, max 5MB</p>
              <div className="flex flex-wrap gap-4 items-center">
                {formData.image && (
                  <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden bg-slate-100">
                    <Image src={formData.image} alt="Cover" fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <input
                  id="book-cover-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <Button asChild type="button" variant="outline" disabled={uploading} className="min-w-[100px]">
                  <label htmlFor="book-cover-upload" className="cursor-pointer">
                    {uploading ? "Uploading..." : formData.image ? "Change" : "Upload"}
                  </label>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock" className="font-bold text-slate-700">Total Stock</Label>
                <Input id="stock" type="number" min="1" value={formData.total} onChange={(e) => setFormData((p) => ({ ...p, total: e.target.value }))} className="h-12 rounded-xl bg-slate-50 border-none font-medium" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="available" className="font-bold text-slate-700">Available</Label>
                <Input id="available" type="number" min="0" value={formData.available} onChange={(e) => setFormData((p) => ({ ...p, available: e.target.value }))} className="h-12 rounded-xl bg-slate-50 border-none font-medium" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowAddModal(false); setEditingBook(null); }} className="font-bold rounded-xl h-12 px-6" disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-blue-600 font-bold rounded-xl h-12 px-8 shadow-xl shadow-blue-500/20" disabled={saving}>
              {saving ? <Spinner className="h-4 w-4" /> : "Save Inventory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
