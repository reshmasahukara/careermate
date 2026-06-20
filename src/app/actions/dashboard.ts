"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function getDashboardDataAction(userId: string) {
  isDbConfigured();
  try {
    const [resumes, resumesCount, skillsCount, careerPaths, atsScores, subscription] =
      await Promise.all([
        prisma.resume.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { atsScores: { orderBy: { createdAt: "desc" }, take: 1 } },
        }),
        prisma.resume.count({ where: { userId } }),
        prisma.userSkill.count({ where: { userId } }),
        prisma.careerPath.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 1,
        }),
        prisma.atsScore.findMany({
          where: { resume: { userId } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.subscription.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const careerPathsCount = careerPaths.length;
    const atsScoresCount = atsScores.length;
    const latestAtsScore = atsScores[0]?.score ?? null;
    const highestAtsScore = atsScores.length > 0 ? Math.max(...atsScores.map((s) => s.score)) : null;
    const latestResume = resumes[0] ?? null;

    // Build activity timeline from real data
    const activityItems: { type: string; label: string; detail: string; date: Date; href: string }[] = [];
    for (const resume of resumes) {
      activityItems.push({
        type: "resume",
        label: `Resume uploaded`,
        detail: resume.fileName,
        date: resume.createdAt,
        href: `/ats-checker?resumeId=${resume.id}`,
      });
      if (resume.atsScores[0]) {
        activityItems.push({
          type: "ats",
          label: `ATS scan completed`,
          detail: `Score: ${resume.atsScores[0].score}/100 for ${resume.atsScores[0].targetRole}`,
          date: resume.atsScores[0].createdAt,
          href: `/ats-checker`,
        });
      }
    }
    activityItems.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Pending Actions / Smart Actions
    const pendingActions: { title: string; desc: string; href: string; priority: "high" | "recommended" | "optional" }[] = [];
    if (resumesCount === 0) {
      pendingActions.push({ title: "Upload your resume", desc: "Required to unlock all features", href: "/resume-upload", priority: "high" });
    }
    if (atsScoresCount === 0 && resumesCount > 0) {
      pendingActions.push({ title: "Run ATS scan", desc: "Check compatibility with job descriptions", href: "/ats-checker", priority: "high" });
    }
    if (skillsCount < 5) {
      pendingActions.push({ title: "Add your skills", desc: "Improve skill gap analysis accuracy", href: "/skill-gap", priority: "recommended" });
    }
    if (careerPathsCount === 0) {
      pendingActions.push({ title: "Set a target role", desc: "Generate a personalized roadmap", href: "/career-pathways", priority: "recommended" });
    }
    pendingActions.push({ title: "Explore job matches", desc: "Browse jobs that match your profile", href: "/jobs", priority: "optional" });

    // Progress percentage
    let progress = 20;
    if (resumesCount > 0) progress += 20;
    if (skillsCount >= 5) progress += 20;
    if (careerPathsCount > 0) progress += 20;
    if (atsScoresCount > 0) progress += 20;

    // Generate ATS history from real data
    const atsHistory = atsScores.map((s) => ({ date: s.createdAt, score: s.score })).slice(0, 10).reverse();

    // Career readiness score
    const careerReadiness = Math.round(
      ((resumesCount > 0 ? 25 : 0) +
        (skillsCount >= 5 ? 25 : skillsCount * 5) +
        (careerPathsCount > 0 ? 25 : 0) +
        (atsScoresCount > 0 ? Math.min(25, latestAtsScore ?? 0) / 4 : 0))
    );

    return {
      user: { id: userId },
      recentResumes: resumes,
      latestResume,
      stats: {
        resumes: resumesCount,
        skills: skillsCount,
        paths: careerPathsCount,
        atsChecks: atsScoresCount,
      },
      ats: {
        latest: latestAtsScore,
        highest: highestAtsScore,
        history: atsHistory,
        latestTargetRole: atsScores[0]?.targetRole ?? null,
        keywordsFound: atsScores[0]?.keywordsFound ?? [],
        keywordsMissing: atsScores[0]?.keywordsMissing ?? [],
      },
      careerPath: careerPaths[0] ?? null,
      subscription,
      pendingActions,
      activityItems: activityItems.slice(0, 8),
      progress,
      careerReadiness: Math.min(100, careerReadiness),
    };
  } catch (e) {
    console.error("Prisma error getting dashboard data:", e);
    throw new Error("Failed to load dashboard data.");
  }
}
