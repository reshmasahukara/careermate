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
      <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-[16px] bg-[#111827]">
        <div className="w-12 h-12 bg-[#1F2937] rounded-full flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-[#64748B]" />
        </div>
        <p className="text-[15px] font-semibold text-[#F9FAFB] mb-1">No roadmap yet</p>
        <p className="text-[13px] text-[#9CA3AF] mb-4">Complete your profile to generate a roadmap</p>
        <Link
          href="/career-pathways"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14B8A6] hover:text-[#0d9488] transition-colors"
        >
          Go to Pathways <ArrowRight className="w-3.5 h-3.5" />
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
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 bg-[#111827] border border-[rgba(255,255,255,0.05)] rounded-[12px]">
        <div className="w-12 h-12 rounded-full bg-[#14B8A6] flex items-center justify-center text-white font-bold text-[15px] shrink-0">
          {progress}%
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#F9FAFB] truncate">{careerPath.targetRole}</p>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">{completed}/{total} milestones completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="w-full bg-[#111827] border border-[rgba(255,255,255,0.05)] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#14B8A6] h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {inProgress && (
        <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-[12px]">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-bold mb-1">Current Milestone</p>
          <p className="text-[14px] font-semibold text-[#F9FAFB]">{inProgress.title}</p>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF]">
        <Clock className="w-4 h-4" />
        <span>Est. {estWeeks} weeks to complete</span>
      </div>

      <Link
        href="/career-pathways"
        className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488] text-white font-semibold py-2.5 rounded-xl text-[14px] transition-all shadow-sm"
      >
        Continue Learning <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
