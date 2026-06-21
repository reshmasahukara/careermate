import nlp from "compromise";

// Dictionary of common technical and soft skills to match against
const SKILLS_DICTIONARY = [
  // Tech Skills
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php",
  "html", "css", "sass", "tailwind", "bootstrap", "react", "next.js", "angular", "vue",
  "node.js", "express", "django", "flask", "spring boot", "laravel", "ruby on rails",
  "postgresql", "mysql", "mongodb", "redis", "sqlite", "oracle", "cassandra", "prisma", "sequelize",
  "graphql", "rest api", "soap", "grpc", "web sockets", "microservices",
  "docker", "kubernetes", "aws", "azure", "gcp", "heroku", "netlify", "vercel",
  "git", "github", "gitlab", "bitbucket", "ci/cd", "jenkins", "github actions",
  "agile", "scrum", "kanban", "jira", "confluence",
  "figma", "sketch", "adobe xd", "photoshop", "illustrator", "ui/ux",
  "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
  "data analysis", "pandas", "numpy", "tableau", "power bi", "excel",
  
  // Soft Skills & Industry Concepts
  "communication", "teamwork", "collaboration", "leadership", "mentorship", "problem solving",
  "critical thinking", "time management", "adaptability", "creativity", "work ethic",
  "attention to detail", "emotional intelligence", "negotiation", "conflict resolution",
  "project management", "product roadmap", "kpis", "metrics", "analytics", "seo",
  "accessibility", "performance optimization", "security", "testing", "jest", "cypress"
];

interface Recommendation {
  priority: "High Priority" | "Medium Priority" | "Low Priority";
  text: string;
}

export interface ATSAnalysisResult {
  atsScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  readabilityScore: number;
  contactInfoScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingFeedback: string[];
  recommendations: Recommendation[];
  scoreBreakdown: any;
}

