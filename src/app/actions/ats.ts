"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function analyzeResumeAction(
  resumeId: string,
  targetRole: string,
  industry: string,
  experienceLevel: string
) {
  isDbConfigured();

  try {
    // Check if we already have an analysis for this resume and role
    const existing = await prisma.atsScore.findFirst({
      where: { resumeId, targetRole }
    });

    if (existing) return existing;

    // Simulate match logic
    const score = Math.floor(Math.random() * 30) + 60; // 60-90
    
    // Simulate keyword extraction based on target role
    const allKeywords = [
      "React", "Node.js", "TypeScript", "Agile", "REST APIs", 
      "AWS", "Docker", "CI/CD", "PostgreSQL", "System Design"
    ];
    
    const shuffled = allKeywords.sort(() => 0.5 - Math.random());
    const keywordsFound = shuffled.slice(0, 6);
    const keywordsMissing = shuffled.slice(6, 10);

    const newScore = await prisma.atsScore.create({
      data: {
        resumeId,
        targetRole,
        score,
        keywordsFound,
        keywordsMissing,
        formattingFeedback: "Your resume structure is solid but lacks measurable metrics in the experience section.",
        sectionAnalysis: "JSON String representation of section scores or details.",
        improvements: "1. Add more quantifiable achievements. 2. Include missing keywords in a dedicated skills section."
      }
    });

    return newScore;
  } catch (e) {
    console.error("Prisma error analyzing resume:", e);
    throw new Error("Failed to analyze resume.");
  }
}

export async function getAtsScoresAction(resumeId: string) {
  isDbConfigured();
  try {
    return await prisma.atsScore.findMany({
      where: { resumeId },
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Prisma error getting ATS scores:", e);
    return [];
  }
}
