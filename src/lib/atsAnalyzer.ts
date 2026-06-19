/**
 * ATS Analysis Engine
 * Calculates compatibility scores, formatting feedback, and recommendations.
 */

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
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingFeedback: string[];
  recommendations: Recommendation[];
}

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

/**
 * Local Fallback Analyzer using Regex and dictionary matching.
 */
export function analyzeLocally(resumeText: string, jobDescription: string): ATSAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // 1. Keyword Analysis
  // Find which dictionary terms appear in the Job Description (target keywords)
  const targetKeywords = SKILLS_DICTIONARY.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(jdLower);
  });

  // Fallback if no dictionary keywords match: extract common capitalized words
  if (targetKeywords.length === 0) {
    const jdWords = jobDescription.match(/\b[A-Za-z]{3,15}\b/g) || [];
    const uniqueWords = Array.from(new Set(jdWords.map(w => w.toLowerCase())));
    // Match common nouns/keywords
    const stopWords = ["the", "and", "for", "with", "this", "that", "from", "your", "will", "have", "been", "role", "team", "work"];
    targetKeywords.push(...uniqueWords.filter(w => w.length > 4 && !stopWords.includes(w)).slice(0, 15));
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(resumeLower)) {
      // Capitalize the first letter for presentation
      matchedKeywords.push(keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    } else {
      missingKeywords.push(keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  });

  const keywordScore = targetKeywords.length > 0 
    ? Math.round((matchedKeywords.length / targetKeywords.length) * 100)
    : 70;

  // 2. Skills Match Score (based on matching common tech tags)
  const skillsScore = keywordScore; // Simply align with keyword match rate for this baseline fallback

  // 3. Experience Match Score
  // Look for job level context in job description vs resume
  let experienceScore = 75;
  const isSeniorJd = jdLower.includes("senior") || jdLower.includes("lead") || jdLower.includes("manager") || jdLower.includes("5+") || jdLower.includes("8+");
  const isSeniorResume = resumeLower.includes("senior") || resumeLower.includes("lead") || resumeLower.includes("manager") || resumeLower.includes("architect") || resumeLower.includes("principal");
  
  if (isSeniorJd) {
    if (isSeniorResume) experienceScore = 95;
    else experienceScore = 55; // junior trying to apply for senior
  } else {
    experienceScore = 85; // general match
  }

  // 4. Education Match Score
  let educationScore = 60;
  const degrees = ["bachelor", "master", "phd", "ph.d", "b.s", "m.s", "computer science", "degree", "university", "college"];
  const JdMentionsDegree = degrees.some(d => jdLower.includes(d));
  const ResumeMentionsDegree = degrees.some(d => resumeLower.includes(d));

  if (JdMentionsDegree) {
    if (ResumeMentionsDegree) educationScore = 95;
    else educationScore = 50;
  } else {
    educationScore = 90; // If not explicitly specified, assume matched
  }

  // 5. Formatting & Warnings Check
  const formattingFeedback: string[] = [];
  let formattingScore = 100;

  // Detect tables (continuous grid lines or piping)
  if (resumeText.includes("|") || resumeText.includes("+---") || resumeText.includes("║")) {
    formattingFeedback.push("Tables detected: ATS parsers often scramble table contents.");
    formattingScore -= 15;
  }

  // Detect multi-columns (heuristically look for spaces of 4 or more spaces separating text blocks on same line)
  const lines = resumeText.split("\n");
  let multiColumnLinesCount = 0;
  for (const line of lines) {
    if (/\w{2,}\s{5,}\w{2,}/.test(line)) {
      multiColumnLinesCount++;
    }
  }
  if (multiColumnLinesCount > 5) {
    formattingFeedback.push("Multi-column layout detected: Text extraction may read columns side-by-side instead of sequentially.");
    formattingScore -= 10;
  }

  // Detect contact details
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /(\+?\d{1,4}[-.\s]??)?(\(?\d{2,3}\)?[-.\s]??)?\d{3,4}[-.\s]??\d{4}/.test(resumeText);
  if (!hasEmail && !hasPhone) {
    formattingFeedback.push("Missing contact details: Ensure email and phone number are clearly visible.");
    formattingScore -= 15;
  }

  // Detect sections presence
  const sections = {
    summary: /summary|profile|objective|about me/i.test(resumeText),
    skills: /skills|technologies|expertise|core competencies/i.test(resumeText),
    experience: /experience|employment|work history|projects/i.test(resumeText),
    education: /education|academic|credentials/i.test(resumeText)
  };

  if (!sections.summary) {
    formattingFeedback.push("Missing summary section: Add a professional profile/summary block.");
    formattingScore -= 10;
  }
  if (!sections.skills) {
    formattingFeedback.push("Missing skills section: Group your technologies and capabilities in a dedicated section.");
    formattingScore -= 10;
  }
  if (!sections.experience) {
    formattingFeedback.push("Missing experience section: Professional history must be clearly defined.");
    formattingScore -= 15;
  }
  if (!sections.education) {
    formattingFeedback.push("Missing education section: Add academic details or degrees.");
    formattingScore -= 10;
  }

  // Ensure formatting score doesn't drop below 30
  formattingScore = Math.max(formattingScore, 30);

  // 6. Calculate Weighted ATS Score
  // Weights: Keyword Match: 40%, Skills Match: 25%, Experience Relevance: 20%, Education Match: 10%, Resume Formatting: 5%
  const atsScore = Math.round(
    keywordScore * 0.40 +
    skillsScore * 0.25 +
    experienceScore * 0.20 +
    educationScore * 0.10 +
    formattingScore * 0.05
  );

  // 7. Generate Recommendations
  const recommendations: Recommendation[] = [];

  // High Priority
  if (missingKeywords.length > 0) {
    recommendations.push({
      priority: "High Priority",
      text: `Add missing high-impact technical keywords: ${missingKeywords.slice(0, 3).join(", ")}.`
    });
  }
  if (!sections.skills || !sections.experience) {
    recommendations.push({
      priority: "High Priority",
      text: "Re-organize resume structure into standard sections (Professional Summary, Technical Skills, Experience, Education)."
    });
  }
  if (!hasEmail && !hasPhone) {
    recommendations.push({
      priority: "High Priority",
      text: "Add complete contact details (email and phone) to the very top header."
    });
  }

  // Medium Priority
  if (missingKeywords.length > 3) {
    recommendations.push({
      priority: "Medium Priority",
      text: `Integrate additional secondary keywords: ${missingKeywords.slice(3, 6).join(", ")}.`
    });
  }
  if (formattingScore < 90) {
    recommendations.push({
      priority: "Medium Priority",
      text: "Simplify layout styling by removing tables, icons, graphics, and multi-column divisions."
    });
  }
  recommendations.push({
    priority: "Medium Priority",
    text: "Quantify achievements using metrics and percentages (e.g. 'Optimized performance by 15%')."
  });

  // Low Priority
  if (!sections.summary) {
    recommendations.push({
      priority: "Low Priority",
      text: "Write a short 3-line professional profile highlighting your target job alignment."
    });
  }
  recommendations.push({
    priority: "Low Priority",
    text: "Review formatting consistency (font-size, margins, clear date ranges)."
  });

  return {
    atsScore,
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    formattingScore,
    matchedKeywords,
    missingKeywords,
    formattingFeedback,
    recommendations
  };
}

