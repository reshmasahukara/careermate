"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

export async function getUserSkillsAction(userId: string) {
  if (isDbConfigured()) {
    try {
      const userSkills = await prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
      });
      return userSkills.map((us) => ({
        id: us.id,
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiency,
        skillId: us.skillId,
      }));
    } catch (e) {
      console.error("Prisma error getting skills:", e);
    }
  }
  return mockDb.getUserSkills(userId);
}

export async function addUserSkillAction(
  userId: string,
  skillName: string,
  proficiency: "Beginner" | "Intermediate" | "Expert"
) {
  if (isDbConfigured()) {
    try {
      // Find or create global skill
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
      });

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: "General",
          },
        });
      }

      // Upsert user skill relation
      return await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId: skill.id,
          },
        },
        update: { proficiency },
        create: {
          userId,
          skillId: skill.id,
          proficiency,
        },
      });
    } catch (e) {
      console.error("Prisma error adding skill:", e);
    }
  }
  return mockDb.addUserSkill(userId, skillName, proficiency);
}

export async function removeUserSkillAction(userId: string, skillId: string) {
  if (isDbConfigured()) {
    try {
      await prisma.userSkill.delete({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
      });
      return true;
    } catch (e) {
      console.error("Prisma error deleting skill:", e);
    }
  }
  return mockDb.removeUserSkill(userId, skillId);
}

export async function generateRoadmapAction(userId: string, targetRole: string) {
  // Generate random learning path milestones based on the role
  const description = `Accelerated learning program targeting the fundamental and advanced skills required to become a professional ${targetRole}.`;
  
  const milestones = [
    {
      week: 1,
      title: `Core Foundations of ${targetRole}`,
      description: "Focus on syntax, standard design patterns, basic command-line processes, and essential architectures.",
      status: "in-progress",
    },
    {
      week: 2,
      title: "Framework and Tooling Integration",
      description: "Incorporate primary development ecosystems, automated testing pipelines, and style structures.",
      status: "pending",
    },
    {
      week: 3,
      title: "Optimization, APIs, and State Management",
      description: "Dive deep into data communication, page caching systems, and page performance optimizations.",
      status: "pending",
    },
    {
      week: 4,
      title: "Real-world Project & Deployment pipelines",
      description: "Build an end-to-end sandbox deployment and configure continuous integration tools.",
      status: "pending",
    }
  ];

  if (isDbConfigured()) {
    try {
      // Remove existing roadmaps
      await prisma.careerPath.deleteMany({
        where: { userId },
      });

      return await prisma.careerPath.create({
        data: {
          userId,
          targetRole,
          description,
          roadmapData: JSON.stringify(milestones),
        },
      });
    } catch (e) {
      console.error("Prisma error generating career roadmap:", e);
    }
  }

  return mockDb.createCareerPath(userId, targetRole, description, milestones);
}

export async function getCareerPathAction(userId: string) {
  if (isDbConfigured()) {
    try {
      return await prisma.careerPath.findFirst({
        where: { userId },
      });
    } catch (e) {
      console.error("Prisma error fetching career path:", e);
    }
  }
  return mockDb.getCareerPath(userId);
}
