import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (body.name != null) user.name = body.name.trim();
    if (body.avatar != null) user.avatar = body.avatar;

    if (body.currentPassword != null && body.newPassword != null) {
      const u = await User.findById(session.id).select("+password");
      const valid = await u.comparePassword(body.currentPassword);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      user.password = body.newPassword;
    }

    await user.save();
    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error("User update error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
