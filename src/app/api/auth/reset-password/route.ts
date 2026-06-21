import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Password rules validation
    if (newPassword.length < 8 || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "Password does not meet the security requirements." }, { status: 400 });
    }

    const formattedEmail = email.trim().toLowerCase();
    isDbConfigured();

    const otpRecord = await prisma.verificationOtp.findFirst({
      where: { email: formattedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    }

    if (otpRecord.attempts >= 5) {
      await prisma.verificationOtp.deleteMany({ where: { email: formattedEmail } });
      return NextResponse.json({ error: "Too many failed attempts. Please request a new code." }, { status: 429 });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.verificationOtp.deleteMany({ where: { email: formattedEmail } });
      return NextResponse.json({ error: "Code has expired. Please request a new code." }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      await prisma.verificationOtp.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
      });
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    const saltRounds = process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email: formattedEmail },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await prisma.verificationOtp.deleteMany({
      where: { email: formattedEmail },
    });

    return NextResponse.json({ message: "Password has been successfully reset." }, { status: 200 });
  } catch (error: any) {
    console.error("[Reset Password Error]:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
