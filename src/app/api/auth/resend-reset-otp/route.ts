import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    const latestToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestToken) {
      const secondsSinceLastOtp = (Date.now() - latestToken.createdAt.getTime()) / 1000;
      if (secondsSinceLastOtp < 60) {
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(60 - secondsSinceLastOtp)} seconds before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    const transporter = (await import("@/lib/mailer")).getTransporter();
    const mailOptions = {
      from: `"CareerMate" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "CareerMate Password Reset Verification Code",
      text: `Hello ${user.name || "User"},\n\nWe received a request to reset your CareerMate password.\n\nYour verification code is:\n\n${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this password reset, please ignore this email.\n\n— CareerMate Team`,
    };
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Verification code sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
