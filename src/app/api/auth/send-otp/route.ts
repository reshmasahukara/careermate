import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { verifyTransporter, sendOtpEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

// 1. Verify required environment variables
const REQUIRED_ENV_VARS = ["EMAIL_USER", "EMAIL_APP_PASSWORD", "JWT_SECRET", "DATABASE_URL"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((env) => !process.env[env]);

// 2. On server startup, log
console.log({
  emailUserExists: !!process.env.EMAIL_USER,
  emailPasswordExists: !!process.env.EMAIL_APP_PASSWORD,
});

export async function POST(req: NextRequest) {
  try {
    if (missingEnvVars.length > 0) {
      console.error(`[Server Config Error]: Missing environment variables: ${missingEnvVars.join(", ")}`);
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    let { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    
    email = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    isDbConfigured();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check resend limits (60 seconds)
    const existingOtp = await prisma.verificationOtp.findFirst({
      where: { email },
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

    // 4. Before sending OTP, verify the transporter
    const transporterCheck = await verifyTransporter();
    if (!transporterCheck.success) {
      return NextResponse.json(
        { error: transporterCheck.error },
        { status: 500 }
      );
    }

    // Delete any existing OTPs for this email to enforce 1 active OTP
    await prisma.verificationOtp.deleteMany({
      where: { email },
    });

    // 6. Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[OTP Info]: Generated OTP for ${email}`);

    // Hash the OTP before saving
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // Save new OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma.verificationOtp.create({
      data: {
        email,
        otpHash,
        expiresAt,
        verified: false,
        attempts: 0,
      },
    });

    // Send the email
    const emailResult = await sendOtpEmail(email, otp);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent successfully.", email },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Send OTP Error]:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again later." },
      { status: 500 }
    );
  }
}
