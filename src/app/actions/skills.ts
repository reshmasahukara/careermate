"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function getUserSkillsAction(userId: string) {
  isDbConfigured();
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
    return [];
  }
}

export async function addUserSkillAction(
  userId: string,
  skillName: string,
  proficiency: "Beginner" | "Intermediate" | "Expert"
) {
  isDbConfigured();
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
    throw new Error("Failed to add skill.");
  }
}

export async function removeUserSkillAction(userId: string, skillId: string) {
  isDbConfigured();
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
    return false;
  }
}

export async function analyzeSkillGapAction(userId: string, targetRole: string) {
  isDbConfigured();
  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    const userSkillNames = userSkills.map(us => us.skill.name.toLowerCase());

    // Mock radar data generation logic based on user's skills vs target role
    // In a real application, you'd have an AI model or a static mapping of roles -> required skills -> categories
    const categories = ['Frontend', 'Backend', 'Cloud/DevOps', 'Database', 'System Design', 'Soft Skills'];
    
    const radarData = categories.map(cat => ({
      subject: cat,
      A: Math.floor(Math.random() * 50) + (userSkills.length > 0 ? 50 : 20), // User current score
      B: Math.floor(Math.random() * 30) + 120, // Industry requirement
      fullMark: 150
    }));

    const mockMissingSkills = [
      { name: "Kubernetes", importance: "High", freq: "78%" },
      { name: "GraphQL", importance: "Medium", freq: "65%" },
      { name: "System Architecture", importance: "High", freq: "82%" },
    ].filter(s => !userSkillNames.includes(s.name.toLowerCase()));

    const strengths = userSkills.slice(0, 3).map(us => us.skill.name);

    return {
      radarData,
      missingSkills: mockMissingSkills,
      strengths
    };
  } catch (e) {
    console.error("Prisma error analyzing skill gap:", e);
    throw new Error("Failed to analyze skill gap.");
  }
}

export async function generateRoadmapAction(userId: string, targetRole: string) {
  isDbConfigured();
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
    throw new Error("Failed to generate career roadmap.");
  }
}

export async function getCareerPathAction(userId: string) {
  isDbConfigured();
  try {
    return await prisma.careerPath.findFirst({
      where: { userId },
    });
  } catch (e) {
    console.error("Prisma error fetching career path:", e);
    return null;
  }
}
