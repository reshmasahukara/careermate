"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Target,
  BarChart2,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Briefcase,
  Award
} from "lucide-react";

export default function CareerInsightsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interactive Goals
  const [goals, setGoals] = useState<{id: number; text: string; completed: boolean}[]>([]);
  const [newGoalText, setNewGoalText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const userId = (session?.user as any)?.id || "demo-user-123";
      try {
        const { getDashboardDataAction } = await import("@/app/actions/dashboard");
        const dashboardData = await getDashboardDataAction(userId);
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (session) loadData();
  }, [session]);

  const handleToggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals(prev => [...prev, { id: Date.now(), text: newGoalText.trim(), completed: false }]);
    setNewGoalText("");
  };

  const completedGoalsCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse p-6">
          <div className="h-10 bg-slate-100 rounded-xl w-1/3"></div>
          <div className="h-64 bg-slate-100 rounded-2xl w-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  const targetRole = data?.ats?.latestTargetRole || data?.careerPath?.targetRole || null;
  const careerReadiness = data?.careerReadiness || 0;

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Career Insights</h1>
          <p className="text-sm text-[#64748B]">Real-time salary guides, industry trend reports, and personal goal logs.</p>
        </div>

        {/* Configurations Row */}
        <div className="bg-white p-5 border border-[#E5E7EB] rounded-[20px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Target Role:</span>
            <span className="text-sm font-extrabold text-[#0F172A]">{targetRole || "Not Set"}</span>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Salary & Trends (col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {!targetRole ? (
              <div className="bg-white border border-dashed border-slate-300 p-12 rounded-[20px] shadow-sm text-center flex flex-col items-center">
                <BarChart2 className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Your insights will appear after your first analysis</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Complete an ATS analysis or Skill Gap check to unlock personalized salary benchmarks and market trends.</p>
                <a href="/ats-checker" className="bg-[#10B981] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#059669]">Run Scan Now</a>
              </div>
            ) : (
              <>
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-6">
                  <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Salary Benchmark Insights
                  </h2>
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-600">Salary data for "{targetRole}" is currently being calculated.</p>
                    <p className="text-xs text-slate-400 mt-2">Check back later for updated market rates.</p>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5">
                  <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Market Trends & In-Demand Skills
                  </h2>
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-600">Market trends for "{targetRole}" are currently being compiled.</p>
                    <p className="text-xs text-slate-400 mt-2">Check back later for updated industry demands.</p>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right panel: Goals & Readiness (col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Readiness Index */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4.5 h-4.5 text-emerald-500" />
                Readiness Index
              </h2>

              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="56" className="text-slate-100" strokeWidth="12" fill="none" stroke="currentColor" />
                  <circle cx="72" cy="72" r="56" className="text-emerald-500" strokeWidth="12" fill="none" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * careerReadiness) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">{careerReadiness}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Index rating</span>
                </div>
              </div>

              {careerReadiness === 0 && (
                <p className="text-xs text-center text-slate-500 font-semibold mt-4">Complete your profile to increase your readiness score.</p>
              )}
            </div>

            {/* Goal Tracking */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-emerald-500" />
                Goal Tracking
              </h2>

              {goals.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-3">No active goals. Add one below!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#64748B]">
                      <span>Progress</span>
                      <span className="text-emerald-600">{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {goals.map(g => (
                      <div
                        key={g.id}
                        onClick={() => handleToggleGoal(g.id)}
                        className="flex items-center gap-3 p-2.5 border border-[#E5E7EB] rounded-xl hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50"
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          g.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                        }`}>
                          {g.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-semibold leading-tight ${
                          g.completed ? "text-slate-400 line-through" : "text-slate-700"
                        }`}>
                          {g.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Add form */}
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  placeholder="Define a new goal..."
                  className="flex-1 bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
