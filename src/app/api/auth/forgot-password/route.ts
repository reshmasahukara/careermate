import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

// Rate limiting map (in-memory, ideally Redis in production)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Rate Limiting (3 per hour)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateLimitData = rateLimit.get(ip);
    
    if (rateLimitData) {
      if (now - rateLimitData.timestamp < 3600000) { // 1 hour
        if (rateLimitData.count >= 3) {
          return NextResponse.json({ error: "Too many reset requests. Please try again later." }, { status: 429 });
        }
        rateLimitData.count += 1;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // Always return a generic success message
    const successResponse = NextResponse.json(
      { message: "If an account exists for this email, we've sent password reset instructions." },
      { status: 200 }
    );

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      // User doesn't exist, still return generic message to prevent enumeration
      return successResponse;
    }

    // Generate a secure 32-byte hex token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate old tokens
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Store new token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send email
    await sendPasswordResetEmail(user.email, token, user.name);

    return successResponse;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
