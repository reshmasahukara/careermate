"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowRight, 
  Target, 
  BarChart2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Briefcase, 
  Award, 
  Download, 
  RefreshCw, 
  MapPin, 
  Layers, 
  Zap, 
  Trash2,
  Calendar,
  Building2,
  PieChart
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { useToast } from "@/components/Providers";
import { 
  getUserCareerInsightsAction, 
  addCareerGoalAction, 
  toggleCareerGoalAction, 
  deleteCareerGoalAction 
} from "@/app/actions/insights";

export default function CareerInsightsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "demo-user-123";
  const { toast } = useToast();

  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Time filter state (7, 30, 90 days)
  const [timeFilter, setTimeFilter] = useState("90");

  // Selected chart tab
  const [chartTab, setChartTab] = useState<"ats" | "skills" | "roadmap" | "jobs">("ats");

  // Goals Form States
  const [goalRole, setGoalRole] = useState("");
  const [goalCompany, setGoalCompany] = useState("");
  const [goalSalary, setGoalSalary] = useState("");
  const [goalTimeline, setGoalTimeline] = useState("");
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (userId) {
      loadInsights();
    }
  }, [userId]);

  const loadInsights = async () => {
    setIsRefreshing(true);
    try {
      const data = await getUserCareerInsightsAction(userId);
      setInsights(data);
      if (data?.targetRole) {
        setGoalRole(data.targetRole);
      }
    } catch (e) {
      console.error(e);
      toast("Failed to load insights data.", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalRole.trim()) {
      toast("Please enter a target role.", "error");
      return;
    }
    setIsSubmittingGoal(true);
    try {
      const res = await addCareerGoalAction(userId, {
        targetRole: goalRole.trim(),
        targetCompany: goalCompany.trim() || undefined,
        targetSalary: goalSalary ? Number(goalSalary) : undefined,
        targetTimeline: goalTimeline || undefined
      });

      if (res && res.success) {
        toast("Career Goal set successfully!", "success");
        setGoalCompany("");
        setGoalSalary("");
        setGoalTimeline("");
        loadInsights(); // reload metrics
      } else {
        toast("Failed to create career goal.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Error creating goal.", "error");
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleToggleGoal = async (goalId: string, completed: boolean) => {
    try {
      const success = await toggleCareerGoalAction(userId, goalId, completed);
      if (success) {
        toast(completed ? "Goal completed!" : "Goal marked incomplete", "success");
        loadInsights();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const success = await deleteCareerGoalAction(userId, goalId);
      if (success) {
        toast("Goal deleted.", "success");
        loadInsights();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = () => {
    toast("Generating report PDF...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Filter progress trends based on days selection
  const filteredAtsTrend = useMemo(() => {
    if (!insights?.atsTrend) return [];
    const cutoff = Date.now() - (Number(timeFilter) * 24 * 60 * 60 * 1000);
    return insights.atsTrend.filter((point: any) => point.timestamp >= cutoff);
  }, [insights?.atsTrend, timeFilter]);

  const goalsProgressPercent = useMemo(() => {
    if (!insights?.goals || insights.goals.length === 0) return 0;
    const completed = insights.goals.filter((g: any) => g.completed).length;
    return Math.round((completed / insights.goals.length) * 100);
  }, [insights?.goals]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse p-6">
          <div className="flex justify-between items-center">
            <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 bg-slate-100 rounded-2xl"></div>
            <div className="lg:col-span-4 h-96 bg-slate-100 rounded-2xl"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle New User Experience (No Analysis Data)
  const isNewUser = !insights || !insights.hasData;

  return (
    <DashboardLayout>
      <div className="max-w-[1450px] mx-auto space-y-6 pb-20 print:p-0 print:space-y-4">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 print:border-none print:pb-0">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Career Insights</h1>
            <p className="text-sm text-[#64748B] font-semibold mt-1">
              Track your progress, understand market demand, and make informed career decisions.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 print:hidden">
            <button
              onClick={loadInsights}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Insights
            </button>
            {!isNewUser && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Report
              </button>
            )}
          </div>
        </div>

        {isNewUser ? (
          /* NEW USER EMPTY STATE */
          <div className="bg-white border border-slate-200 rounded-[24px] min-h-[460px] flex flex-col items-center justify-center p-8 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl -z-10" />

            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Sparkles className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-3">
              Unlock Your Career Insights
            </h2>
            <p className="text-slate-500 text-sm max-w-md mb-8 font-semibold leading-relaxed">
              Upload your resume and complete a skill analysis to receive personalized career intelligence, salary benchmarks, and demand insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/resume-upload"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all"
              >
                Upload Resume
              </Link>
              <Link
                href="/skill-gap"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl border border-slate-200 transition-all"
              >
                Analyze Skills
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE USER DASHBOARD ROUTINES */
          <>
            {/* TOP OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Readiness Index */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Career Readiness</p>
                  <h3 className="text-2xl font-black text-slate-800">{insights.stats.careerReadinessScore}%</h3>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded
                    ${insights.stats.readinessLevel === "Job Ready" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                      insights.stats.readinessLevel === "Intermediate" ? "bg-blue-50 text-blue-700 border border-blue-100" : 
                      "bg-amber-50 text-amber-700 border border-amber-100"}`}
                  >
                    {insights.stats.readinessLevel}
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              {/* ATS Improvement Trend */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ATS Trend</p>
                  <h3 className="text-2xl font-black text-slate-800">{insights.stats.atsImprovementTrend.split(" ")[0]}</h3>
                  <div className="flex items-center gap-1">
                    {insights.stats.trendIndicator === "up" ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    ) : insights.stats.trendIndicator === "down" ? (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                    <span className="text-[10px] font-bold text-slate-500">{insights.stats.atsImprovementTrend}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Skills Match */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Skills Match Score</p>
                  <h3 className="text-2xl font-black text-slate-800">{insights.stats.skillsMatchScore}%</h3>
                  <p className="text-[10px] font-bold text-slate-500">Based on target role criteria</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              {/* Job Opportunities */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Job Matches Available</p>
                  <h3 className="text-2xl font-black text-slate-800">{insights.stats.jobOpportunitiesAvailable}</h3>
                  <p className="text-[10px] font-bold text-slate-500">Active positions in market</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD PANEL GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Progress & Market Analysis (col-span-8) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* SECTION 2: Progress Over Time */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-black text-[#0F172A] tracking-tight">Progress Analytics</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Visualize your metric updates over time.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Interactive Tab Selectors */}
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                        <button 
                          onClick={() => setChartTab("ats")}
                          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartTab === "ats" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                        >
                          ATS
                        </button>
                        <button 
                          onClick={() => setChartTab("skills")}
                          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartTab === "skills" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                        >
                          Skills
                        </button>
                        <button 
                          onClick={() => setChartTab("roadmap")}
                          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartTab === "roadmap" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                        >
                          Roadmap
                        </button>
                        <button 
                          onClick={() => setChartTab("jobs")}
                          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${chartTab === "jobs" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                        >
                          Applications
                        </button>
                      </div>

                      {/* Time Frame filter */}
                      <select
                        value={timeFilter}
                        onChange={e => setTimeFilter(e.target.value)}
                        className="bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 outline-none"
                      >
                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Recharts Component block */}
                  <div className="h-64 w-full">
                    {isMounted ? (
                      chartTab === "ats" ? (
                        filteredAtsTrend.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
                            No ATS scan trend data recorded yet.
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredAtsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                              <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                              <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )
                      ) : chartTab === "skills" ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={insights.skillsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : chartTab === "roadmap" ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={insights.roadmapTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                            <Area type="monotone" dataKey="completion" stroke="#8B5CF6" fill="rgba(139, 92, 246, 0.05)" strokeWidth={2.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        insights.applicationsTrend.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
                            No job search activity recorded.
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={insights.applicationsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )
                      )
                    ) : (
                      <div className="h-full bg-slate-50 rounded-xl" />
                    )}
                  </div>
                </div>

                {/* SECTION 3: Market Demand Analysis */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A] tracking-tight">Market Demand Analysis</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Understand core technologies requested for "{insights.targetRole}".</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Skills You Have */}
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Skills You Have ({insights.skillsDemandComparison.strongMatch.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {insights.skillsDemandComparison.strongMatch.map((s: string) => (
                          <span key={s} className="bg-white border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                            {s}
                          </span>
                        ))}
                        {insights.skillsDemandComparison.strongMatch.length === 0 && (
                          <span className="text-xs text-slate-500 italic">None recorded. Add skills in skill-gap manager.</span>
                        )}
                      </div>
                    </div>

                    {/* Skills You Need to Learn */}
                    <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Skills to Acquire ({insights.skillsDemandComparison.missingSkills.length + insights.skillsDemandComparison.needsImprovement.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {[...insights.skillsDemandComparison.missingSkills, ...insights.skillsDemandComparison.needsImprovement].map((s: string) => (
                          <span key={s} className="bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                            {s}
                          </span>
                        ))}
                        {insights.skillsDemandComparison.missingSkills.length === 0 && insights.skillsDemandComparison.needsImprovement.length === 0 && (
                          <span className="text-xs text-emerald-700 italic font-bold">You match all standard technology requirements!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Salary Insights */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#0F172A] tracking-tight">Salary Benchmarks</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Based on location and experience metrics for "{insights.targetRole}".</p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      USD / Year
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Entry Level */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between min-h-[110px]">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Entry Level</p>
                      <h4 className="text-xl font-black text-slate-700 pt-2">
                        ${insights.salaryInsights.entryLevel.min.toLocaleString()} - ${insights.salaryInsights.entryLevel.max.toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">0 - 2 years experience</p>
                    </div>

                    {/* Mid Level */}
                    <div className="bg-emerald-50/20 rounded-2xl p-4 border border-emerald-100/50 flex flex-col justify-between min-h-[110px]">
                      <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Mid Level</p>
                      <h4 className="text-xl font-black text-emerald-800 pt-2">
                        ${insights.salaryInsights.midLevel.min.toLocaleString()} - ${insights.salaryInsights.midLevel.max.toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-emerald-600/80 font-bold">2 - 5 years experience</p>
                    </div>

                    {/* Senior Level */}
                    <div className="bg-purple-50/20 rounded-2xl p-4 border border-purple-100/50 flex flex-col justify-between min-h-[110px]">
                      <p className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">Senior Level</p>
                      <h4 className="text-xl font-black text-purple-800 pt-2">
                        ${insights.salaryInsights.seniorLevel.min.toLocaleString()} - ${insights.salaryInsights.seniorLevel.max.toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-purple-600/80 font-bold">5+ years experience</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold">
                    <p className="text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{insights.salaryInsights.growthPotential}</span>
                    </p>
                    
                    <div className="flex gap-4">
                      {insights.salaryInsights.regionalComparisons.map((item: any) => (
                        <div key={item.region} className="text-right">
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">{item.region}</span>
                          <span className="text-slate-700 font-bold">${item.avg.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 7: Skills Demand Comparison */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A] tracking-tight">Skills Demand Comparison</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Categorization of your skill matches in comparison with market demand profiles.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Strong Match */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Strong Match</span>
                        <span>{insights.skillsDemandComparison.strongMatch.length} Skills</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (insights.skillsDemandComparison.strongMatch.length / 10) * 100)}%` }} />
                      </div>
                    </div>

                    {/* Needs Improvement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1 text-amber-700"><Zap className="w-3.5 h-3.5 text-amber-500" /> Needs Improvement</span>
                        <span>{insights.skillsDemandComparison.needsImprovement.length} Skills</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                        <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (insights.skillsDemandComparison.needsImprovement.length / 10) * 100)}%` }} />
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1 text-rose-700"><AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Missing Skills</span>
                        <span>{insights.skillsDemandComparison.missingSkills.length} Skills</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                        <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (insights.skillsDemandComparison.missingSkills.length / 10) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Goals, Overview & Action Recommendations (col-span-4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* SECTION 8: Personalized Recommendations Panel */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {insights.recommendations.map((rec: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border flex gap-3 items-start relative overflow-hidden
                          ${rec.impact === "High" ? "bg-rose-50/30 border-rose-100 text-slate-700" : 
                            rec.impact === "Medium" ? "bg-amber-50/20 border-amber-100 text-slate-700" : 
                            "bg-slate-50/50 border-slate-200 text-slate-600"}`}
                      >
                        <div className="mt-0.5">
                          {rec.impact === "High" ? (
                            <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                          ) : (
                            <Zap className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{rec.category}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1 rounded
                              ${rec.impact === "High" ? "bg-rose-100 text-rose-700" : 
                                rec.impact === "Medium" ? "bg-amber-100 text-amber-700" : 
                                "bg-slate-200 text-slate-600"}`}
                            >
                              {rec.impact}
                            </span>
                          </div>
                          <p className="text-xs font-semibold leading-relaxed">{rec.text}</p>
                        </div>
                      </div>
                    ))}
                    {insights.recommendations.length === 0 && (
                      <p className="text-xs text-slate-500 font-semibold italic text-center py-4">No suggestions. Your profile is in perfect shape!</p>
                    )}
                  </div>
                </div>

                {/* SECTION 9: Career Goals Tracker */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Target className="w-4.5 h-4.5 text-emerald-500" /> Career Goals Tracker
                  </h3>

                  {/* Goal Progress bar */}
                  {insights.goals.length > 0 && (
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Milestones Progress</span>
                        <span className="text-emerald-700">{goalsProgressPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${goalsProgressPercent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Active Goals checklist */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {insights.goals.map((g: any) => (
                      <div 
                        key={g.id} 
                        className="flex items-center justify-between gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50/30 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <button 
                            onClick={() => handleToggleGoal(g.id, !g.completed)}
                            className="focus:outline-none"
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              g.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {g.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                          
                          <div className="overflow-hidden">
                            <p className={`text-xs font-bold truncate ${g.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                              {g.targetRole}
                            </p>
                            {g.targetCompany && (
                              <p className={`text-[10px] font-semibold flex items-center gap-1 ${g.completed ? "text-slate-300" : "text-slate-500"}`}>
                                <Building2 className="w-3 h-3" /> {g.targetCompany}
                              </p>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteGoal(g.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {insights.goals.length === 0 && (
                      <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center">
                        <p className="text-xs text-slate-400 font-semibold">No career goals set yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Create Goal Form */}
                  <form onSubmit={handleCreateGoal} className="border-t border-slate-100 pt-4 space-y-2.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Set New Goal</p>
                    
                    <input 
                      type="text" 
                      placeholder="Target Role (e.g. Lead Dev)"
                      value={goalRole}
                      onChange={e => setGoalRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Target Company"
                        value={goalCompany}
                        onChange={e => setGoalCompany(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      />
                      <input 
                        type="number" 
                        placeholder="Target Salary ($)"
                        value={goalSalary}
                        onChange={e => setGoalSalary(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <input 
                      type="text" 
                      placeholder="Target Timeline (e.g. 6 Months)"
                      value={goalTimeline}
                      onChange={e => setGoalTimeline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />

                    <button 
                      type="submit" 
                      disabled={isSubmittingGoal}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" /> Set Goal
                    </button>
                  </form>
                </div>

                {/* SECTION 6: Job Market Overview */}
                <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-500" /> Job Market Overview
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Total Matches</span>
                      <p className="text-lg font-black text-slate-800 mt-1">{insights.jobMarketOverview.totalMatchingJobs}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Remote Options</span>
                      <p className="text-lg font-black text-emerald-700 mt-1">{insights.jobMarketOverview.remoteOpportunities}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Hybrid Roles</span>
                      <p className="text-lg font-black text-slate-800 mt-1">{insights.jobMarketOverview.hybridRoles}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Entry Level</span>
                      <p className="text-lg font-black text-slate-800 mt-1">{insights.jobMarketOverview.entryLevelPositions}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </>
        )}
      </div>
    </DashboardLayout>
  );
}
