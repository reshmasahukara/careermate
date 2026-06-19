"use client";

import React from "react";
import Link from "next/link";
import { FileText, Tag, AlertCircle, Clock, RefreshCw } from "lucide-react";

interface ResumeInsightsProps {
  latestResume: any;
  ats: {
    keywordsFound: string[];
    keywordsMissing: string[];
    latestTargetRole: string | null;
  };
}

export default function ResumeInsights({ latestResume, ats }: ResumeInsightsProps) {
  if (!latestResume) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <FileText className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-[#111827] mb-1">No resume analyzed</p>
        <p className="text-xs text-[#64748B] mb-4">Upload a resume and run an ATS scan to see insights here.</p>
        <Link href="/resume-upload" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
          Upload Resume →
        </Link>
      </div>
    );
  }

  const keywordsFound = ats.keywordsFound ?? [];
  const keywordsMissing = ats.keywordsMissing ?? [];
  const matchRate = keywordsFound.length + keywordsMissing.length > 0
    ? Math.round((keywordsFound.length / (keywordsFound.length + keywordsMissing.length)) * 100)
    : null;

  const stats = [
    {
      icon: <Tag className="w-4 h-4 text-emerald-500" />,
      label: "Keywords Matched",
      value: keywordsFound.length > 0 ? `${keywordsFound.length} keywords` : "—",
      sub: keywordsFound.slice(0, 3).join(", ") || "Run ATS scan to see",
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      label: "Missing Keywords",
      value: keywordsMissing.length > 0 ? `${keywordsMissing.length} gaps` : "—",
      sub: keywordsMissing.slice(0, 3).join(", ") || "All matched!",
    },
    {
      icon: <FileText className="w-4 h-4 text-slate-400" />,
      label: "Resume File",
      value: latestResume.fileName,
      sub: latestResume.fileType?.toUpperCase() ?? "Document",
    },
    {
      icon: <Clock className="w-4 h-4 text-slate-400" />,
      label: "Last Updated",
      value: new Date(latestResume.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sub: `Version ${latestResume.version}`,
    },
  ];

  return (
    <div className="space-y-4">
      {matchRate !== null && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="text-3xl font-extrabold text-emerald-600">{matchRate}%</div>
          <div>
            <p className="text-sm font-bold text-[#111827]">Keyword Match Rate</p>
            <p className="text-xs text-[#64748B]">
              vs. {ats.latestTargetRole ?? "target role"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl">
            <div className="shrink-0 mt-0.5">{s.icon}</div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-sm font-bold text-[#111827] truncate mt-0.5">{s.value}</p>
              <p className="text-xs text-[#64748B] truncate">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/ats-checker"
        className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm"
      >
        <RefreshCw className="w-4 h-4" /> Re-analyze Resume
      </Link>
    </div>
  );
}
