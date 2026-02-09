"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Library, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const dest = (redirect.startsWith("/student") && user.role === "student") || (redirect.startsWith("/admin") && user.role === "admin") ? redirect : user.role === "admin" ? "/admin" : "/student";
      router.replace(dest);
    }
  }, [user, authLoading, router, redirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success("Welcome back!");
      const dest = (redirect.startsWith("/student") && u.role === "student") || (redirect.startsWith("/admin") && u.role === "admin") ? redirect : u.role === "admin" ? "/admin" : "/student";
      router.replace(dest);
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-200/30 rounded-full blur-[100px]"></div>
        </div>
        <div className="w-full max-w-[450px] z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors gap-2 group mb-6">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
            <div className="mx-auto bg-primary p-3 rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center mb-4">
              <Library className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-black text-4xl text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 font-medium mt-2">Continue your learning journey on Libzone.</p>
          </div>
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-8 pt-8 sm:pt-10 space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Campus Email</Label>
                  <Input id="email" name="email" type="email" placeholder="name@university.edu" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                  </div>
                  <PasswordInput id="password" name="password" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 rounded-2xl mt-4 group" disabled={loading}>
                  {loading ? <Spinner className="h-5 w-5 border-2" /> : "Sign In"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center py-6 bg-slate-50/50 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                New to Libzone?{" "}
                <Link href="/signup" className="font-black text-blue-600 hover:underline">Create Account</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
