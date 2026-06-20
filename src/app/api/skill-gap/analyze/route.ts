import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseResume } from "@/lib/parser";
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

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetRole = formData.get("targetRole") as string | null;

    // 1. Validation
    if (!file) {
      return NextResponse.json({ error: "Missing resume file. Please upload a PDF or DOCX." }, { status: 400 });
    }
    if (!targetRole) {
      return NextResponse.json({ error: "Missing target role." }, { status: 400 });
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds maximum size of 5MB." }, { status: 400 });
    }

    // Validate type (PDF/DOCX)
    const validMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const isDocx = file.name.endsWith(".docx");
    const isPdf = file.name.endsWith(".pdf");
    if (!validMimes.includes(file.type) && !isDocx && !isPdf) {
      return NextResponse.json({ error: "Invalid file format. Only PDF and DOCX files are allowed." }, { status: 400 });
    }

    // 2. Extract Text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parseResume(buffer, file.type, file.name);

    if (!resumeText.trim()) {
      return NextResponse.json({ error: "Could not extract text from the uploaded file." }, { status: 400 });
    }

    const lowerText = resumeText.toLowerCase();

    // 3. Extract Skills against the Target Role
    const roleDef = ROLE_DEFINITIONS[targetRole] || {
      core: ["JavaScript", "HTML", "CSS", "SQL", "Git"],
      tools: ["Docker", "AWS", "React", "Node.js"],
      experience: "Intermediate"
    };

    const extractedSkills: string[] = [];
    
    // Check all roles to build a robust extracted skill set, but prioritize the target role
    Object.values(ROLE_DEFINITIONS).forEach(def => {
      [...def.core, ...def.tools].forEach(skill => {
        if (lowerText.includes(skill.toLowerCase()) && !extractedSkills.includes(skill)) {
          extractedSkills.push(skill);
        }
      });
    });

    // 4. Save extracted skills to UserSkill
    for (const skillName of extractedSkills) {
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

    // 5. Compute Skill Gap
    let coreMatches = 0;
    const criticalSkills: string[] = [];
    roleDef.core.forEach(skill => {
      if (extractedSkills.some(e => e.toLowerCase() === skill.toLowerCase())) {
        coreMatches++;
      } else {
        criticalSkills.push(skill);
      }
    });

    let toolsMatches = 0;
    const recommendedSkills: string[] = [];
    roleDef.tools.forEach(skill => {
      if (extractedSkills.some(e => e.toLowerCase() === skill.toLowerCase())) {
        toolsMatches++;
      } else {
        recommendedSkills.push(skill);
      }
    });

    const coreScore = (coreMatches / roleDef.core.length) * 50;
    const toolsScore = (toolsMatches / roleDef.tools.length) * 30;
    const experienceScore = 20; 
    
    const totalScore = Math.round(coreScore + toolsScore + experienceScore);
    
    let readiness = "Beginner";
    if (totalScore > 80) readiness = "Job Ready";
    else if (totalScore > 50) readiness = "Intermediate";

    const optionalSkills = ["GraphQL", "Kubernetes", "Redis", "Elasticsearch"].filter(
      s => !extractedSkills.some(e => e.toLowerCase() === s.toLowerCase())
    );

    // 6. Save Gap Analysis
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

    // 7. Generate Roadmap
    await prisma.learningRoadmap.deleteMany({ where: { userId, targetRole } });

    let currentWeek = 1;
    for (const skill of criticalSkills) {
      await prisma.learningRoadmap.create({
        data: {
          userId,
          targetRole,
          title: `Master ${skill} Fundamentals`,
          description: `Focus heavily on building core competency in ${skill}. Build 2 small projects.`,
          week: currentWeek,
          resources: [
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " crash course")}`,
            `https://freecodecamp.org/news/tag/${skill.toLowerCase()}/`
          ]
        }
      });
      currentWeek += 2;
    }

    for (const skill of recommendedSkills) {
      await prisma.learningRoadmap.create({
        data: {
          userId,
          targetRole,
          title: `Learn ${skill} Tooling`,
          description: `Integrate ${skill} into your workflows to improve your efficiency and market value.`,
          week: currentWeek,
          resources: [
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`
          ]
        }
      });
      currentWeek += 1;
    }

    return NextResponse.json({ gap, extractedSkills });
  } catch (error: any) {
    console.error("Skill Gap Analysis endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to process and analyze skill gap." }, { status: 500 });
  }
}
