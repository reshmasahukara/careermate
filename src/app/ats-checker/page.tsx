"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Sparkles,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Download,
  ArrowRight,
  Search,
  Plus,
  Calendar,
  ChevronRight,
  TrendingUp,
  X,
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Printer,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  History as HistoryIcon,
  Upload
} from "lucide-react";
import { useToast } from "@/components/Providers";
import DashboardLayout from "@/components/DashboardLayout";

// Dynamic imports for Recharts to avoid SSR hydration bugs
import dynamic from "next/dynamic";
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });

export default function AtsCheckerPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Core scan setup states
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // History & search states
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Tab view inside active report
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "formatting" | "recommendations">("overview");

  // Load JD Draft from LocalStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("cm-ats-jd-draft");
    if (savedDraft) {
      setJobDescription(savedDraft);
    }
  }, []);

  // Fetch history on mount / search change
  const loadHistory = useCallback(async (search = "") => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/ats/history?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Error loading scan history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session, loadHistory]);

  // Handle JD input auto-save
  const handleJdChange = (val: string) => {
    setJobDescription(val);
    localStorage.setItem("cm-ats-jd-draft", val);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 800);
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast("File exceeds 5MB limit.", "error");
        return;
      }
      setFile(selectedFile);
      toast(`Resume "${selectedFile.name}" selected.`, "success");
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

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  // Trigger ATS analysis POST request
  const handleAnalyze = async () => {
    if (!file || !jobDescription || jobDescription.trim().length < 200) {
      toast("Please upload a file and enter a description (> 200 chars).", "error");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

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
      toast("Resume analyzed successfully!", "success");
      
      // Clear inputs
      setFile(null);
      setJobDescription("");
      localStorage.removeItem("cm-ats-jd-draft");

      // Reload scan records
      loadHistory();
    } catch (err: any) {
      console.error(err);
      toast(err.message || "An error occurred during analysis.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger report deletion
  const handleDeleteReport = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this scan report permanently?")) {
      try {
        const res = await fetch(`/api/ats/${reportId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          toast("Scan report deleted.", "success");
          if (activeReport?.id === reportId) {
            setActiveReport(null);
          }
          loadHistory(searchQuery);
        } else {
          const errData = await res.json();
          toast(errData.error || "Failed to delete report.", "error");
        }
      } catch (err) {
        console.error(err);
        toast("Error deleting report.", "error");
      }
    }
  };

  // Format file bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Re-run search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    loadHistory(val);
  };

  // Auth checking loading state
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

  if (!session) {
    router.push("/login");
    return null;
  }

  // Parse recommendations safely
  const getRecommendationsArray = (): any[] => {
    if (!activeReport?.recommendations) return [];
    try {
      if (Array.isArray(activeReport.recommendations)) {
        return activeReport.recommendations;
      }
      if (typeof activeReport.recommendations === "string") {
        return JSON.parse(activeReport.recommendations);
      }
    } catch (e) {
      console.error("JSON parsing of recommendations failed:", e);
    }
    return [];
  };

  const matchedKeywordsList = activeReport?.matchedKeywords || [];
  const missingKeywordsList = activeReport?.missingKeywords || [];
  const recommendationsList = getRecommendationsArray();

  // Group recommendations by priority
  const highPriorityRecs = recommendationsList.filter((r: any) => r.priority === "High Priority");
  const medPriorityRecs = recommendationsList.filter((r: any) => r.priority === "Medium Priority");
  const lowPriorityRecs = recommendationsList.filter((r: any) => r.priority === "Low Priority");

  // Format Recharts data
  const getScoreBreakdownData = () => {
    if (!activeReport) return [];
    return [
      { name: "Keywords", Score: activeReport.keywordScore },
      { name: "Skills", Score: activeReport.skillsScore },
      { name: "Experience", Score: activeReport.experienceScore },
      { name: "Education", Score: activeReport.educationScore },
      { name: "Formatting", Score: activeReport.formattingScore }
    ];
  };

  // Historical score progression chart data
  const getImprovementTrendData = () => {
    return history
      .slice()
      .reverse()
      .map(r => ({
        date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Score: r.atsScore,
        name: r.resumeName.substring(0, 10) + "..."
      }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E7EB] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Enterprise Match Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">ATS Match Checker</h1>
            <p className="text-sm text-[#64748B] font-semibold mt-1">
              Verify compatibility, parse formatting blockers, and optimize resume copies against specific job criteria.
            </p>
          </div>

          {activeReport && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveReport(null);
                  setFile(null);
                  setJobDescription("");
                }}
                className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#0F172A] hover:bg-slate-50 font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                New Scan
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
            </div>
          )}
        </div>

        {/* ───── VIEW A: SCANNED REPORT ACTIVE DASHBOARD ───── */}
        {activeReport ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Top Stat Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Giant Radial Gauge Card */}
              <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-slate-400">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Overall Score</span>
                </div>

                {/* Animated Radial SVG progress bar */}
                <div className="relative w-40 h-40 flex items-center justify-center mt-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="64" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                    <circle
                      cx="80"
                      cy="80"
                      r="64"
                      stroke="#10B981"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="402"
                      strokeDashoffset={402 - (402 * activeReport.atsScore) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">{activeReport.atsScore}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Compatibility</span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <h4 className="font-extrabold text-sm text-[#0F172A] truncate max-w-[250px]">{activeReport.resumeName}</h4>
                  <p className="text-xs text-[#64748B] font-semibold">
                    Analyzed on {new Date(activeReport.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Stat breakdown columns */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Metric Box 1 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Keyword Match Rate</span>
                    <h3 className="text-3xl font-black text-[#0F172A] mt-2">{activeReport.keywordScore}%</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${activeReport.keywordScore}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block">{matchedKeywordsList.length} matched / {missingKeywordsList.length} missing</span>
                  </div>
                </div>

                {/* Metric Box 2 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Formatting Strength</span>
                    <h3 className="text-3xl font-black text-[#0F172A] mt-2">{activeReport.formattingScore}%</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeReport.formattingScore}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block">{activeReport.formattingScore === 100 ? "Perfect layout structure" : "Formatting blockers found"}</span>
                  </div>
                </div>

                {/* Metric Box 3 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Required Skills Met</span>
                    <h3 className="text-3xl font-black text-[#0F172A] mt-2">{activeReport.skillsScore}%</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeReport.skillsScore}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block">{activeReport.skillsScore >= 80 ? "High qualification fit" : "Moderate skills mismatch"}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Navigation Tabs (Dashboard Sub-Tab Bar) */}
            <div className="flex border-b border-[#E5E7EB] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "overview" ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveTab("keywords")}
                className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "keywords" ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Keyword Analysis ({matchedKeywordsList.length + missingKeywordsList.length})
              </button>
              <button
                onClick={() => setActiveTab("formatting")}
                className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "formatting" ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Layout & Formatting
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "recommendations" ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Recommendations ({recommendationsList.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column: Tab-specific Views (col 8) */}
              <div className="lg:col-span-8 space-y-6">

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    
                    {/* Score Breakdown Chart */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                        Weighted Score Breakdown
                      </h3>
                      <div className="h-64 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getScoreBreakdownData()} layout="vertical" margin={{ left: -10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} />
                            <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={80} />
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "11px" }} />
                            <Bar dataKey="Score" fill="#10B981" radius={[0, 4, 4, 0]} barSize={16} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Warning Check Banner */}
                    {activeReport.formattingScore < 100 && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-amber-800 text-sm">Potential Compliance Blocks Detected</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            Your document scored a formatting index of {activeReport.formattingScore}%. Check the Layout tab to view formatting blockers that could trip up automated parsing tools.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Brief Recommendations Box */}
                    <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        High-Impact Priority Fixes
                      </h3>
                      
                      <div className="space-y-3">
                        {highPriorityRecs.length > 0 ? (
                          highPriorityRecs.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 border border-rose-100 bg-rose-50/20 rounded-xl flex gap-3">
                              <span className="shrink-0 font-extrabold text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-wider h-fit mt-0.5">High</span>
                              <p className="text-xs font-semibold text-[#0F172A] leading-relaxed">{rec.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs italic text-slate-400 p-4 border border-dashed rounded-xl text-center">
                            No high-priority recommendations! Excellent job matching primary criteria.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* KEYWORDS TAB */}
                {activeTab === "keywords" && (
                  <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                        Keyword Cloud Comparison
                      </h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">
                        Identify matching tags (green) and bridge missing competencies (gray/red) in your next drafting revisions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Matched Keywords */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase text-[#0F172A] tracking-wider flex items-center gap-2 border-b pb-2 border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Matched Keywords ({matchedKeywordsList.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {matchedKeywordsList.length > 0 ? (
                            matchedKeywordsList.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-all hover:scale-102"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-slate-400">No matching keywords detected.</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Keywords */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold uppercase text-[#0F172A] tracking-wider flex items-center gap-2 border-b pb-2 border-slate-100">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          Missing Keywords ({missingKeywordsList.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {missingKeywordsList.length > 0 ? (
                            missingKeywordsList.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all hover:scale-102 flex items-center gap-1"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-slate-400">All target keywords found! Excellent job.</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* FORMATTING TAB */}
                {activeTab === "formatting" && (
                  <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                        Layout Compatibility Audit
                      </h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">
                        Checks for structural components and layouts that standard parsing algorithms may have difficulty extracting.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {activeReport.formattingScore === 100 ? (
                        <div className="p-8 border border-dashed border-emerald-200 bg-emerald-50/10 rounded-xl text-center space-y-3">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                          <h4 className="font-bold text-[#0F172A] text-sm">Perfect Layout Compatibility!</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            No layout obstacles (tables, multiple columns, missing contact fields) were flagged in this file copy.
                          </p>
                        </div>
                      ) : (
                        activeReport.formattingFeedback && activeReport.formattingFeedback.map((issue: string, idx: number) => (
                          <div key={idx} className="p-4 border border-amber-100 bg-amber-50/10 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">{issue}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* RECOMMENDATIONS TAB */}
                {activeTab === "recommendations" && (
                  <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                        Complete Optimization Blueprint
                      </h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">
                        Action items generated by evaluating job expectations, required keywords, and layout barriers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* High Priority */}
                      {highPriorityRecs.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">High Priority Action Required</h4>
                          {highPriorityRecs.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl text-xs font-semibold text-rose-950 flex gap-2">
                              <span>•</span>
                              <span>{rec.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Medium Priority */}
                      {medPriorityRecs.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Medium Priority Recommended</h4>
                          {medPriorityRecs.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl text-xs font-semibold text-amber-950 flex gap-2">
                              <span>•</span>
                              <span>{rec.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Low Priority */}
                      {lowPriorityRecs.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Low Priority Optimizations</h4>
                          {lowPriorityRecs.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex gap-2">
                              <span>•</span>
                              <span>{rec.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Score Trends & History list (col 4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Score improvement graph */}
                {history.length > 1 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Score Progression
                    </h3>
                    <div className="h-32 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getImprovementTrendData()} margin={{ top: 5, left: -25, right: 5 }}>
                          <defs>
                            <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} />
                          <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                          <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "6px" }} />
                          <Area type="monotone" dataKey="Score" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Quick History Scans List */}
                <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <HistoryIcon className="w-4 h-4 text-slate-400" />
                    Past Scans ({history.length})
                  </h3>

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {history
                      .filter(r => r.id !== activeReport.id)
                      .slice(0, 5)
                      .map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setActiveReport(item);
                            setActiveTab("overview");
                          }}
                          className="p-3 border border-[#E5E7EB] rounded-xl hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#0F172A] text-xs truncate max-w-[150px]">{item.resumeName}</h4>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Score: {item.atsScore}% • {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    {history.filter(r => r.id !== activeReport.id).length === 0 && (
                      <div className="text-[11px] text-slate-400 italic text-center py-4">No other previous scans found.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ───── VIEW B: SCANNERS DRAFT SETUP VIEW ───── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
            
            {/* Left side: Upload & JD Details Setup Forms */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-[#0F172A] border-b pb-3 border-slate-100">Setup ATS Compatibility Scan</h2>
                
                {/* Resume Upload Box */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-[#0F172A] block">Upload Resume Copy</label>
                    <button
                      type="button"
                      onClick={() => {
                        const testContent = `
                        Alex Morgan
                        alex@example.com | 123-456-7890
                        Professional Summary
                        Experienced Senior React Developer with 6+ years of building web applications.
                        Skills
                        React, Node.js, TypeScript, Next.js, Tailwind CSS, PostgreSQL, AWS, Git, Docker, CI/CD, Agile.
                        Experience
                        Senior Software Engineer - Tech Corp (2020 - Present)
                        - Developed key frontend features using React and TypeScript.
                        - Managed AWS deployments and Docker containers.
                        Education
                        Bachelor of Science in Computer Science - University of State (2016 - 2020)
                        `;
                        const mockFile = new File([testContent], "test_resume.docx", {
                          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        });
                        setFile(mockFile);
                        toast("Loaded test resume copy!", "success");
                      }}
                      className="text-[10px] font-bold text-[#10B981] hover:underline cursor-pointer"
                      id="load-test-resume-btn"
                    >
                      Load Test Resume
                    </button>
                  </div>
                  
                  {file ? (
                    <div className="p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#0F172A] break-all max-w-[200px] sm:max-w-xs">{file.name}</h4>
                          <p className="text-[10px] text-[#64748B] mt-0.5">{formatBytes(file.size)} • Ready for analysis</p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearFile}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
                        isDragActive
                          ? "border-emerald-500 bg-emerald-50/40"
                          : "border-[#E5E7EB] bg-slate-50 hover:bg-slate-100/60 hover:border-slate-300"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-slate-400 mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{isDragActive ? "Drop the resume here" : "Drag and drop resume copy"}</h4>
                      <p className="text-[10px] text-[#64748B] mt-1 font-semibold">Or click to search folder directories. Only PDF or DOCX up to 5MB.</p>
                    </div>
                  )}
                </div>

                {/* Job Description Textarea */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-[#0F172A] block">Target Job Description</label>
                    <div className="flex items-center gap-2">
                      {draftSaved && <span className="text-[9px] text-slate-400 animate-pulse">Draft saved</span>}
                      <span className={`text-[10px] font-bold ${jobDescription.trim().length >= 200 ? "text-emerald-600" : "text-slate-400"}`}>
                        {jobDescription.trim().length} characters (min 200)
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => handleJdChange(e.target.value)}
                    placeholder="Paste the job description or target role requirements directly from the clipboard..."
                    className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all h-60 resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !file || jobDescription.trim().length < 200}
                  className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Processing files and running ATS analysis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                      Run ATS Compatibility Scan
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right side: Historical scan history (col 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold text-[#0F172A] border-b pb-3 border-slate-100 flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-slate-400" />
                  ATS Reports History
                </h3>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by resume name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                {/* History List */}
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto no-scrollbar pt-1">
                  {isLoadingHistory ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
                      ))}
                    </div>
                  ) : history.length > 0 ? (
                    history.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveReport(item);
                          setActiveTab("overview");
                        }}
                        className="p-3 border border-[#E5E7EB] rounded-xl hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 relative group"
                      >
                        <div className="min-w-0 pr-6">
                          <h4 className="font-extrabold text-[#0F172A] text-xs truncate max-w-[170px] sm:max-w-[200px]">{item.resumeName}</h4>
                          <p className="text-[10px] text-[#64748B] mt-1 font-semibold flex items-center gap-1.5">
                            <span className="text-emerald-600 font-extrabold">{item.atsScore}% Score</span>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleDeleteReport(item.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-all cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic text-center py-8">
                      No previous ATS scan records found. Set up your first analysis above!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
