"use server";

import { prisma, isDbConfigured } from "@/lib/db";

// Hardcoded target role definitions for the match engine
const ROLE_DEFINITIONS: Record<string, { core: string[], tools: string[], experience: string }> = {
  "Frontend Developer": {
    core: ["JavaScript", "TypeScript", "HTML", "CSS", "React"],
    tools: ["Next.js", "TailwindCSS", "Git", "Webpack", "Vite"],
    experience: "Intermediate"
  },
  "Backend Developer": {
    core: ["Node.js", "Python", "Java", "SQL", "REST API"],
    tools: ["Express", "Docker", "PostgreSQL", "MongoDB", "Git"],
    experience: "Intermediate"
  },
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "TypeScript"],
    tools: ["Next.js", "PostgreSQL", "Docker", "Git", "TailwindCSS"],
    experience: "Senior"
  },
  "Data Analyst": {
    core: ["SQL", "Python", "Excel", "Statistics", "Data Visualization"],
    tools: ["Tableau", "Power BI", "Pandas", "Jupyter"],
    experience: "Beginner"
  },
  "Data Scientist": {
    core: ["Python", "Machine Learning", "SQL", "Statistics", "Deep Learning"],
    tools: ["TensorFlow", "PyTorch", "Scikit-Learn", "Pandas"],
    experience: "Intermediate"
  },
  "Machine Learning Engineer": {
    core: ["Python", "Machine Learning", "Deep Learning", "Mathematics"],
    tools: ["TensorFlow", "PyTorch", "Docker", "AWS", "MLOps"],
    experience: "Senior"
  },
  "AI Engineer": {
    core: ["Python", "Deep Learning", "NLP", "Computer Vision"],
    tools: ["PyTorch", "Hugging Face", "TensorFlow", "OpenAI API"],
    experience: "Senior"
  },
  "DevOps Engineer": {
    core: ["Linux", "Networking", "CI/CD", "Bash", "Python"],
    tools: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    experience: "Intermediate"
  },
  "UI/UX Designer": {
    core: ["UI Design", "UX Research", "Wireframing", "Prototyping"],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision"],
    experience: "Intermediate"
  },
  "Product Manager": {
    core: ["Agile", "Scrum", "Product Strategy", "User Research", "Data Analysis"],
    tools: ["Jira", "Trello", "Confluence", "Google Analytics"],
    experience: "Intermediate"
  }
};

export async function syncSkillsFromResumeAction(userId: string) {
  isDbConfigured();
  try {
    // Get latest parsed ATS Analysis or Resume
    const latestAts = await prisma.aTSAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    if (latestAts && latestAts.matchedKeywords) {
      for (const skillName of latestAts.matchedKeywords) {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, category: "Extracted" } });
        }
        await prisma.userSkill.upsert({
          where: { userId_skillId: { userId, skillId: skill.id } },
          update: {},
          create: { userId, skillId: skill.id, proficiency: "Intermediate" }
        });
      }
    }
    return true;
  } catch (e) {
    console.error("Error syncing skills:", e);
    return false;
  }
}

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

export async function addUserSkillAction(userId: string, skillName: string, proficiency: "Beginner" | "Intermediate" | "Expert") {
  isDbConfigured();
  try {
    let skill = await prisma.skill.findUnique({ where: { name: skillName } });
    if (!skill) {
      skill = await prisma.skill.create({ data: { name: skillName, category: "Manual" } });
    }
    return await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      update: { proficiency },
      create: { userId, skillId: skill.id, proficiency },
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
      where: { userId_skillId: { userId, skillId } },
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
    
    // Use fallback generic required skills if role isn't explicitly defined
    const roleDef = ROLE_DEFINITIONS[targetRole] || {
      core: ["JavaScript", "HTML", "CSS", "SQL", "Git"],
      tools: ["Docker", "AWS", "React", "Node.js"],
      experience: "Intermediate"
    };

    let coreMatches = 0;
    const criticalSkills: string[] = [];
    roleDef.core.forEach(skill => {
      if (userSkillNames.includes(skill.toLowerCase())) coreMatches++;
      else criticalSkills.push(skill);
    });

    let toolsMatches = 0;
    const recommendedSkills: string[] = [];
    roleDef.tools.forEach(skill => {
      if (userSkillNames.includes(skill.toLowerCase())) toolsMatches++;
      else recommendedSkills.push(skill);
    });

    const coreScore = (coreMatches / roleDef.core.length) * 50;
    const toolsScore = (toolsMatches / roleDef.tools.length) * 30;
    const experienceScore = 20; // Assume 20 for now, could be dynamic based on User's profile
    
    const totalScore = Math.round(coreScore + toolsScore + experienceScore);
    
    let readiness = "Beginner";
    if (totalScore > 80) readiness = "Job Ready";
    else if (totalScore > 50) readiness = "Intermediate";

    const optionalSkills = ["GraphQL", "Kubernetes", "Redis", "Elasticsearch"].filter(s => !userSkillNames.includes(s.toLowerCase()));

    // Store the analysis
    const gap = await prisma.skillGap.create({
      data: {
        userId,
        targetRole,
        matchScore: totalScore,
        criticalSkills,
        recommendedSkills,
        optionalSkills,
        jobReadiness: readiness
      }
    });

    // Automatically generate a roadmap based on these gaps
    await prisma.learningRoadmap.deleteMany({ where: { userId, targetRole } });

    let currentWeek = 1;
    for (const skill of criticalSkills) {
      await prisma.learningRoadmap.create({
        data: {
          userId,
          targetRole,
          title: `Master ${skill}`,
          description: `Focus heavily on the core concepts and real-world applications of ${skill}.`,
          week: currentWeek++,
          resources: [
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`,
            `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`
          ]
        }
      });
    }

    for (const skill of recommendedSkills.slice(0, 3)) {
      await prisma.learningRoadmap.create({
        data: {
          userId,
          targetRole,
          title: `Learn ${skill} Tooling`,
          description: `Integrate ${skill} into your existing workflow to boost your productivity.`,
          week: currentWeek++,
          resources: [
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " crash course")}`
          ]
        }
      });
    }

    return gap;
  } catch (e) {
    console.error("Prisma error analyzing skill gap:", e);
    throw new Error("Failed to analyze skill gap.");
  }
}

export async function getLatestSkillGapAction(userId: string) {
  isDbConfigured();
  try {
    return await prisma.skillGap.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Error fetching latest skill gap:", e);
    return null;
  }
}

export async function getLearningRoadmapAction(userId: string, targetRole: string) {
  isDbConfigured();
  try {
    return await prisma.learningRoadmap.findMany({
      where: { userId, targetRole },
      orderBy: { week: "asc" }
    });
  } catch (e) {
    console.error("Error fetching roadmap:", e);
    return [];
  }
}

export async function generateRoadmapAction(userId: string, targetRole: string) {
  // Dummy to prevent compilation error in /roadmap/page.tsx
  return { id: "dummy", targetRole, roadmapData: "[]" };
}
