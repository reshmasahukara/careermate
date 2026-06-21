import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { verifyTransporter, sendOtpEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    
    const formattedEmail = email.trim().toLowerCase();
    isDbConfigured();

    const existingUser = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (!existingUser) {
      // Return 200 even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a verification code was sent." }, { status: 200 });
    }

    // Check resend limits (60 seconds)
    const existingOtp = await prisma.verificationOtp.findFirst({
      where: { email: formattedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (existingOtp) {
      const secondsSinceLastOtp = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
      if (secondsSinceLastOtp < 60) {
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(60 - secondsSinceLastOtp)} seconds before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    const transporterCheck = await verifyTransporter();
    if (!transporterCheck.success) {
      return NextResponse.json({ error: transporterCheck.error }, { status: 500 });
    }

    await prisma.verificationOtp.deleteMany({
      where: { email: formattedEmail },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationOtp.create({
      data: {
        email: formattedEmail,
        otpHash,
        expiresAt,
        verified: false,
        attempts: 0,
      },
    });

    const emailResult = await sendOtpEmail(formattedEmail, otp);
    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "If an account exists, a verification code was sent." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Forgot Password Error]:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
