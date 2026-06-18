"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  FileCheck,
  Search,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  XCircle,
  Printer,
  ChevronRight,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getResumesAction, calculateAtsScoreAction, getAtsScoresAction } from "@/app/actions/resume";

function AtsCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const urlResumeId = searchParams.get("resumeId");

  // Selection state
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"keywords" | "formatting" | "improvements">("keywords");

  useEffect(() => {
    if (session?.user) {
      loadResumes();
    }
  }, [session]);

  useEffect(() => {
    if (urlResumeId) {
      setSelectedResumeId(urlResumeId);
    } else if (resumes.length > 0) {
      setSelectedResumeId(resumes[0].id);
    }
  }, [urlResumeId, resumes]);

  const loadResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const userResumes = await getResumesAction(userId);
      setResumes(userResumes);
      if (userResumes.length > 0 && !urlResumeId) {
        setSelectedResumeId(userResumes[0].id);
      }
    } catch (e) {
      console.error("Error loading resumes:", e);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedResumeId || !targetRole) {
      toast("Please select a resume copy and enter your target job title.", "warning");
      return;
    }

    setIsAnalyzing(true);
    setReport(null);

    try {
      const selectedResume = resumes.find((r) => r.id === selectedResumeId);
      const textToAnalyze = selectedResume?.parsedText || `Dummy parsed resume content. Experience with React, Node.js, and style sheets.`;
      
      const scoreResult = await calculateAtsScoreAction(selectedResumeId, targetRole, textToAnalyze);
      setReport(scoreResult);
      toast("ATS score analysis complete!", "success");
    } catch (err) {
      toast("Failed to process ATS checker.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score < 60) return "text-rose-500 stroke-rose-500";
    if (score < 80) return "text-amber-500 stroke-amber-500";
    return "text-emerald-500 stroke-emerald-500";
  };

  const getScoreBg = (score: number) => {
    if (score < 60) return "bg-rose-50 border-rose-100 text-rose-800";
    if (score < 80) return "bg-amber-50 border-amber-100 text-amber-800";
    return "bg-emerald-50 border-emerald-100 text-emerald-800";
  };

  return (
    <div className="flex-1 bg-brand-bg py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 print:px-0 print:max-w-full">
        
        {/* Header - Hidden on print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">ATS Checker</h1>
            <p className="text-slate-500 text-sm mt-1">Benchmark your CV formatting and keywords against applicant portals.</p>
          </div>
          <Link
            href="/resume-upload"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 shadow-sm flex items-center justify-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload New Version
          </Link>
        </div>

        {/* Form Controls - Hidden on print */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Resume selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Resume Copy
              </label>
              {isLoadingResumes ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
              ) : resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary font-semibold text-slate-700 focus:bg-white transition-colors"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.fileName} (v{res.version})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs flex justify-between items-center font-medium">
                  <span>No uploaded resumes found.</span>
                  <Link href="/resume-upload" className="text-primary font-bold hover:underline flex items-center gap-0.5">
                    Upload here
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Target Job role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary pl-9 font-semibold text-slate-700 focus:bg-white transition-colors"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || resumes.length === 0}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Parsing CV formatting logs...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Calculate ATS Match Score
              </>
            )}
          </button>
        </div>

        {/* Results display */}
        {report ? (
          <div className="space-y-6">
            
            {/* Top overview card */}
            <div className="glass-card p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 print:border-none print:shadow-none print:p-0">
              
              {/* Left text */}
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider print:hidden">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Report Generated
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    ATS Audit: {report.targetRole}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Benchmarks calculated on: {new Date(report.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                
                {/* Benchmark score tag */}
                <div className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold max-w-sm ${getScoreBg(report.score)}`}>
                  {report.score >= 80 ? (
                    <div className="flex gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span>**Excellent match odds!** Your resume hits the sweet spot for applicant parsing filters. Feel free to submit.</span>
                    </div>
                  ) : report.score >= 60 ? (
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>**Moderate match parameters**. Your profile contains relevant terms, but integrating key missing keywords will increase interview response rates.</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span>**Low matching probability**. Section headers require structural changes, and many core technologies are missing. Follow recommendations.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Radial dial */}
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke={report.score >= 80 ? "#10b981" : report.score >= 60 ? "#f59e0b" : "#f43f5e"}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 * (1 - report.score / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">{report.score}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ATS Score</span>
                </div>
              </div>

            </div>

            {/* Diagnostics grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Navigation controls - Hidden on print */}
              <div className="md:col-span-4 bg-white p-3 border border-slate-200 rounded-2xl space-y-1 print:hidden shadow-sm">
                <button
                  onClick={() => setActiveTab("keywords")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    activeTab === "keywords"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>Keywords found</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === "keywords" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {report.keywordsFound.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab("formatting")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    activeTab === "formatting"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>Formatting issues</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === "formatting" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    Issues
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab("improvements")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${
                    activeTab === "improvements"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>Action list</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === "improvements" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    Fixes
                  </span>
                </button>
              </div>

              {/* Panel detail */}
              <div className="md:col-span-8 glass-card p-6 rounded-2xl border border-slate-200 print:col-span-12 print:border-none print:shadow-none print:p-0 print:space-y-6">
                
                {/* Print Headers (only visible when printing) */}
                <div className="hidden print:block border-b border-slate-200 pb-4 mb-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Detailed Keyword Breakdown</h3>
                </div>

                {/* 1. KEYWORDS PANEL */}
                {(activeTab === "keywords" || typeof window === "undefined" /* Fallback print layout */) && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider print:hidden">Keyword Match Matrix</h3>
                      <p className="text-slate-500 text-xs mt-0.5 print:hidden">Matching technical keywords present in the target job spec.</p>
                    </div>

                    {/* Found keywords */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Found ({report.keywordsFound.length})</span>
                      <div className="flex flex-wrap gap-2">
                        {report.keywordsFound.map((kw: string) => (
                          <span key={kw} className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing keywords */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Missing ({report.keywordsMissing.length})</span>
                      <div className="flex flex-wrap gap-2">
                        {report.keywordsMissing.map((kw: string) => (
                          <span key={kw} className="bg-rose-50 border border-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Print Headers (only visible when printing) */}
                <div className="hidden print:block border-b border-slate-200 pb-4 mb-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Formatting and Layout Audit</h3>
                </div>

                {/* 2. FORMATTING PANEL */}
                {(activeTab === "formatting" || typeof window === "undefined") && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider print:hidden">Layout Critiques</h3>
                      <p className="text-slate-500 text-xs mt-0.5 print:hidden">Layout flags detected by parsing guidelines.</p>
                    </div>
                    
                    <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                      {report.formattingFeedback}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100 font-medium mt-4">
                      {report.sectionAnalysis}
                    </div>
                  </div>
                )}

                {/* Print Headers (only visible when printing) */}
                <div className="hidden print:block border-b border-slate-200 pb-4 mb-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Recommended Improvement Steps</h3>
                </div>

                {/* 3. IMPROVEMENTS PANEL */}
                {(activeTab === "improvements" || typeof window === "undefined") && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider print:hidden">Action Recommendations</h3>
                      <p className="text-slate-500 text-xs mt-0.5 print:hidden">Changes to increase matching odds.</p>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                      {report.improvements}
                    </div>
                  </div>
                )}

                {/* Print action (Visible only on print layouts to sign off the report) */}
                <div className="hidden print:block pt-8 text-center text-xs text-slate-400 border-t border-slate-200 mt-10">
                  Report generated by CareerMate. Accelerate your career search with AI tools.
                </div>

              </div>

            </div>

            {/* Print action controls - Hidden on print */}
            <div className="flex gap-4 justify-end pt-4 print:hidden">
              <button
                onClick={triggerPrint}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print/Download PDF Report
              </button>
            </div>

          </div>
        ) : (
          !isAnalyzing && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-bold text-slate-800 text-base">Select parameters to calculate match percentage</h3>
                <p className="text-slate-500 text-xs">Choose one of your saved resumes and enter your target job description to run a simulated ATS parser.</p>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default function AtsCheckerPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AtsCheckerContent />
    </Suspense>
  );
}
