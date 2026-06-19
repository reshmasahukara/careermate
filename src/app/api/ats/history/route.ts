import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const reports = await prisma.aTSAnalysis.findMany({
      where: {
        userId,
        resumeName: {
          contains: search,
          mode: "insensitive"
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("ATS History endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch scan history." }, { status: 500 });
  }
}
