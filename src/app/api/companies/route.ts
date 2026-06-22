import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const includeJobs = searchParams.get("includeJobs") === "true";

    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { jobs: true }
        },
        ...(includeJobs ? { jobs: { take: 5, orderBy: { createdAt: "desc" } } } : {})
      },
      orderBy: {
        jobs: {
          _count: "desc"
        }
      },
      take: limit
    });

    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error("Companies fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
