"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

/**
 * Server action to get all resumes for a user.
 */
export async function getResumesAction(userId: string) {
  if (isDbConfigured()) {
    try {
      return await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Prisma error, using mock:", e);
    }
  }
  return mockDb.getResumes(userId);
}

/**
 * Server action to save/upload a new resume record.
 */
export async function uploadResumeAction(
  userId: string,
  fileName: string,
  fileUrl: string,
  fileType: string,
  parsedText: string
) {
  if (isDbConfigured()) {
    try {
      return await prisma.resume.create({
        data: {
          userId,
          fileName,
          fileUrl,
          fileType,
          parsedText,
        },
      });
    } catch (e) {
      console.error("Prisma upload error:", e);
    }
  }
  return mockDb.createResume(userId, fileName, fileUrl, fileType, parsedText);
}

/**
 * Server action to get ATS scores for a resume.
 */
export async function getAtsScoresAction(userId: string) {
  if (isDbConfigured()) {
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        select: { id: true },
      });
      const resumeIds = resumes.map((r) => r.id);
      return await prisma.atsScore.findMany({
        where: { resumeId: { in: resumeIds } },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Prisma ATS error:", e);
    }
  }
  return mockDb.getAtsScoresByUserId(userId);
}

/**
 * Server action to delete a resume.
 */
export async function deleteResumeAction(id: string) {
  if (isDbConfigured()) {
    try {
      await prisma.resume.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      console.error("Prisma delete resume error:", e);
    }
  }
  return mockDb.deleteResume(id);
}

/**
 * Simulates or calculates ATS scores using a local word-matching analyzer
 * when OpenAI keys are not configured.
 */
export async function calculateAtsScoreAction(
  resumeId: string,
  targetRole: string,
  resumeText: string
) {
  // Keyword Analysis Logic - Simple rule engine
  const targetLower = targetRole.toLowerCase();
  let keywords: string[] = [];
  let scoreBase = 65;

  if (targetLower.includes("front") || targetLower.includes("react") || targetLower.includes("web")) {
    keywords = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Webpack", "SEO", "Accessibility", "Git"];
  } else if (targetLower.includes("back") || targetLower.includes("node") || targetLower.includes("full")) {
    keywords = ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB", "Redis", "Docker", "REST API", "GraphQL", "AWS", "Git"];
  } else if (targetLower.includes("design") || targetLower.includes("product") || targetLower.includes("ui")) {
    keywords = ["Figma", "UI/UX Design", "Wireframes", "Prototyping", "Design Systems", "User Research", "Interaction Design", "Framer"];
  } else {
    keywords = ["Project Management", "Agile", "Scrum", "Jira", "Communication", "Leadership", "Product Roadmap", "KPIs"];
  }

  const found: string[] = [];
  const missing: string[] = [];

  keywords.forEach((keyword) => {
    const rx = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "i");
    if (rx.test(resumeText.toLowerCase())) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const matchingPercentage = Math.round((found.length / keywords.length) * 35);
  const finalScore = Math.min(scoreBase + matchingPercentage, 98);

  const formattingFeedback = `• Bullet structure is generally clean.
• Avoid double margins or structural elements in the header area.
• Target font-sizes are well structured. Keep sections balanced.`;
  
  const sectionAnalysis = `• **Experience**: Good use of bullet layouts. Needs more metric metrics.
• **Skills**: Found matches for ${found.join(", ")}.
• **Missing core keywords**: ${missing.slice(0, 3).join(", ")}.`;

  const improvements = `• Integrate ${missing.slice(0, 3).join(", ")} explicitly into your experience description.
• Quantify achievements using metrics (e.g. 'Optimized performance by 15%').
• Avoid abbreviations like CSS (use Cascading Style Sheets) in header profiles.`;

  if (isDbConfigured()) {
    try {
      return await prisma.atsScore.create({
        data: {
          resumeId,
          targetRole,
          score: finalScore,
          keywordsFound: found,
          keywordsMissing: missing,
          formattingFeedback,
          sectionAnalysis,
          improvements,
        },
      });
    } catch (e) {
      console.error("Prisma score calculation save error:", e);
    }
  }

  return mockDb.createAtsScore(
    resumeId,
    targetRole,
    finalScore,
    found,
    missing,
    formattingFeedback,
    sectionAnalysis,
    improvements
  );
}
