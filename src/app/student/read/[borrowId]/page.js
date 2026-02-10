"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function StudentReadContent() {
  const router = useRouter();
  const params = useParams();
  const borrowId = params?.borrowId;

  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!borrowId) return;
    // The iframe will call the protected streaming endpoint directly.
    setUrl(`/api/borrows/read/${borrowId}?stream=1`);
    setLoading(false);
    setError("");
  }, [borrowId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" className="gap-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {loading ? (
            <div className="min-h-[60vh] flex items-center justify-center bg-white rounded-2xl border border-slate-100">
              <Spinner className="h-12 w-12" />
            </div>
          ) : error ? (
            <div className="min-h-[60vh] flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <div className="space-y-2">
                <p className="font-bold text-slate-900">Cannot open this book</p>
                <p className="text-sm text-slate-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="relative w-full h-[75vh] sm:h-[80vh]">
                <iframe
                  title="Book Reader"
                  src={url}
                  className="absolute inset-0 w-full h-full"
                  allow="fullscreen"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StudentReadPage() {
  return (
    <ProtectedRoute requireRole="student">
      <StudentReadContent />
    </ProtectedRoute>
  );
}

