"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getCareerPathAction, generateRoadmapAction } from "@/app/actions/skills";

export default function LearningRoadmapPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [careerPath, setCareerPath] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadRoadmap();
    }
  }, [session]);

  const loadRoadmap = async () => {
    setIsLoading(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const path = await getCareerPathAction(userId);
      setCareerPath(path);
      if (path) {
        setMilestones(JSON.parse(path.roadmapData));
      }
    } catch (e) {
      console.error("Error loading career path:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomPath = async () => {
    if (!session?.user) {
      toast("Please log in to generate a career learning path.", "warning");
      return;
    }

    setIsGenerating(true);
    try {
      const userId = (session.user as any).id || "demo-user-123";
      const newPath = await generateRoadmapAction(userId, targetRole);
      setCareerPath(newPath);
      setMilestones(JSON.parse(newPath.roadmapData));
      toast("Milestone timeline updated successfully!", "success");
    } catch (err) {
      toast("Failed to construct roadmap.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMilestoneStatus = (weekNum: number) => {
    const updated = milestones.map((m) => {
      if (m.week === weekNum) {
        const nextStatus = m.status === "completed" ? "pending" : "completed";
        return { ...m, status: nextStatus };
      }
      return m;
    });

    setMilestones(updated);
    
    // Optimistic progress feedback toast
    const changingItem = milestones.find((m) => m.week === weekNum);
    const wasCompleted = changingItem?.status === "completed";
    toast(
      wasCompleted
        ? `Milestone Week ${weekNum} marked incomplete.`
        : `Congratulations on finishing Week ${weekNum} target!`,
      wasCompleted ? "info" : "success"
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate overall path completion percentage
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const renderContent = (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Learning Roadmap</h1>
        <p className="text-[#64748B] text-xs font-semibold mt-1">Track structured weekly targets and reference courses for your target career role.</p>
      </div>

      {careerPath ? (
        <div className="space-y-6">
          
          {/* Overview dashboard status */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Roadmap to {careerPath.targetRole}
                </h2>
                <span className="bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Timeline Active
                </span>
              </div>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed font-semibold">
                {careerPath.description}
              </p>
              
              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex justify-between text-xs font-bold text-[#64748B]">
                  <span>Overall Progress</span>
                  <span className="text-[#2563EB]">{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#F8FAFC] border border-[#E2E8F0]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Generate new roadmap toggle */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-2 px-3 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-colors"
              >
                <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI Product Designer">AI Product Designer</option>
              </select>
              <button
                onClick={handleGenerateCustomPath}
                disabled={isGenerating}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-[12px] text-xs flex items-center justify-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                Re-generate Path
              </button>
            </div>
          </div>

          {/* Vertical timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            
            {milestones.map((m) => {
              const isDone = m.status === "completed";
              const isCurrent = m.status === "in-progress";
              
              return (
                <div key={m.week} className="relative space-y-3">
                  
                  {/* Circle Node */}
                  <div
                    onClick={() => toggleMilestoneStatus(m.week)}
                    className={`absolute -left-6 sm:-left-8 w-6.5 h-6.5 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300 z-10 ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600"
                        : isCurrent
                        ? "bg-white border-[#2563EB] text-[#2563EB]"
                        : "bg-white border-[#E2E8F0] text-[#64748B]"
                    }`}
                    style={{ transform: "translateX(-25%)" }}
                    title={isDone ? "Mark Pending" : "Mark Completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 fill-white text-emerald-500" />
                    ) : (
                      <span className="text-[10px] font-bold">{m.week}</span>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div className={`bg-white border p-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200 ${
                    isDone
                      ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                      : isCurrent
                      ? "border-[#2563EB] bg-[#2563EB]/[0.01]"
                      : "border-[#E2E8F0]"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                          Week {m.week} Focus
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isDone
                            ? "bg-emerald-50 text-emerald-600"
                            : isCurrent
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-100 text-[#64748B]"
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleMilestoneStatus(m.week)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-[8px] border transition-all cursor-pointer ${
                          isDone
                            ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100"
                            : "bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8] shadow-sm"
                        }`}
                      >
                        {isDone ? "Mark Incomplete" : "Mark Finished"}
                      </button>
                    </div>

                    <h3 className="font-extrabold text-base text-[#0F172A] leading-tight mb-2">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-semibold">
                      {m.description}
                    </p>

                    {/* Associated Course recommendation */}
                    <div className="mt-5 p-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[9px] font-extrabold text-[#4F46E5] uppercase tracking-widest">Suggested Resource</div>
                        <h4 className="font-bold text-xs text-[#0F172A] leading-normal">{m.week === 1 ? "Next.js Complete Developer Course" : m.week === 2 ? "TypeScript deep architectures" : m.week === 3 ? "Web Performance in React" : "Framer Motion animations"}</h4>
                        <p className="text-[10px] text-[#64748B] font-semibold">Udemy • 4.8 Rating • 12h duration</p>
                      </div>
                      <a
                        href="https://www.udemy.com"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-[#F8FAFC] p-2.5 rounded-[12px] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] shadow-inner flex items-center justify-center shrink-0"
                        title="Open course"
                      >
                        <BookOpen className="w-4 h-4" />
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center text-[#2563EB]">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-[#0F172A] text-base">Generate a career learning path</h3>
            <p className="text-[#64748B] text-xs font-semibold">Specify your target profession below to compile custom week-by-week goals and learning material recommendations.</p>
          </div>
          
          <div className="flex flex-col gap-2.5 max-w-xs w-full pt-4">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-2 px-3 text-xs font-semibold text-[#0F172A] focus:outline-none"
            >
              <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="AI Product Designer">AI Product Designer</option>
            </select>
            
            <button
              onClick={handleGenerateCustomPath}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2.5 rounded-[12px] text-xs shadow-sm"
            >
              Generate Roadmap
            </button>
          </div>
        </div>
      )}

    </div>
  );

  if (session) {
    return <DashboardLayout>{renderContent}</DashboardLayout>;
  }

  return (
    <div className="flex-1 bg-brand-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent}
      </div>
    </div>
  );
}
