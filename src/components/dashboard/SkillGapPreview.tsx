"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, AlertTriangle, Lightbulb } from "lucide-react";

interface SkillGapPreviewProps {
  missingKeywords: string[];
  atsScore: number | null;
}

export default function SkillGapPreview({ missingKeywords, atsScore }: SkillGapPreviewProps) {
  if (!atsScore || missingKeywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-[16px] bg-[#111827]">
        <div className="w-12 h-12 bg-[#14B8A6]15 text-[#14B8A6] rounded-full flex items-center justify-center mb-3">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h4 className="text-[15px] font-semibold text-[#F9FAFB] mb-1">No Analysis Yet</h4>
        <p className="text-[13px] text-[#9CA3AF] max-w-[200px] mb-4">
          Complete an ATS analysis to identify missing skills.
        </p>
        <Link href="/skill-gap" className="text-xs font-bold text-white bg-[#14B8A6] hover:bg-[#0d9488] px-4 py-2 rounded-xl transition-colors">
          Go to Skill Gap
        </Link>
      </div>
    );
  }

  const skills = missingKeywords.slice(0, 4).map((kw, i) => ({
    name: kw,
    priority: i < 2 ? "High" : "Medium",
    recommendation: `Consider taking a short course on ${kw}`
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div key={i} className="p-3 bg-[#111827] border border-[rgba(255,255,255,0.05)] rounded-[12px] flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-[14px] font-semibold text-[#F9FAFB]">{skill.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                skill.priority === "High" 
                  ? "bg-rose-500 bg-opacity-15 text-rose-400" 
                  : "bg-amber-500 bg-opacity-15 text-amber-400"
              }`}>
                {skill.priority} Priority
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-[12px] text-[#9CA3AF]">
              <Lightbulb className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
              <span>{skill.recommendation}</span>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/skill-gap"
        className="w-full flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] text-[#F9FAFB] font-semibold py-2.5 rounded-xl text-sm transition-all"
      >
        View Full Analysis <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
