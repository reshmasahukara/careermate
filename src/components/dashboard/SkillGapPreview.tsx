"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight, BarChart2 } from "lucide-react";

interface SkillGapPreviewProps {
  missingKeywords: string[];
  atsScore: number | null;
}

export default function SkillGapPreview({ missingKeywords, atsScore }: SkillGapPreviewProps) {
  const skills = missingKeywords.slice(0, 5).map((kw, i) => ({
    name: kw,
    level: Math.max(10, 50 - i * 8), // Provide a relative strength visual purely based on the real missing keyword
  }));

  if (!atsScore || missingKeywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
          <BarChart2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">No Analysis Yet</h4>
        <p className="text-xs text-slate-500 max-w-[200px] mb-4">
          Complete an ATS analysis to identify missing skills.
        </p>
        <Link href="/skill-gap" className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-4 py-2 rounded-lg transition-colors">
          Go to Skill Gap
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-[#111827]">{skill.name}</span>
              <span className="text-xs font-bold text-[#64748B]">Missing</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: skill.level > 35 ? "#10B981" : skill.level > 20 ? "#F59E0B" : "#EF4444",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/skill-gap"
        className="w-full flex items-center justify-center gap-2 bg-[#F7F8FA] hover:bg-slate-100 border border-[#E5E7EB] text-[#111827] font-bold py-2.5 rounded-xl text-sm transition-all"
      >
        View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
