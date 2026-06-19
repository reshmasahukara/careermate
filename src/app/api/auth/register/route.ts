import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    isDbConfigured();

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await prisma.verificationOtp.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Save new OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma.verificationOtp.create({
      data: {
        email: email.toLowerCase(),
        otp,
        expiresAt,
      },
    });

    // Send email via Nodemailer
    const { getTransporter } = await import("@/lib/mailer");
    const transporter = getTransporter();
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error(`Email environment variables missing. USER: ${!!process.env.EMAIL_USER}, PASS: ${!!process.env.EMAIL_APP_PASSWORD}`);
    }

    await transporter.sendMail({
      from: `"CareerMate" <${process.env.EMAIL_USER}>`,
      to: email.toLowerCase(),
      subject: "Verify your CareerMate account",
      html: `
        <h2>Your CareerMate OTP</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "Verification code sent successfully.", email: email.toLowerCase() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed." },
      { status: 500 }
    );
  }
}
