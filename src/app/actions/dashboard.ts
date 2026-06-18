"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function getDashboardDataAction(userId: string) {
  isDbConfigured();
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const resumesCount = await prisma.resume.count({ where: { userId } });
    const skillsCount = await prisma.userSkill.count({ where: { userId } });
    const careerPathsCount = await prisma.careerPath.count({ where: { userId } });
    const atsScoresCount = await prisma.atsScore.count({ where: { resume: { userId } } });

    // Pending Actions calculation
    const pendingActions = [];
    if (careerPathsCount === 0) {
      pendingActions.push({
        title: "Define Target Role",
        desc: "Required for Skill Gap Analysis",
        href: "/roadmap",
      });
    }
    if (atsScoresCount === 0) {
      pendingActions.push({
        title: "Run ATS Match",
        desc: "Scan your latest resume",
        href: "/ats-checker",
      });
    }
    if (skillsCount < 5) {
      pendingActions.push({
        title: "Add Skills",
        desc: "Add at least 5 skills to your profile",
        href: "/skill-gap",
      });
    }

    // Progress percentage
    let progress = 25; // Base sign up
    if (resumesCount > 0) progress += 25;
    if (skillsCount > 0) progress += 25;
    if (careerPathsCount > 0) progress += 25;

    return {
      recentResumes: resumes,
      stats: {
        resumes: resumesCount,
        skills: skillsCount,
        paths: careerPathsCount,
        atsChecks: atsScoresCount,
      },
      pendingActions,
      progress,
    };
  } catch (e) {
    console.error("Prisma error getting dashboard data:", e);
    throw new Error("Failed to load dashboard data.");
  }
}
