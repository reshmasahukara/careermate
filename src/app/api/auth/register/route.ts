import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    let { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    
    email = email.trim();

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

    // Debug logging for OTP configuration
    console.log({
      userLoaded: !!process.env.EMAIL_USER,
      passwordLoaded: !!process.env.EMAIL_APP_PASSWORD,
    });

    let emailSent = false;
    let emailError = null;

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        throw new Error("SMTP credentials (EMAIL_USER/EMAIL_APP_PASSWORD) are not configured in environment variables.");
      }

      // Send email via Nodemailer
      const { getTransporter } = await import("@/lib/mailer");
      const transporter = getTransporter();

      await transporter.sendMail({
        from: `"CareerMate" <${process.env.EMAIL_USER}>`,
        to: email.toLowerCase(),
        subject: "Verify your CareerMate account",
        text: `Welcome to CareerMate! Your verification code is ${otp}. This code will expire in 10 minutes. If you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #10b981; font-weight: 800;">Welcome to CareerMate!</h2>
            <p style="color: #4b5563; font-size: 14px;">Thank you for registering. Please verify your email using the following One-Time Password (OTP):</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #111827; margin: 24px 0;">
              ${otp}
            </div>
            <p style="color: #9ca3af; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      emailSent = true;
      console.log(`[Email] OTP successfully sent to ${email.toLowerCase()}`);
    } catch (err: any) {
      emailError = err.message || err;
      console.error("[Email Error] Failed to send OTP email:", err);
      
      // Print OTP to terminal in highly visible format so developers/testers can always retrieve it
      console.log("\n==================================================");
      console.log(`[OTP BACKUP] Generated OTP for ${email.toLowerCase()}: ${otp}`);
      console.log("==================================================\n");
    }

    return NextResponse.json(
      { 
        message: emailSent ? "Verification code sent successfully." : "Verification code generated.", 
        email: email.toLowerCase(),
        warning: emailSent ? undefined : "Email delivery failed, but registration is pending. Please verify using the OTP from server terminal logs."
      },
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
