import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseResume } from "@/lib/parser";
import { analyzeATSCompatibility } from "@/lib/atsAnalyzer";

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
    const jobDescription = formData.get("jobDescription") as string | null;

    // 1. Validation
    if (!file) {
      return NextResponse.json({ error: "Missing resume file. Please upload a PDF or DOCX." }, { status: 400 });
    }
    if (!jobDescription || jobDescription.trim().length < 200) {
      return NextResponse.json({ error: "Job description must be at least 200 characters long." }, { status: 400 });
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
      return NextResponse.json({ error: "Could not extract text from the uploaded file. Ensure it is not empty or password-protected." }, { status: 400 });
    }

    // 3. Analyze ATS Compatibility
    const analysis = await analyzeATSCompatibility(resumeText, jobDescription);

    // 4. Save to Database
    const report = await prisma.aTSAnalysis.create({
      data: {
        userId,
        resumeName: file.name,
        atsScore: analysis.atsScore,
        keywordScore: analysis.keywordScore,
        skillsScore: analysis.skillsScore,
        experienceScore: analysis.experienceScore,
        educationScore: analysis.educationScore,
        formattingScore: analysis.formattingScore,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        recommendations: analysis.recommendations as any, // Array of Recommendations serialized to JSON automatically by Prisma
      }
    });

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("ATS Analysis endpoint error:", error);
    return NextResponse.json({ error: error.message || "Failed to process and analyze resume." }, { status: 500 });
  }
}
