"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { CAREER_PATHS_DATA } from "@/lib/constants/careerPathsData";

const getSafeUserId = (userId?: string) => userId || "demo-user-123";

/**
 * Fetch all dynamic career intelligence metrics and data points for a user.
 */
export async function getUserCareerInsightsAction(userId: string) {
  if (!isDbConfigured()) return null;
  const safeId = getSafeUserId(userId);

  try {
    // 1. Fetch all raw data dependencies from database
    const [
      user,
      resumes,
      latestAtsScore,
      latestSkillGap,
      skillProgressList,
      savedJobsList,
      goals,
      allAtsScores
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: safeId },
        select: { id: true, experienceLevel: true, location: true, jobTitle: true }
      }),
      prisma.resume.findMany({
        where: { userId: safeId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.atsScore.findFirst({
        where: { resume: { userId: safeId } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.skillGap.findFirst({
        where: { userId: safeId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.skillProgress.findMany({
        where: { userId: safeId }
      }),
      prisma.savedJob.findMany({
        where: { userId: safeId },
        include: { job: true }
      }),
      prisma.careerGoal.findMany({
        where: { userId: safeId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.atsScore.findMany({
        where: { resume: { userId: safeId } },
        orderBy: { createdAt: "asc" }
      })
    ]);

    // Check if the user has any data (new user experience)
    const hasData = resumes.length > 0 || latestAtsScore !== null || latestSkillGap !== null || skillProgressList.length > 0;

    if (!hasData) {
      return {
        hasData: false,
        user: user || { id: safeId }
      };
    }

    // Determine user's active target role
    const activeCareerPath = await prisma.careerPath.findFirst({
      where: { userId: safeId },
      orderBy: { updatedAt: "desc" }
    });

    const targetRole = activeCareerPath?.targetRole || latestSkillGap?.targetRole || latestAtsScore?.targetRole || user?.jobTitle || "Frontend Developer";

    // 2. Fetch matching jobs in database for opportunity metrics
    const matchingJobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: targetRole, mode: "insensitive" } },
          { description: { contains: targetRole, mode: "insensitive" } }
        ]
      },
      take: 10
    });

    // 3. Retrieve path dictionary metadata
    const pathDetails = CAREER_PATHS_DATA[targetRole] || CAREER_PATHS_DATA["Frontend Developer"];

    // 4. Calculate Career Readiness Score (dynamically computed)
    // Formula: Profile completion (20%) + Resume quality (20%) + Skill match (30%) + Learning completion (30%)
    let profileScore = 0;
    if (user?.experienceLevel) profileScore += 33;
    if (user?.location) profileScore += 33;
    if (user?.jobTitle) profileScore += 34;

    const resumeScore = latestAtsScore ? latestAtsScore.score : 0;
    const skillMatchScore = latestSkillGap ? latestSkillGap.matchScore : 0;

    const roadmapMilestones = await prisma.learningRoadmap.findMany({ where: { userId: safeId, targetRole } });
    const completedMilestones = skillProgressList.filter(sp => sp.completed && roadmapMilestones.some(rm => rm.id === sp.skillName));
    const learningScore = roadmapMilestones.length > 0 ? (completedMilestones.length / roadmapMilestones.length) * 100 : 0;

    const careerReadinessScore = Math.round(
      (profileScore * 0.20) + 
      (resumeScore * 0.20) + 
      (skillMatchScore * 0.30) + 
      (learningScore * 0.30)
    );

    let readinessLevel = "Beginner";
    if (careerReadinessScore > 75) readinessLevel = "Job Ready";
    else if (careerReadinessScore > 40) readinessLevel = "Intermediate";

    // 5. Compute ATS Improvement Trend
    let trendIndicator = "neutral";
    let trendLabel = "No trend data yet";
    if (allAtsScores.length >= 2) {
      const prev = allAtsScores[allAtsScores.length - 2].score;
      const latest = allAtsScores[allAtsScores.length - 1].score;
      const diff = latest - prev;
      if (diff > 0) {
        trendIndicator = "up";
        trendLabel = `+${diff}% from last scan`;
      } else if (diff < 0) {
        trendIndicator = "down";
        trendLabel = `${diff}% from last scan`;
      } else {
        trendLabel = "Same as last scan";
      }
    }

    // 6. Generate Progress Over Time Data Points (7, 30, 90 days filters handled on client)
    const atsTrend = allAtsScores.map(score => ({
      date: score.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      score: score.score,
      timestamp: score.createdAt.getTime()
    }));

    // Skills acquired over time
    // We group UserSkill or SkillProgress additions by date
    const skillsHistoryMap: Record<string, number> = {};
    let runningSkillsCount = 0;
    
    // Sort skill progress additions by date
    const sortedProgress = [...skillProgressList].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    sortedProgress.forEach(sp => {
      const dateStr = sp.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (sp.completed) {
        runningSkillsCount++;
        skillsHistoryMap[dateStr] = runningSkillsCount;
      }
    });

    const skillsTrend = Object.entries(skillsHistoryMap).map(([date, count]) => ({
      date,
      count
    }));

    // If no progress points, construct a single point representing current skills
    if (skillsTrend.length === 0) {
      skillsTrend.push({
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: skillProgressList.filter(s => s.completed).length
      });
    }

    // Roadmap completion history
    const roadmapTrend = sortedProgress.map((sp, idx) => ({
      date: sp.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      completion: Math.round(((idx + 1) / Math.max(1, roadmapMilestones.length)) * 100)
    }));

    // Applications/Saved Jobs history
    const jobsHistoryMap: Record<string, number> = {};
    let runningJobsCount = 0;
    const sortedJobs = [...savedJobsList].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    sortedJobs.forEach(sj => {
      const dateStr = sj.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      runningJobsCount++;
      jobsHistoryMap[dateStr] = runningJobsCount;
    });

    const applicationsTrend = Object.entries(jobsHistoryMap).map(([date, count]) => ({
      date,
      count
    }));

    // 7. Salary Benchmarks (experience level, role based)
    // Standard multipliers based on targetRole complexity
    let salaryBase = 70000;
    if (targetRole.toLowerCase().includes("senior") || targetRole.toLowerCase().includes("architect") || targetRole.toLowerCase().includes("lead")) {
      salaryBase = 120000;
    } else if (targetRole.toLowerCase().includes("data scientist") || targetRole.toLowerCase().includes("machine learning") || targetRole.toLowerCase().includes("ai") || targetRole.toLowerCase().includes("nlp")) {
      salaryBase = 100000;
    } else if (targetRole.toLowerCase().includes("analyst") || targetRole.toLowerCase().includes("marketing") || targetRole.toLowerCase().includes("designer")) {
      salaryBase = 60000;
    }

    const salaryInsights = {
      role: targetRole,
      entryLevel: { min: Math.round(salaryBase * 0.8), max: Math.round(salaryBase * 1.0) },
      midLevel: { min: Math.round(salaryBase * 1.2), max: Math.round(salaryBase * 1.5) },
      seniorLevel: { min: Math.round(salaryBase * 1.7), max: Math.round(salaryBase * 2.2) },
      growthPotential: "15% - 25% salary increase expected over next 3 years",
      regionalComparisons: [
        { region: "North America", avg: Math.round(salaryBase * 1.4) },
        { region: "Europe", avg: Math.round(salaryBase * 1.1) },
        { region: "Asia Pacific", avg: Math.round(salaryBase * 0.7) }
      ]
    };

    // 8. Top Hiring Companies (from database `Job` records)
    const companyCards = matchingJobs.map(job => ({
      logo: job.logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop",
      name: job.company,
      title: job.title,
      location: job.location || "Remote",
      requiredSkills: job.skills.slice(0, 3),
      applyUrl: job.applyUrl
    }));

    // 9. Job Market Overview statistics
    const jobMarketOverview = {
      totalMatchingJobs: matchingJobs.length > 0 ? matchingJobs.length * 12 : 0,
      remoteOpportunities: matchingJobs.filter(j => j.remote).length * 8 || 14,
      hybridRoles: Math.round((matchingJobs.length * 0.4) * 6) || 8,
      entryLevelPositions: Math.round((matchingJobs.length * 0.2) * 5) || 5
    };

    // 10. Skills Demand Comparison
    // Determine Strong Match, Needs Improvement, Missing Skills based on SkillGap record
    const strongMatch: string[] = [];
    const needsImprovement: string[] = [];
    const missingSkills: string[] = [];

    if (latestSkillGap) {
      // Critical gaps are missing skills
      missingSkills.push(...latestSkillGap.criticalSkills);
      // Recommended gaps are needs improvement
      needsImprovement.push(...latestSkillGap.recommendedSkills);
      // User's own skills are strong matches
      const userSkillNames = skillProgressList.filter(s => s.completed).map(s => s.skillName);
      if (pathDetails) {
        pathDetails.resources.flatMap(r => r.skills).forEach(skillName => {
          if (userSkillNames.some(usk => usk.toLowerCase().includes(skillName.toLowerCase()))) {
            if (!strongMatch.includes(skillName)) strongMatch.push(skillName);
          }
        });
      }
    }

    // Default fallbacks if no gap analysis
    if (strongMatch.length === 0 && pathDetails) {
      strongMatch.push(...(pathDetails.prerequisites.slice(0, 3)));
      missingSkills.push(...(pathDetails.milestones.slice(0, 2).map(m => m.title.replace("Master ", "").replace("Learn ", ""))));
    }

    const skillsDemandComparison = {
      strongMatch,
      needsImprovement,
      missingSkills
    };

    // 11. Actionable Recommendations (prioritized by impact)
    const recommendations: { text: string; impact: "High" | "Medium" | "Low"; category: string }[] = [];
    
    if (latestAtsScore && latestAtsScore.score < 80) {
      recommendations.push({
        text: `Add missing key technologies to your resume to increase ATS compatibility score.`,
        impact: "High",
        category: "ATS Optimizations"
      });
    }

    missingSkills.slice(0, 2).forEach(skill => {
      recommendations.push({
        text: `Add/Learn "${skill}" to improve your Skill Match Score.`,
        impact: "High",
        category: "Skill Acquisition"
      });
    });

    roadmapMilestones.slice(0, 2).forEach(milestone => {
      recommendations.push({
        text: `Complete Roadmap Milestone: "${milestone.title}".`,
        impact: "Medium",
        category: "Learning Progress"
      });
    });

    if (resumes.length === 1) {
      recommendations.push({
        text: "Upload an alternative resume version targeting different locations/keywords.",
        impact: "Low",
        category: "Profile Enrichment"
      });
    }

    // Sort: High -> Medium -> Low
    recommendations.sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.impact] - order[b.impact];
    });

    return {
      hasData: true,
      targetRole,
      stats: {
        careerReadinessScore,
        readinessLevel,
        atsImprovementTrend: trendLabel,
        trendIndicator,
        skillsMatchScore: skillMatchScore || 70,
        jobOpportunitiesAvailable: jobMarketOverview.totalMatchingJobs
      },
      atsTrend,
      skillsTrend,
      roadmapTrend,
      applicationsTrend,
      salaryInsights,
      companyCards,
      jobMarketOverview,
      skillsDemandComparison,
      recommendations,
      goals
    };
  } catch (error) {
    console.error("Error generating career insights action:", error);
    return null;
  }
}

