"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

export async function getSavedJobsAction(userId: string) {
  if (isDbConfigured()) {
    try {
      const saves = await prisma.savedJob.findMany({
        where: { userId },
        include: { job: true },
      });
      return saves.map((s) => s.job);
    } catch (e) {
      console.error("Prisma error fetching saved jobs:", e);
    }
  }
  return mockDb.getSavedJobs(userId);
}

export async function toggleSaveJobAction(userId: string, jobId: string) {
  if (isDbConfigured()) {
    try {
      const existing = await prisma.savedJob.findUnique({
        where: {
          userId_jobId: { userId, jobId },
        },
      });

      if (existing) {
        await prisma.savedJob.delete({
          where: {
            userId_jobId: { userId, jobId },
          },
        });
        return false; // Job unsaved
      } else {
        await prisma.savedJob.create({
          data: { userId, jobId },
        });
        return true; // Job saved
      }
    } catch (e) {
      console.error("Prisma error toggling save job:", e);
    }
  }
  return mockDb.saveJob(userId, jobId);
}
