"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?redirect=" + encodeURIComponent(pathname || "/"));
      return;
    }
    if (requireRole === "admin" && user.role !== "admin") {
      router.replace("/student");
    } else if (requireRole === "student" && user.role !== "student") {
      router.replace("/admin");
    }
  }, [user, loading, requireRole, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!user) return null;
  if (requireRole === "admin" && user.role !== "admin") return null;
  if (requireRole === "student" && user.role !== "student") return null;

  return children;
}
