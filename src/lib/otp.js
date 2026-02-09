import { connectDB } from "./db";
import Otp from "../models/Otp";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const EXPIRY_MINUTES = 10;

export async function createAndSendOtp(email, userName = "there") {
  await connectDB();
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await Otp.deleteMany({ email: email.toLowerCase() });
  await Otp.create({
    email: email.toLowerCase(),
    otp,
    expiresAt,
  });

  const { sendOtpEmail } = await import("./email.js");
  await sendOtpEmail(email, otp, userName);
}

export async function verifyOtp(email, otp) {
  await connectDB();
  const record = await Otp.findOne({
    email: email.toLowerCase(),
    otp: String(otp),
  });
  if (!record) return false;
  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ _id: record._id });
    return false;
  }
  await Otp.deleteOne({ _id: record._id });
  return true;
}
