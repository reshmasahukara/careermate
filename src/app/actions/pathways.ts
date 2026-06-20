"use server";

import { prisma, isDbConfigured } from "@/lib/db";


// Provide a mock user ID for demo purposes if no user is provided.
const getSafeUserId = (userId?: string) => userId || "demo-user-123";

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
