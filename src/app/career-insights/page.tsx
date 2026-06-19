"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
import { useToast } from "@/components/Providers";

export default function CareerInsightsPage() {
  const { toast } = useToast();

  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  
  // Interactive Goals
  const [goals, setGoals] = useState([
    { id: 1, text: "Upload latest resume draft", completed: true },
    { id: 2, text: "Optimize ATS keyword match to 80%", completed: false },
    { id: 3, text: "Complete Next.js milestone module", completed: false },
    { id: 4, text: "Complete AI technical interview simulation", completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  const handleToggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    toast("Goal status updated!", "success");
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals(prev => [...prev, { id: Date.now(), text: newGoalText.trim(), completed: false }]);
    setNewGoalText("");
    toast("New goal added!", "success");
  };

  const completedGoalsCount = goals.filter(g => g.completed).length;
  const progressPercent = Math.round((completedGoalsCount / goals.length) * 100) || 0;

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
          <div className="flex-1 w-full">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Selected Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white mt-1.5"
            />
          </div>
          <div className="shrink-0 self-end text-xs font-bold text-slate-400">
            Analytics synced: just now
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Salary & Trends (col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Salary Insights */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-6">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Salary Benchmark Insights
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Low (10th Percentile)</span>
                  <p className="text-2xl font-black text-slate-700">$115,000</p>
                </div>
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Median / Average</span>
                  <p className="text-2xl font-black text-emerald-600">$142,000</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">High (90th Percentile)</span>
                  <p className="text-2xl font-black text-slate-700">$185,000</p>
                </div>
              </div>

              {/* Graphic bar chart simulated */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Entry Level Range</span>
                  <span>Senior Standard</span>
                  <span>Principal Target</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full border border-slate-200 overflow-hidden flex">
                  <div className="h-full bg-slate-300 w-[20%]" title="Junior" />
                  <div className="h-full bg-emerald-500 w-[60%] border-x border-white" title="Senior Standard" />
                  <div className="h-full bg-[#0f172a] w-[20%]" title="Principal Target" />
                </div>
              </div>
            </div>

            {/* Industry Trends */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Market Trends & In-Demand Skills
              </h2>

              <p className="text-xs text-[#64748B] leading-relaxed font-semibold">
                Based on recruitment volumes from open platforms, these skills represent the fastest growing trends for <span className="text-[#0F172A] font-bold">{targetRole}</span> roles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-[#E5E7EB] rounded-xl bg-slate-50 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#0F172A]">AI Tool Integration</span>
                    <span className="text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded text-[10px]">High Growth</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full" style={{ width: "92%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium">Prompt orchestration, OpenAI APIs, and AI interfaces account for 35% of current specifications.</p>
                </div>

                <div className="p-4 border border-[#E5E7EB] rounded-xl bg-slate-50 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#0F172A]">Server Component Rendering</span>
                    <span className="text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded text-[10px]">Trending</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full" style={{ width: "85%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium">Next.js App Router architectures and client/server component boundaries are standard expectations.</p>
                </div>
              </div>
            </div>

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
                  <circle cx="72" cy="72" r="56" className="text-emerald-500" strokeWidth="12" fill="none" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * 78) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">78%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Index rating</span>
                </div>
              </div>

              <div className="space-y-3.5 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between border-b pb-1.5">
                  <span>Resume Strength</span>
                  <span className="font-bold text-[#0F172A]">Good (75%)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Skills Matching</span>
                  <span className="font-bold text-[#0F172A]">Met (82%)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Mock Practice logs</span>
                  <span className="font-bold text-[#0F172A]">Low (40%)</span>
                </div>
              </div>
            </div>

            {/* Goal Tracking */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-emerald-500" />
                Goal Tracking logs
              </h2>

              {/* Progress visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#64748B]">
                  <span>Progress</span>
                  <span className="text-emerald-600">{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Goals list */}
              <div className="space-y-2.5">
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

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Bridge your skill gaps in the analysis lab</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Run comparative radar analyses on your profile and get custom modules recommended based on your target career keywords.
            </p>
          </div>
          <a
            href="/skill-gap"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Run Skill Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
