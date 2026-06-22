import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

    // Test DB connection
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      env: {
        GOOGLE_CLIENT_ID: hasClientId,
        GOOGLE_CLIENT_SECRET: hasClientSecret,
        NEXTAUTH_URL: hasNextAuthUrl,
        NEXTAUTH_SECRET: hasNextAuthSecret,
      },
      database: {
        connected: true,
        userCount,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message
    }, { status: 500 });
  }
}
