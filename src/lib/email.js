import nodemailer from "nodemailer";
import { getOtpEmailHtml, getOtpEmailText } from "./email-templates/otp";
import { getWelcomeEmailHtml, getWelcomeEmailText } from "./email-templates/welcome";

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS must be set in .env");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOtpEmail(to, otp, userName = "there") {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "Libzone <noreply@libzone.com>";
  const subject = "Verify your Libzone account – Your code is inside";

  const html = getOtpEmailHtml(otp, userName);
  const text = getOtpEmailText(otp, userName);

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

export async function sendWelcomeEmail(to, userName = "Reader") {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "Libzone <noreply@libzone.com>";
  const subject = "Welcome to Libzone – You're all set! 🎉";

  const html = getWelcomeEmailHtml(userName);
  const text = getWelcomeEmailText(userName);

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}
