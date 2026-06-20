import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { calculateMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details, skills, and latest resume
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: { include: { skill: true } },
        resumes: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no resume, we don't return personalized matches based on the new logic
    if (!user.resumes || user.resumes.length === 0) {
      return NextResponse.json({ jobs: [], needsResume: true });
    }

    const userProfile = {
      skills: user.userSkills.map(us => us.skill.name),
      experienceLevel: user.experienceLevel,
      location: user.location,
      resumeParsedText: user.resumes[0].parsedText
    };

    // Fetch jobs
    const allJobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 200 // fetch recent jobs to score
    });

    // Score jobs
    const scoredJobs = allJobs.map(job => {
      const { matchScore, missingSkills } = calculateMatchScore(job, userProfile);
      return { ...job, matchScore, missingSkills };
    });

    // Sort by match score
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ jobs: scoredJobs.slice(0, 50), needsResume: false });
  } catch (error: any) {
    console.error("Recommended jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended jobs" },
      { status: 500 }
    );
  }
}
