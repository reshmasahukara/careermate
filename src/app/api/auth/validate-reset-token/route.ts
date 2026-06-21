import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token is required" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ valid: false, error: "Token has already been used" }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Token has expired" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, email: resetToken.user.email }, { status: 200 });
  } catch (error) {
    console.error("Validate Token Error:", error);
    return NextResponse.json({ valid: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
