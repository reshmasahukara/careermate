"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function getJobsAction({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  isDbConfigured();

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    // Assuming category filters on title or a specific category field.
    // For now, we'll map category to a generic search or title filter if jobs table doesn't have a strict category.
    where.title = { contains: category, mode: "insensitive" };
  }

  try {
    const jobs = await prisma.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    
    const total = await prisma.job.count({ where });

    return {
      jobs,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (e) {
    console.error("Prisma error fetching jobs:", e);
    throw new Error("Failed to fetch jobs.");
  }
}
