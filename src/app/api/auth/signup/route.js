import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password, otp } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }
    if (!otp || String(otp).length !== 6) {
      return NextResponse.json({ error: "Valid 6-digit OTP is required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const emailStr = email.trim().toLowerCase();
    const valid = await verifyOtp(emailStr, otp);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new code." },
        { status: 400 }
      );
    }
    await connectDB();
    const existing = await User.findOne({ email: emailStr });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    // Signup always creates students; admins are added manually in the database
    const user = await User.create({
      name: name.trim(),
      email: emailStr,
      password,
      role: "student",
    });
    const token = await createToken({ id: user._id.toString(), role: user.role });
    await setAuthCookie(token);
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr);
    }
    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