export async function analyzeATSCompatibility(
  resumeText: string, 
  jobDescription: string,
  targetRole?: string,
  industry?: string,
  experienceLevel?: string
): Promise<ATSAnalysisResult> {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const docResume = nlp(resumeText);
  const docJd = nlp(jobDescription);

  // 1. Keyword Match (30%)
  // Extract nouns and entities from JD
  const jdNouns = docJd.nouns().out('array').map((n: string) => n.toLowerCase());
  const uniqueJdNouns = Array.from(new Set(jdNouns)).filter((n: unknown) => typeof n === 'string' && n.length > 4);
  
  const targetKeywords = SKILLS_DICTIONARY.filter(skill => jdLower.includes(skill.toLowerCase()));
  if (targetKeywords.length === 0) {
    targetKeywords.push(...uniqueJdNouns.slice(0, 15) as string[]);
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    } else {
      missingKeywords.push(keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  });

  let keywordScore = 0;
  if (targetKeywords.length > 0) {
    keywordScore = Math.round((matchedKeywords.length / targetKeywords.length) * 100);
  } else {
    keywordScore = 100; // No keywords to match
  }

  // 2. Required Skills Match (25%)
  const requiredSkills = SKILLS_DICTIONARY.filter(skill => jdLower.includes(skill.toLowerCase()));
  const matchedSkills = requiredSkills.filter(skill => resumeLower.includes(skill.toLowerCase()));
  
  let skillsScore = 0;
  if (requiredSkills.length > 0) {
    skillsScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  } else {
    skillsScore = keywordScore;
  }

  // 3. Experience Relevance (15%)
  let experienceScore = 75;
  const isSeniorJd = jdLower.includes("senior") || jdLower.includes("lead") || jdLower.includes("manager") || jdLower.includes("5+");
  const isSeniorResume = resumeLower.includes("senior") || resumeLower.includes("lead") || resumeLower.includes("manager") || resumeLower.includes("principal");
  
  if (experienceLevel === "Senior" || isSeniorJd) {
    experienceScore = isSeniorResume ? 95 : 50;
  } else if (experienceLevel === "Entry-level" || experienceLevel === "Junior") {
    experienceScore = 85; 
  } else {
    experienceScore = isSeniorResume === isSeniorJd ? 90 : 70;
  }

  // 4. Education Match (10%)
  let educationScore = 60;
  const degrees = ["bachelor", "master", "phd", "ph.d", "b.s", "m.s", "degree", "university", "college"];
  const jdNeedsDegree = degrees.some(d => jdLower.includes(d));
  const resumeHasDegree = degrees.some(d => resumeLower.includes(d));

  if (jdNeedsDegree) {
    educationScore = resumeHasDegree ? 100 : 40;
  } else {
    educationScore = resumeHasDegree ? 100 : 90;
  }

  // 5. Resume Formatting (10%)
  const formattingFeedback: string[] = [];
  let formattingScore = 100;

  if (resumeText.includes("|") || resumeText.includes("+---") || resumeText.includes("║")) {
    formattingFeedback.push("Tables detected: ATS parsers often scramble table contents.");
    formattingScore -= 30;
  }

  const lines = resumeText.split("\n");
  let multiColumnLinesCount = 0;
  for (const line of lines) {
    if (/\w{2,}\s{5,}\w{2,}/.test(line)) {
      multiColumnLinesCount++;
    }
  }
  if (multiColumnLinesCount > 5) {
    formattingFeedback.push("Multi-column layout detected: Text extraction may read columns side-by-side instead of sequentially.");
    formattingScore -= 30;
  }

  const sections = {
    summary: /summary|profile|objective|about me/i.test(resumeText),
    skills: /skills|technologies|expertise|core competencies/i.test(resumeText),
    experience: /experience|employment|work history|projects/i.test(resumeText),
    education: /education|academic|credentials/i.test(resumeText)
  };

  if (!sections.summary) {
    formattingFeedback.push("Missing professional summary section.");
    formattingScore -= 10;
  }
  if (!sections.skills) {
    formattingFeedback.push("Missing dedicated skills section.");
    formattingScore -= 10;
  }
  if (!sections.experience) {
    formattingFeedback.push("Missing professional experience section.");
    formattingScore -= 20;
  }
  
  formattingScore = Math.max(0, formattingScore);

  // 6. ATS Readability (5%)
  let readabilityScore = 100;
  const sentences = docResume.sentences().out('array');
  if (sentences.length < 5) {
    readabilityScore = 40;
  } else {
    const longSentences = sentences.filter((s: string) => s.split(" ").length > 30);
    if (longSentences.length > 5) {
      readabilityScore -= 20;
    }
    const verbs = docResume.verbs().out('array');
    if (verbs.length < 10) {
      readabilityScore -= 20;
    }
  }
  readabilityScore = Math.max(0, readabilityScore);

  // 7. Contact Information Completeness (5%)
  let contactInfoScore = 100;
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,4}[-.\s]??)?(\(?\d{2,3}\)?[-.\s]??)?\d{3,4}[-.\s]??\d{4}/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);

  if (!hasEmail) contactInfoScore -= 40;
  if (!hasPhone) contactInfoScore -= 40;
  if (!hasLinkedIn) contactInfoScore -= 20;

  contactInfoScore = Math.max(0, contactInfoScore);

  // FINAL ATS SCORE CALCULATION
  const atsScore = Math.round(
    keywordScore * 0.30 +
    skillsScore * 0.25 +
    experienceScore * 0.15 +
    educationScore * 0.10 +
    formattingScore * 0.10 +
    readabilityScore * 0.05 +
    contactInfoScore * 0.05
  );

  // Generate Recommendations
  const recommendations: Recommendation[] = [];

  if (missingKeywords.length > 0) {
    recommendations.push({
      priority: "High Priority",
      text: `Add missing keywords to improve match: ${missingKeywords.slice(0, 5).join(", ")}.`
    });
  }
  if (!hasEmail || !hasPhone) {
    recommendations.push({
      priority: "High Priority",
      text: "Ensure your email and phone number are clearly visible at the top of the resume."
    });
  }
  if (!sections.skills || !sections.experience) {
    recommendations.push({
      priority: "High Priority",
      text: "Re-organize resume structure into standard sections (Professional Summary, Technical Skills, Experience, Education)."
    });
  }
  if (formattingScore < 80) {
    recommendations.push({
      priority: "Medium Priority",
      text: "Simplify your resume layout. Avoid tables and multi-column designs for better ATS parsing."
    });
  }
  if (readabilityScore < 80) {
    recommendations.push({
      priority: "Medium Priority",
      text: "Use shorter, more impactful sentences starting with strong action verbs."
    });
  }
  if (!hasLinkedIn) {
    recommendations.push({
      priority: "Low Priority",
      text: "Include a link to your LinkedIn profile in your contact header."
    });
  }

  const scoreBreakdown = {
    keywordWeight: 30,
    skillsWeight: 25,
    experienceWeight: 15,
    educationWeight: 10,
    formattingWeight: 10,
    readabilityWeight: 5,
    contactInfoWeight: 5
  };

  return {
    atsScore,
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    formattingScore,
    readabilityScore,
    contactInfoScore,
    matchedKeywords,
    missingKeywords,
    formattingFeedback,
    recommendations,
    scoreBreakdown
  };
}
