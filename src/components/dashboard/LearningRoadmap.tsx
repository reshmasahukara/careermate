"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

interface LearningRoadmapProps {
  careerPath: any;
}

export default function LearningRoadmap({ careerPath }: LearningRoadmapProps) {
  if (!careerPath) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-[#111827] mb-1">No roadmap yet</p>
        <p className="text-xs text-[#64748B] mb-4">Set a target role to generate your personalized learning roadmap.</p>
        <Link
          href="/roadmap"
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Create Roadmap <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  let roadmapData: any[] = [];
  try {
    roadmapData = JSON.parse(careerPath.roadmapData || "[]");
  } catch {}

  const total = roadmapData.length;
  const completed = roadmapData.filter((m: any) => m.status === "completed").length;
  const inProgress = roadmapData.find((m: any) => m.status === "in-progress");
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;
  const estWeeks = Math.max(1, remaining * 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
          {progress}%
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827] truncate">{careerPath.targetRole}</p>
          <p className="text-xs text-[#64748B]">{completed}/{total} milestones completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {inProgress && (
        <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl">
          <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-bold mb-0.5">Current Milestone</p>
          <p className="text-sm font-bold text-[#111827]">{inProgress.title}</p>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Clock className="w-3.5 h-3.5" />
        <span>Est. {estWeeks} weeks to complete</span>
      </div>

      <Link
        href="/roadmap"
        className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm"
      >
        Continue Learning <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
