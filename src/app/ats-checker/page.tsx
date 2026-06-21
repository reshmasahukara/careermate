"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Sparkles,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Search,
  Printer,
  ChevronDown,
  Upload,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  Info,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useToast } from "@/components/Providers";
import DashboardLayout from "@/components/DashboardLayout";

// Types
interface Report {
  id: string;
  resumeName: string;
  targetRole: string | null;
  industry: string | null;
  experienceLevel: string | null;
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
  recommendations: any;
  scoreBreakdown: any;
  createdAt: string;
}

const SCORE_WEIGHTS = {
  keywordScore: { label: "Keyword Match", weight: 30, desc: "Matches extracted nouns/terms from the JD against the resume." },
  skillsScore: { label: "Required Skills Match", weight: 25, desc: "Matches explicit skills identified in the text." },
  experienceScore: { label: "Experience Relevance", weight: 15, desc: "Checks experience overlap and semantic similarity." },
  educationScore: { label: "Education Match", weight: 10, desc: "Validates degree requirements." },
  formattingScore: { label: "Resume Formatting", weight: 10, desc: "Checks for tables, columns, and unreadable sections." },
  readabilityScore: { label: "ATS Readability", weight: 5, desc: "Gauges sentence complexity and action verbs." },
  contactInfoScore: { label: "Contact Info Completeness", weight: 5, desc: "Validates email, phone, and standard header elements." },
};

