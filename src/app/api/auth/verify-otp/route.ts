import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!email || !password || !name || !otp) {
      return NextResponse.json(
        { error: "All fields are required." },
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

    // Find the OTP record
    const otpRecord = await prisma.verificationOtp.findFirst({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired code." },
        { status: 400 }
      );
    }

    // Check Max Attempts
    if (otpRecord.attempts >= 5) {
      await prisma.verificationOtp.deleteMany({ where: { email: email.toLowerCase() } });
      console.log(`[OTP Info]: Verification locked out due to too many attempts for ${email.toLowerCase()}`);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    // Check Expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.verificationOtp.deleteMany({ where: { email: email.toLowerCase() } });
      return NextResponse.json(
        { error: "Code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify OTP using bcrypt
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      // Increment attempts
      await prisma.verificationOtp.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
      });
      console.log(`[OTP Info]: Invalid OTP attempt for ${email.toLowerCase()}. Attempt ${otpRecord.attempts + 1}/5`);
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    // OTP is valid! Mark as verified
    await prisma.verificationOtp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });
    console.log(`[OTP Info]: Successfully verified OTP for ${email.toLowerCase()}`);

    // Hash the user's password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: true,
      },
    });

    // Delete the used OTP
    await prisma.verificationOtp.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Email verified successfully. Account created.", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Verify OTP Error]:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again later." },
      { status: 500 }
    );
  }
}
