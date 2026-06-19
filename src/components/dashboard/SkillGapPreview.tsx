"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

interface SkillGapPreviewProps {
  missingKeywords: string[];
  atsScore: number | null;
}

const MOCK_SKILLS = [
  { name: "Docker", level: 40 },
  { name: "AWS", level: 35 },
  { name: "System Design", level: 25 },
  { name: "Kubernetes", level: 20 },
  { name: "GraphQL", level: 15 },
];

export default function SkillGapPreview({ missingKeywords, atsScore }: SkillGapPreviewProps) {
  const skills = missingKeywords.slice(0, 5).map((kw, i) => ({
    name: kw,
    level: Math.max(10, 50 - i * 8),
  }));

  const displaySkills = skills.length >= 3 ? skills : MOCK_SKILLS;
  const isMock = skills.length < 3;

  return (
    <div className="space-y-3">
      {isMock && (
        <div className="flex items-center gap-1.5 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-700 font-medium">
            Run an ATS scan to see your real skill gaps.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {displaySkills.map((skill, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-[#111827]">{skill.name}</span>
              <span className="text-xs font-bold text-[#64748B]">{skill.level}% match</span>
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