/**
 * Add a new career goal in Neon PostgreSQL.
 */
export async function addCareerGoalAction(userId: string, data: { targetRole: string, targetCompany?: string, targetSalary?: number, targetTimeline?: string }) {
  if (!isDbConfigured()) return null;
  const safeId = getSafeUserId(userId);

  try {
    const goal = await prisma.careerGoal.create({
      data: {
        userId: safeId,
        targetRole: data.targetRole,
        targetCompany: data.targetCompany || null,
        targetSalary: data.targetSalary ? Number(data.targetSalary) : null,
        targetTimeline: data.targetTimeline || null,
        completed: false
      }
    });
    return { success: true, goal };
  } catch (error) {
    console.error("Error creating career goal:", error);
    return null;
  }
}

/**
 * Toggle the completion status of a career goal.
 */
export async function toggleCareerGoalAction(userId: string, goalId: string, completed: boolean) {
  if (!isDbConfigured()) return false;
  try {
    await prisma.careerGoal.update({
      where: { id: goalId },
      data: { completed }
    });
    return true;
  } catch (error) {
    console.error("Error toggling career goal:", error);
    return false;
  }
}

/**
 * Delete a career goal.
 */
export async function deleteCareerGoalAction(userId: string, goalId: string) {
  if (!isDbConfigured()) return false;
  try {
    await prisma.careerGoal.delete({
      where: { id: goalId }
    });
    return true;
  } catch (error) {
    console.error("Error deleting career goal:", error);
    return false;
  }
}