export default function AtsCheckerPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Scan states
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry-level");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  // History states
  const [history, setHistory] = useState<Report[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [whyScoreExpanded, setWhyScoreExpanded] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("cm-ats-jd-draft");
    if (savedDraft) setJobDescription(savedDraft);
  }, []);

  const loadHistory = useCallback(async (search = "") => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/ats/history?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Error loading history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session, loadHistory]);

  const handleJdChange = (val: string) => {
    setJobDescription(val);
    localStorage.setItem("cm-ats-jd-draft", val);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast("File exceeds 5MB limit.", "error");
        return;
      }
      setFile(selectedFile);
      toast(`Resume selected.`, "success");
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1
  });

  const handleClearInputs = () => {
    setFile(null);
    setJobDescription("");
    setTargetRole("");
    setIndustry("");
    setExperienceLevel("Entry-level");
    localStorage.removeItem("cm-ats-jd-draft");
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription || jobDescription.trim().length < 200) {
      toast("Please upload a file and enter a valid JD (> 200 chars).", "error");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);
      formData.append("targetRole", targetRole);
      formData.append("industry", industry);
      formData.append("experienceLevel", experienceLevel);

      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "ATS analysis failed.");
      }

      const report = await res.json();
      setActiveReport(report);
      toast("Analysis complete!", "success");
      
      handleClearInputs();
      loadHistory();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      toast(err.message || "An error occurred.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm("Are you sure you want to delete this scan report permanently?")) {
      try {
        const res = await fetch(`/api/ats/${reportId}`, { method: "DELETE" });
        if (res.ok) {
          toast("Report deleted.", "success");
          if (activeReport?.id === reportId) setActiveReport(null);
          loadHistory(searchQuery);
        } else {
          toast("Failed to delete report.", "error");
        }
      } catch (err) {
        toast("Error deleting report.", "error");
      }
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
          <p className="text-sm font-semibold text-[#64748B]">Loading ATS Module...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Sorting and Pagination
  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "desc" 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return sortOrder === "desc" ? b.atsScore - a.atsScore : a.atsScore - b.atsScore;
    }
  });

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const paginatedHistory = sortedHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper for Match Level
  const getMatchLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score >= 75) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (score >= 60) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { label: "Needs Improvement", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 bg-[#F5F7FA] min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Enterprise-Grade Match</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">ATS Score & Analysis</h1>
            <p className="text-sm text-[#64748B] font-medium mt-1">
              Transparent, NLP-driven resume scoring against real-world ATS algorithms.
            </p>
          </div>
          {activeReport && (
            <button
              onClick={() => setActiveReport(null)}
              className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              Start New Scan
            </button>
          )}
        </div>

        {/* --- SECTION 3: RESULTS (Only visible if active report exists) --- */}
        {activeReport && (
          <div className="space-y-6 animate-in fade-in duration-500 print:bg-white print:m-0 print:p-0">
            <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-center justify-between">
              
              <div className="flex items-center gap-8">
                {/* Score Circle */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                    <circle
                      cx="72" cy="72" r="60"
                      stroke={activeReport.atsScore >= 75 ? "#10B981" : activeReport.atsScore >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="12" fill="transparent" strokeLinecap="round"
                      strokeDasharray="377" strokeDashoffset={377 - (377 * activeReport.atsScore) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-[#0F172A]">{activeReport.atsScore}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#0F172A]">{activeReport.resumeName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#64748B]">Match Level:</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getMatchLevel(activeReport.atsScore).bg} ${getMatchLevel(activeReport.atsScore).color} ${getMatchLevel(activeReport.atsScore).border}`}>
                      {getMatchLevel(activeReport.atsScore).label}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] pt-1">
                    Analyzed on {new Date(activeReport.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <button
                  onClick={() => window.print()}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white hover:bg-slate-800 font-bold text-sm rounded-xl shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

            </div>

            {/* Breakdown & Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-4 space-y-6">
                {/* Score Breakdown (Static context of the active report) */}
                <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-100 pb-3 mb-4">ATS Formula Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(SCORE_WEIGHTS).map(([key, info]) => {
                      const scoreVal = activeReport[key as keyof Report] as number;
                      const maxPoints = info.weight;
                      const achieved = Math.round((scoreVal / 100) * maxPoints);
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-[#0F172A] flex items-center gap-1">
                              {info.label}
                              <span className="group relative cursor-pointer">
                                <Info className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-[#0F172A] text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                                  {info.desc}
                                </div>
                              </span>
                            </span>
                            <span className="font-bold text-emerald-600">{achieved} / {maxPoints} pts</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${scoreVal}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 font-mono font-bold text-center">
                        ATS Score = Σ (Category Score × Weight)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                {/* Issues and Feedback */}
                <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#0F172A] mb-4">Analysis Insights</h3>
                  
                  <div className="space-y-6">
                    {/* Critical Issues */}
                    {(activeReport.contactInfoScore < 100 || activeReport.formattingScore < 80) && (
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Critical ATS Blockers Detected
                        </div>
                        <ul className="list-disc pl-5 text-xs text-rose-900 space-y-1">
                          {activeReport.formattingFeedback && activeReport.formattingFeedback.map((f, i) => <li key={i}>{f}</li>)}
                          {activeReport.contactInfoScore < 100 && <li>Missing critical contact information (email/phone/LinkedIn).</li>}
                        </ul>
                      </div>
                    )}

                    {/* Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[#E2E8F0] rounded-xl">
                        <h4 className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeReport.matchedKeywords.length > 0 ? activeReport.matchedKeywords.map((k, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">{k}</span>
                          )) : <span className="text-xs text-slate-400 italic">No matches found.</span>}
                        </div>
                      </div>
                      <div className="p-4 border border-[#E2E8F0] rounded-xl">
                        <h4 className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeReport.missingKeywords.length > 0 ? activeReport.missingKeywords.slice(0, 15).map((k, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{k}</span>
                          )) : <span className="text-xs text-slate-400 italic">No missing keywords!</span>}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-3">Improvement Recommendations</h4>
                      <div className="space-y-2">
                        {activeReport.recommendations && (activeReport.recommendations as any[]).map((rec, i) => (
                          <div key={i} className="p-3 border border-[#E2E8F0] rounded-xl flex items-start gap-3 bg-white">
                            <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider mt-0.5 ${
                              rec.priority === 'High Priority' ? 'bg-rose-100 text-rose-700' :
                              rec.priority === 'Medium Priority' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {rec.priority.split(' ')[0]}
                            </span>
                            <p className="text-xs text-[#0F172A] font-medium leading-relaxed">{rec.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 1 & 2: SCAN SETUP (Visible when no active report) --- */}
        {!activeReport && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 70%: Scan Setup */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-[#0F172A] border-b pb-3 border-slate-100">Setup ATS Compatibility Scan</h2>
                
                {/* Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A] block">1. Upload Resume</label>
                  {file ? (
                    <div className="p-4 border border-[#E2E8F0] rounded-xl bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0F172A]">{file.name}</h4>
                          <p className="text-xs text-[#64748B]">Ready for analysis</p>
                        </div>
                      </div>
                      <button onClick={handleClearInputs} className="p-2 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        isDragActive ? "border-[#10B981] bg-emerald-50" : "border-[#E2E8F0] hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-5 h-5 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A]">Drag & drop your resume</h3>
                      <p className="text-xs text-[#64748B] mt-1">Supports PDF and DOCX (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* JD Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A] block">2. Target Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => handleJdChange(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-40 p-4 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-400 font-semibold">
                    {jobDescription.length} characters
                  </div>
                </div>

                {/* Additional Context Dropdowns */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A] block">3. Context (Optional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Target Role (e.g. Frontend Dev)" 
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#0F172A]"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Industry (e.g. Finance)" 
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#0F172A]"
                      />
                    </div>
                    <div>
                      <select 
                        value={experienceLevel}
                        onChange={e => setExperienceLevel(e.target.value)}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#0F172A] bg-white"
                      >
                        <option value="Entry-level">Entry-level</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !file || jobDescription.length < 200}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Analyze ATS Score</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right 30%: Score Breakdown Explainer */}
            <div className="lg:col-span-4">
              <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-bold text-[#0F172A]">How We Calculate</h3>
                </div>
                <p className="text-xs text-[#64748B] mb-6 font-medium leading-relaxed">
                  Our transparent ATS scoring engine strictly mimics real enterprise parsing algorithms without using random estimations.
                </p>

                <div className="space-y-4">
                  {Object.entries(SCORE_WEIGHTS).map(([key, info]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#0F172A]">{info.label}</span>
                        <span className="font-bold text-slate-500">{info.weight}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 rounded-full" style={{ width: `${info.weight}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setWhyScoreExpanded(!whyScoreExpanded)}
                  className="mt-6 w-full py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Why transparency matters {whyScoreExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                
                {whyScoreExpanded && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2">
                    Many platforms provide "black box" arbitrary percentages. CareerMate's engine strictly searches for semantic overlap, keyword density, and formatting compliance using natural language processing to show exactly where you stand against the job req.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- SECTION 4: HISTORY TABLE --- */}
        <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-sm overflow-hidden mt-8 print:hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base font-bold text-[#0F172A]">ATS Report History</h3>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    loadHistory(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F172A]"
                />
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [b, o] = e.target.value.split("-");
                  setSortBy(b as any);
                  setSortOrder(o as any);
                }}
                className="py-2 px-3 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none bg-white font-semibold"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Resume Name</th>
                  <th className="px-6 py-4">Target Role</th>
                  <th className="px-6 py-4">ATS Score</th>
                  <th className="px-6 py-4">Analysis Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {isLoadingHistory ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading history...
                    </td>
                  </tr>
                ) : paginatedHistory.length > 0 ? (
                  paginatedHistory.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A] truncate max-w-[200px]">{report.resumeName}</div>
                      </td>
                      <td className="px-6 py-4 text-[#64748B] font-medium">{report.targetRole || "Unspecified"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getMatchLevel(report.atsScore).bg} ${getMatchLevel(report.atsScore).color}`}>
                          {report.atsScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#64748B] font-medium text-xs">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setActiveReport(report);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                      No scan history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedHistory.length)} of {sortedHistory.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-[#E2E8F0] rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#0F172A]">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-[#E2E8F0] rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
