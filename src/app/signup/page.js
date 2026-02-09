"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Library, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";

export default function Signup() {
  const router = useRouter();
  const { user, loading: authLoading, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [formData, setFormData] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/student");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.pass.value;
    const confirm = e.target.conf.value;
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setFormData({ name, email, password });
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      toast.success("Verification code sent to your email");
      setShowOtp(true);
      setOtpValue("");
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.message || "Failed to send code");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResend = async () => {
    if (!formData || resendCooldown > 0) return;
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      toast.success("New code sent!");
      setOtpValue("");
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.message || "Failed to resend");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }
    if (!formData) return;
    setLoading(true);
    try {
      const u = await signup(formData.name, formData.email, formData.password, otpValue);
      toast.success("Account created!");
      setShowOtp(false);
      router.replace(u.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      toast.error(err.message || "Verification failed");
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
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative pt-20 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-200/30 rounded-full blur-[100px]"></div>
        </div>
        <div className="w-full max-w-[480px] z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors gap-2 group mb-6">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
            <div className="mx-auto bg-indigo-600 p-3 rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center mb-4">
              <Library className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-black text-4xl text-slate-900 tracking-tight">Create account</h1>
            <p className="text-slate-500 font-medium mt-2">Join the future of campus libraries.</p>
          </div>
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-8 pt-8 sm:pt-10 space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold text-slate-700 ml-1">Full Name</Label>
                  <Input id="name" name="name" placeholder="Alex Johnson" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium" required disabled={loading || sendingOtp} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Campus Email</Label>
                  <Input id="email" name="email" type="email" placeholder="name@university.edu" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium" required disabled={loading || sendingOtp} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pass" className="font-bold text-slate-700 ml-1">Password</Label>
                    <PasswordInput id="pass" name="pass" placeholder="••••••••" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" required disabled={loading || sendingOtp} minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conf" className="font-bold text-slate-700 ml-1">Confirm</Label>
                    <PasswordInput id="conf" name="conf" placeholder="••••••••" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium" required disabled={loading || sendingOtp} />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 rounded-2xl mt-4 group" disabled={loading || sendingOtp}>
                  {sendingOtp ? <><Spinner className="h-5 w-5 mr-2" /> Sending code...</> : <>Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center py-6 bg-slate-50/50 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="font-black text-indigo-600 hover:underline">Log in</Link>
              </p>
            </CardFooter>
          </Card>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-8 px-8">
            By creating an account you agree to our terms of service and privacy policy.
          </p>
        </div>
      </main>

      <Dialog open={showOtp} onOpenChange={(v) => { if (!loading) setShowOtp(v); }}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
          <DialogHeader className="space-y-4 items-center text-center">
            <div className="bg-indigo-50 w-16 h-16 rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-display text-3xl font-black">Verify your email</DialogTitle>
              <DialogDescription className="font-medium text-slate-500">
                We&apos;ve sent a 6-digit code to <strong className="text-slate-700">{formData?.email}</strong>. Enter it below to complete your registration. The code expires in 10 minutes.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl font-bold rounded-xl border-slate-200" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-4">
            <Button onClick={handleVerify} disabled={otpValue.length < 6 || loading} className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 rounded-2xl">
              {loading ? <Spinner className="h-5 w-5 border-2 border-white" /> : "Complete Registration"}
            </Button>
            <Button variant="ghost" onClick={handleResend} disabled={resendCooldown > 0 || sendingOtp || loading} className="w-full font-bold text-slate-500 hover:text-indigo-600">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : sendingOtp ? "Sending..." : "Resend Code"}
            </Button>
            <Button variant="ghost" onClick={() => setShowOtp(false)} className="w-full font-bold text-slate-400" disabled={loading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
