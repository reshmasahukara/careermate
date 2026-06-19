"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BarChart,
  Layers,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getResumesAction } from "@/app/actions/resume";
import DashboardLayout from "@/components/DashboardLayout";

export default function ResumeAnalysisPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string | null>("experience");

  useEffect(() => {
    if (session?.user) {
      loadResumes();
    }
  }, [session]);

  const loadResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const userResumes = await getResumesAction(userId);
      setResumes(userResumes);
      if (userResumes.length > 0) {
        setSelectedResumeId(userResumes[0].id);
      }
    } catch (e) {
      console.error("Error loading resumes:", e);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleRunAnalysis = () => {
    if (!selectedResumeId) {
      toast("Please select a resume version to analyze.", "warning");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate extensive AI evaluation
    setTimeout(() => {
      const mockAnalysis = {
        resumeId: selectedResumeId,
        score: 78,
        summary: "Your resume structure is solid, but the experience section suffers from passive phrasing and a lack of numeric metrics. Core skills are well listed, but layout conventions could be modernized.",
        sections: [
          {
            id: "header",
            title: "Header & Contact Details",
            score: 92,
            status: "good",
            critique: "Contact details are present. LinkedIn profile is linked properly.",
            improvements: [
              "Move contact numbers out of the margins to avoid header parsing problems on older ATS gateways.",
              "Ensure your GitHub link uses clean URL routing (avoid redirects)."
            ]
          },
          {
            id: "experience",
            title: "Work Experience & Impact",
            score: 68,
            status: "warning",
            critique: "Bullet points are descriptive of duties, but they lack quantitative achievements and action verbs.",
            improvements: [
              "Replace passive verbs (e.g. 'Responsible for writing React elements') with active verbs (e.g. 'Engineered high-performance React client modules').",
              "Add metric indicators: instead of 'improved speed', use 'optimized bundle hydration, yielding a 20% faster load speed (Core Web Vitals)'."
            ],
            verbsAnalyzed: [
              { verb: "Responsible for", status: "weak", replace: "Led / Headed" },
              { verb: "Worked on", status: "weak", replace: "Executed / Developed" },
              { verb: "Optimized", status: "strong", replace: "" },
            ]
          },
          {
            id: "skills",
            title: "Skills & Keywords alignment",
            score: 80,
            status: "good",
            critique: "Strong frontend skill keywords present. Missing core DevOps or tooling entries expected in senior roles.",
            improvements: [
              "Integrate standard modern CI/CD tags like Docker, GitHub Actions, or AWS.",
              "Categorize technologies under clean visual headers (Frontend, DevOps, Tools)."
            ]
          },
          {
            id: "education",
            title: "Education & Certifications",
            score: 95,
            status: "good",
            critique: "Excellent representation. Degrees, major, school, and date are clean.",
            improvements: [
              "List graduation dates in Year format only (e.g. '2024') rather than month format to maintain alignment standard."
            ]
          }
        ],
        priorityChanges: [
          { level: "High Priority", text: "Quantify Vercel role achievements with numeric metrics.", code: "EXP-01" },
          { level: "Medium Priority", text: "Replace weak verbs ('Worked on', 'Responsible for') under past employment.", code: "EXP-02" },
          { level: "Low Priority", text: "Remove contact details from top margins.", code: "HDR-01" },
        ]
      };

      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      toast("Detailed section analysis complete!", "success");
    }, 1200);
  };
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Resume Analysis</h1>
          <p className="text-[#64748B] text-xs font-semibold mt-1">Get section-by-section AI evaluations and semantic content improvements.</p>
        </div>

        {/* Form selection */}
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">
              Select Resume Version
            </label>
            {isLoadingResumes ? (
              <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
            ) : resumes.length > 0 ? (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-700 focus:bg-white transition-colors"
              >
                {resumes.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.fileName} (v{res.version})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-semibold">
                No resumes uploaded yet. Click{" "}
                <Link href="/resume-upload" className="text-[#10B981] hover:underline font-bold">
                  Upload
                </Link>{" "}
                to start.
              </div>
            )}
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || resumes.length === 0}
            className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors text-xs flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer self-end"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Sections...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Section Audit
              </>
            )}
          </button>
        </div>

        {/* Audit Report */}
        {analysisResult ? (
          <div className="space-y-6">
            
            {/* Top Score Box */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">Overall Structure Score</h2>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Calculated
                  </span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#6366F1] flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                <span className="text-3xl font-black">{analysisResult.score}</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-80">Structure</span>
              </div>
            </div>

            {/* Key Action Priorities */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Priority Corrections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResult.priorityChanges.map((change: any) => (
                  <div
                    key={change.code}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      change.level.includes("High")
                        ? "bg-rose-50 border-rose-100 text-rose-800"
                        : change.level.includes("Medium")
                        ? "bg-amber-50 border-amber-100 text-amber-800"
                        : "bg-emerald-50 border-emerald-100 text-emerald-800"
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                        {change.level}
                      </span>
                      <p className="text-xs mt-1 leading-relaxed font-semibold">
                        {change.text}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-4 block self-end">
                      {change.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Detailed Section Audits</h3>
              
              <div className="space-y-3">
                {analysisResult.sections.map((section: any) => {
                  const isOpen = openSection === section.id;
                  return (
                    <div
                      key={section.id}
                      className="border border-[#E5E7EB] rounded-[20px] overflow-hidden bg-white shadow-sm"
                    >
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.id)}
                        className="w-full flex justify-between items-center p-5 font-bold text-slate-800 text-left focus:outline-none cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 text-sm sm:text-base">
                          <span className={`w-2.5 h-2.5 rounded-full ${section.status === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {section.title}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 font-bold uppercase">{section.score}/100</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-50 space-y-4 bg-slate-50/50">
                          
                          {/* Critique */}
                          <div className="text-xs font-semibold text-slate-700 leading-relaxed">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">AI Critique</span>
                            {section.critique}
                          </div>

                          {/* Action verbs evaluated (only for Experience section) */}
                          {section.verbsAnalyzed && (
                            <div className="space-y-2">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Verb impact assessment</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {section.verbsAnalyzed.map((verbItem: any, i: number) => (
                                  <div
                                    key={i}
                                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                                      verbItem.status === "weak"
                                        ? "bg-rose-50/40 border-rose-100 text-rose-700"
                                        : "bg-emerald-50/40 border-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    <div>
                                      <span className="font-bold">"{verbItem.verb}"</span>
                                      <span className="text-[9px] opacity-70 block">({verbItem.status})</span>
                                    </div>
                                    {verbItem.replace && (
                                      <span className="text-[10px] font-bold bg-white border border-rose-100 px-2 py-0.5 rounded text-slate-800">
                                        Use: {verbItem.replace}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Improvements checklist */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Key changes required</span>
                            <ul className="space-y-2">
                              {section.improvements.map((imp: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-1.5" />
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          !isAnalyzing && (
            <div className="text-center py-16 bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#10B981]">
                <BarChart className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-bold text-slate-800 text-base">Run a section evaluation</h3>
                <p className="text-slate-500 text-xs">Choose a resume copy and click analyze to audit experience verbs, header formats, and education metrics.</p>
              </div>
            </div>
          )
        )}

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Check ATS Match Percentage</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Validate your resume keywords against specific target job requirements to optimize parsing success.
            </p>
          </div>
          <Link
            href="/ats-checker"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Run ATS Scan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
