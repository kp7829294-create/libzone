import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createAndSendOtp } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    const emailStr = (email || "").trim().toLowerCase();
    if (!emailStr) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    await connectDB();
    const existing = await User.findOne({ email: emailStr });
    if (existing) {
      return NextResponse.json({ error: "Email already registered. Please log in." }, { status: 400 });
    }
    const userName = (name || "").trim() || "there";
    await createAndSendOtp(emailStr, userName);
    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: "Email service is not configured. Please add SMTP_USER and SMTP_PASS to .env" },
        { status: 503 }
      );
    }
    if (err.code === "EAUTH" || err.code === "ECONNECTION" || err.command === "CONN") {
      return NextResponse.json(
        { error: "Could not send email. Check your SMTP credentials." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
