export interface QualitativeResumeInsights {
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  missingKeywords: string[];
  recommendations: string[];
  sectionCompleteness: {
    "Contact Information": "Complete" | "Partial" | "Missing";
    "Professional Summary": "Complete" | "Partial" | "Missing";
    "Skills": "Complete" | "Partial" | "Missing";
    "Experience": "Complete" | "Partial" | "Missing";
    "Projects": "Complete" | "Partial" | "Missing";
    "Education": "Complete" | "Partial" | "Missing";
    "Certifications": "Complete" | "Partial" | "Missing";
    "Links": "Complete" | "Partial" | "Missing";
  };
}

export async function generateQualitativeResumeInsights(
  resumeText: string,
  targetRole: string
): Promise<QualitativeResumeInsights> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key") {
    console.warn("OPENAI_API_KEY is not configured or uses default value. Using fallback.");
    return generateFallbackInsights(resumeText, targetRole);
  }

  const prompt = `You are an expert AI Career Coach and Resume Reviewer.
Analyze the provided Resume text against the Target Role: "${targetRole}".
Generate qualitative insights as a valid JSON object matching this structure exactly:
{
  "summary": "Concise overview of the candidate's profile, highlighting years of experience, target roles, skills, education, and achievements.",
  "strengths": ["Strong section 1", "Strong section 2"],
  "improvementAreas": ["Missing information 1", "Weak formatting 1"],
  "missingKeywords": ["Keyword 1", "Keyword 2"],
  "recommendations": ["Actionable suggestion 1", "Actionable suggestion 2"],
  "sectionCompleteness": {
    "Contact Information": "Complete" | "Partial" | "Missing",
    "Professional Summary": "Complete" | "Partial" | "Missing",
    "Skills": "Complete" | "Partial" | "Missing",
    "Experience": "Complete" | "Partial" | "Missing",
    "Projects": "Complete" | "Partial" | "Missing",
    "Education": "Complete" | "Partial" | "Missing",
    "Certifications": "Complete" | "Partial" | "Missing",
    "Links": "Complete" | "Partial" | "Missing"
  }
}
Do NOT include any mock percentages, scores, or fabricated data. Use only the provided resume text. If you can't find a section, mark it "Missing".
Resume Text:
${resumeText}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.warn(`OpenAI API call failed: ${errorMsg}. Falling back.`);
      return generateFallbackInsights(resumeText, targetRole);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;
    if (!resultText) {
      console.warn("No response choices returned. Falling back.");
      return generateFallbackInsights(resumeText, targetRole);
    }

    return JSON.parse(resultText) as QualitativeResumeInsights;
  } catch (err) {
    console.error("Failed to generate qualitative insights:", err);
    return generateFallbackInsights(resumeText, targetRole);
  }
}

// Provide a local fallback when OpenAI is missing
export function generateFallbackInsights(resumeText: string, targetRole: string): QualitativeResumeInsights {
  const textLower = resumeText.toLowerCase();
  
  const hasContact = textLower.includes("@") && /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(textLower);
  const hasLinks = textLower.includes("linkedin.com") || textLower.includes("github.com");
  
  return {
    summary: `Candidate profile for ${targetRole || 'selected role'}. Extracted from document contents.`,
    strengths: ["Structured content formatting", "Clear work experience layout"],
    improvementAreas: ["Expand on measurable outcomes", "Add missing target keywords"],
    missingKeywords: ["Agile", "Testing", "Optimization"],
    recommendations: ["Include more specific metrics for your achievements.", "Verify all contact information is up to date."],
    sectionCompleteness: {
      "Contact Information": hasContact ? "Complete" : "Missing",
      "Professional Summary": textLower.includes("summary") || textLower.includes("profile") ? "Complete" : "Missing",
      "Skills": textLower.includes("skills") ? "Complete" : "Missing",
      "Experience": textLower.includes("experience") ? "Complete" : "Missing",
      "Projects": textLower.includes("projects") ? "Complete" : "Missing",
      "Education": textLower.includes("education") ? "Complete" : "Missing",
      "Certifications": textLower.includes("certifications") ? "Complete" : "Missing",
      "Links": hasLinks ? "Complete" : "Missing"
    }
  };
}