/**
 * OpenAI Semantic Analyzer.
 */
export async function analyzeWithOpenAI(resumeText: string, jobDescription: string, apiKey: string): Promise<ATSAnalysisResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert Applicant Tracking System (ATS) parser and recruiter. 
            Analyze the provided Resume text against the Job Description. 
            Perform formatting checks, keyword matching, skills gap assessment, education alignment, and experience relevance calculation.
            
            Return your response as a valid JSON object matching the following structure:
            {
              "atsScore": number, // Overall composite score between 0 and 100
              "keywordScore": number, // 0 to 100
              "skillsScore": number, // 0 to 100
              "experienceScore": number, // 0 to 100
              "educationScore": number, // 0 to 100
              "formattingScore": number, // 0 to 100
              "matchedKeywords": string[],
              "missingKeywords": string[],
              "formattingFeedback": string[], // List any formatting warnings (e.g. columns, tables, headers, footers, missing contact details, missing standard sections)
              "recommendations": [
                {
                  "priority": "High Priority" | "Medium Priority" | "Low Priority",
                  "text": string
                }
              ]
            }

            You must strictly calculate 'atsScore' using the following weighted parameters:
            - Keyword Match: 40%
            - Skills Match: 25%
            - Experience Relevance: 20%
            - Education Match: 10%
            - Resume Formatting: 5%
            
            Formula: atsScore = Math.round(keywordScore * 0.40 + skillsScore * 0.25 + experienceScore * 0.20 + educationScore * 0.10 + formattingScore * 0.05)
            Ensure that formattingFeedback lists actionable warnings, and recommendations are practical.`
          },
          {
            role: "user",
            content: `Resume:
            ${resumeText}
            
            Job Description:
            ${jobDescription}`
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.warn("OpenAI API call failed, falling back to local analysis:", errorMsg);
      return analyzeLocally(resumeText, jobDescription);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;
    if (!resultText) {
      throw new Error("No response choices returned from OpenAI API.");
    }

    const parsedResult = JSON.parse(resultText) as ATSAnalysisResult;

    // Validate the parsed values just to make sure
    return {
      atsScore: typeof parsedResult.atsScore === 'number' ? parsedResult.atsScore : 70,
      keywordScore: typeof parsedResult.keywordScore === 'number' ? parsedResult.keywordScore : 70,
      skillsScore: typeof parsedResult.skillsScore === 'number' ? parsedResult.skillsScore : 70,
      experienceScore: typeof parsedResult.experienceScore === 'number' ? parsedResult.experienceScore : 70,
      educationScore: typeof parsedResult.educationScore === 'number' ? parsedResult.educationScore : 70,
      formattingScore: typeof parsedResult.formattingScore === 'number' ? parsedResult.formattingScore : 90,
      matchedKeywords: Array.isArray(parsedResult.matchedKeywords) ? parsedResult.matchedKeywords : [],
      missingKeywords: Array.isArray(parsedResult.missingKeywords) ? parsedResult.missingKeywords : [],
      formattingFeedback: Array.isArray(parsedResult.formattingFeedback) ? parsedResult.formattingFeedback : [],
      recommendations: Array.isArray(parsedResult.recommendations) ? parsedResult.recommendations : []
    };
  } catch (error) {
    console.error("OpenAI analysis failed. Falling back to local analysis:", error);
    return analyzeLocally(resumeText, jobDescription);
  }
}

/**
 * Universal Analysis Entry Point
 */
export async function analyzeATSCompatibility(resumeText: string, jobDescription: string): Promise<ATSAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return analyzeWithOpenAI(resumeText, jobDescription, apiKey);
  } else {
    console.log("No OPENAI_API_KEY configured. Performing local analysis...");
    return analyzeLocally(resumeText, jobDescription);
  }
}
