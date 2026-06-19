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
    const otpHash = await bcrypt.hash(otp, 12);

    // Delete any existing OTPs for this email
    await prisma.emailVerification.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Save new OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma.emailVerification.create({
      data: {
        email: email.toLowerCase(),
        otpHash,
        expiresAt,
      },
    });

    // Send email via Resend
    const { sendVerificationEmail } = await import("@/lib/email");
    const emailResult = await sendVerificationEmail(email.toLowerCase(), otp);

    if (!emailResult.success) {
      console.error("Failed to send email", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent successfully.", email: email.toLowerCase() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
