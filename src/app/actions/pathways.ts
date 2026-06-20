"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { CAREER_PATHS_DATA } from "@/lib/constants/careerPathsData";

// Provide a mock user ID for demo purposes if no user is provided.
const getSafeUserId = (userId?: string) => userId || "demo-user-123";

/**
 * Fetch the user's active selected career path.
 */
export async function getUserActivePathAction(userId: string) {
  if (!isDbConfigured()) return null;
  const safeId = getSafeUserId(userId);
  try {
    return await prisma.careerPath.findFirst({
      where: { userId: safeId },
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching active career path:", error);
    return null;
  }
}

/**
 * Save user selected career path in Neon PostgreSQL and generate roadmap milestones.
 */
export async function saveUserPathAction(userId: string, targetRole: string) {
  if (!isDbConfigured()) return null;
  const safeId = getSafeUserId(userId);
  try {
    const roleData = CAREER_PATHS_DATA[targetRole];
    if (!roleData) throw new Error(`Role ${targetRole} not found in career paths dictionary`);

    // 1. Delete all other career paths for this user to keep a single active choice
    await prisma.careerPath.deleteMany({
      where: {
        userId: safeId,
        NOT: { targetRole }
      }
    });

    // 2. Find or create the current career path
    const existing = await prisma.careerPath.findFirst({
      where: { userId: safeId, targetRole }
    });

    const description = `A comprehensive career path focusing on core skills, advanced techniques, and practical projects to master the ${targetRole} role.`;
    const roadmapJson = JSON.stringify(roleData.milestones.map(m => ({
      week: m.week,
      title: m.title,
      description: m.description,
      status: "pending",
      resourceId: `lr-${m.week}`
    })));

    let careerPathRecord;
    if (existing) {
      careerPathRecord = await prisma.careerPath.update({
        where: { id: existing.id },
        data: {
          description,
          roadmapData: roadmapJson,
          updatedAt: new Date()
        }
      });
    } else {
      careerPathRecord = await prisma.careerPath.create({
        data: {
          userId: safeId,
          targetRole,
          description,
          roadmapData: roadmapJson
        }
      });
    }

    // 3. Re-create weekly milestones in LearningRoadmap table with stable IDs
    await prisma.learningRoadmap.deleteMany({
      where: { userId: safeId }
    });

    for (const milestone of roleData.milestones) {
      const stableId = `${safeId}-${targetRole.replace(/\s+/g, "-")}-week-${milestone.week}`.toLowerCase();
      await prisma.learningRoadmap.create({
        data: {
          id: stableId,
          userId: safeId,
          targetRole,
          title: milestone.title,
          description: milestone.description,
          week: milestone.week,
          resources: milestone.resources
        }
      });
    }

    return { success: true, careerPath: careerPathRecord };
  } catch (error) {
    console.error("Error saving career path selection:", error);
    return null;
  }
}

/**
 * Fetch the learning roadmap for a specific target role.
 */
export async function getLearningPathsAction(userId: string, targetRole: string) {
  if (!isDbConfigured()) return [];
  const safeId = getSafeUserId(userId);
  try {
    const paths = await prisma.learningRoadmap.findMany({
      where: { userId: safeId, targetRole },
      orderBy: { week: 'asc' }
    });
    return paths;
  } catch (error) {
    console.error("Prisma error getting learning paths:", error);
    return [];
  }
}

/**
 * Fetch all available target roles a user has saved/generated
 */
export async function getAvailableRolesAction(userId: string) {
  if (!isDbConfigured()) return [];
  const safeId = getSafeUserId(userId);
  try {
    // A user's target roles can be inferred from their skill gaps or explicit target roles
    const gaps = await prisma.skillGap.findMany({
      where: { userId: safeId },
      select: { targetRole: true },
      distinct: ['targetRole']
    });
    return gaps.map(g => g.targetRole);
  } catch (error) {
    console.error("Prisma error getting available roles:", error);
    return [];
  }
}

/**
 * Mark a specific skill or week as completed
 */
export async function toggleMilestoneCompletionAction(userId: string, skillName: string, completed: boolean) {
  if (!isDbConfigured()) return false;
  const safeId = getSafeUserId(userId);
  try {
    const progress = await prisma.skillProgress.findFirst({
      where: { userId: safeId, skillName }
    });

    if (progress) {
      await prisma.skillProgress.update({
        where: { id: progress.id },
        data: { completed }
      });
    } else {
      await prisma.skillProgress.create({
        data: { userId: safeId, skillName, completed }
      });
    }

    // Sync status change into user's CareerPath record's roadmapData JSON (for dashboard metrics)
    const milestone = await prisma.learningRoadmap.findUnique({
      where: { id: skillName }
    });

    if (milestone) {
      const activePath = await prisma.careerPath.findFirst({
        where: { userId: safeId, targetRole: milestone.targetRole }
      });

      if (activePath) {
        try {
          const milestones = JSON.parse(activePath.roadmapData || "[]");
          const updatedMilestones = milestones.map((m: any) => {
            if (m.week === milestone.week || m.title === milestone.title) {
              return {
                ...m,
                status: completed ? "completed" : "pending"
              };
            }
            return m;
          });

          await prisma.careerPath.update({
            where: { id: activePath.id },
            data: {
              roadmapData: JSON.stringify(updatedMilestones)
            }
          });
        } catch (jsonErr) {
          console.error("JSON parsing error during CareerPath sync:", jsonErr);
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error toggling milestone:", error);
    return false;
  }
}

/**
 * Get the completed milestones (SkillProgress) for a user
 */
export async function getCompletedMilestonesAction(userId: string) {
  if (!isDbConfigured()) return [];
  const safeId = getSafeUserId(userId);
  try {
    return await prisma.skillProgress.findMany({
      where: { userId: safeId, completed: true }
    });
  } catch (error) {
    console.error("Error getting completed milestones:", error);
    return [];
  }
}

/**
 * Fetch bookmarked resources
 */
export async function getBookmarkedResourcesAction(userId: string) {
  if (!isDbConfigured()) return [];
  const safeId = getSafeUserId(userId);
  try {
    return await prisma.learningResource.findMany({
      where: { userId: safeId }
    });
  } catch (error) {
    console.error("Error getting bookmarked resources:", error);
    return [];
  }
}

/**
 * Bookmark a new resource
 */
export async function bookmarkResourceAction(userId: string, data: { title: string, provider: string, url: string, type: string, difficulty: string, duration: string, skills: string[] }) {
  if (!isDbConfigured()) return null;
  const safeId = getSafeUserId(userId);
  try {
    // Check if it already exists
    const existing = await prisma.learningResource.findFirst({
      where: { userId: safeId, url: data.url }
    });
    if (existing) {
      // Un-bookmark it if it exists
      await prisma.learningResource.delete({ where: { id: existing.id } });
      return { action: 'removed', id: existing.id };
    }
    
    // Otherwise add it
    const newResource = await prisma.learningResource.create({
      data: {
        userId: safeId,
        title: data.title,
        provider: data.provider,
        url: data.url,
        type: data.type,
        difficulty: data.difficulty,
        duration: data.duration,
        skills: data.skills,
        isCompleted: false
      }
    });
    return { action: 'added', resource: newResource };
  } catch (error) {
    console.error("Error bookmarking resource:", error);
    return null;
  }
}

/**
 * Mark a resource as completed
 */
export async function toggleResourceCompletionAction(userId: string, resourceId: string, completed: boolean) {
  if (!isDbConfigured()) return false;
  try {
    await prisma.learningResource.update({
      where: { id: resourceId },
      data: { isCompleted: completed }
    });
    return true;
  } catch (error) {
    console.error("Error toggling resource completion:", error);
    return false;
  }
}
