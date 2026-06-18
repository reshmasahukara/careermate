import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Attempt a simple database query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json({ database: "disconnected" }, { status: 503 });
  }
}
