import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const remote = searchParams.get("remote");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      // Assuming skills or title contains category
      whereClause.OR = [
        ...(whereClause.OR || []),
        { title: { contains: category, mode: "insensitive" } },
        { skills: { has: category } }
      ];
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (experience) {
      whereClause.experienceLevel = { contains: experience, mode: "insensitive" };
    }

    if (remote === "remote") {
      whereClause.remote = true;
    } else if (remote === "onsite") {
      whereClause.remote = false;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.job.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
