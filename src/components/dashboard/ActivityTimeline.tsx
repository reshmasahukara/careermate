"use client";

import React from "react";
import Link from "next/link";
import { FileText, FileCheck, PlusCircle, Briefcase, BookOpen, ArrowRight, Upload } from "lucide-react";

interface ActivityItem {
  type: string;
  label: string;
  detail: string;
  date: Date | string;
  href: string;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
}

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const iconMap: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  resume: { icon: <FileText className="w-4 h-4" />, bg: "bg-emerald-100", color: "text-emerald-600" },
  ats: { icon: <FileCheck className="w-4 h-4" />, bg: "bg-blue-100", color: "text-emerald-600" },
  skill: { icon: <PlusCircle className="w-4 h-4" />, bg: "bg-purple-100", color: "text-purple-600" },
  job: { icon: <Briefcase className="w-4 h-4" />, bg: "bg-amber-100", color: "text-amber-600" },
  learning: { icon: <BookOpen className="w-4 h-4" />, bg: "bg-rose-100", color: "text-rose-600" },
};

export default function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-[#111827] mb-1">No activity yet</p>
        <p className="text-xs text-[#64748B] mb-5 max-w-xs">
          Start by uploading your resume to unlock personalized career insights.
        </p>
        <Link
          href="/resume-upload"
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          <Upload className="w-4 h-4" /> Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const meta = iconMap[item.type] || iconMap["resume"];
        return (
          <Link
            key={i}
            href={item.href}
            className="group flex items-start gap-4 p-3.5 rounded-xl hover:bg-[#F7F8FA] transition-colors"
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center shrink-0 mt-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${meta.bg} ${meta.color}`}>
                {meta.icon}
              </div>
              {i < items.length - 1 && <div className="w-px h-6 bg-[#E5E7EB] mt-1" />}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#111827] truncate">{item.label}</p>
                <span className="text-[11px] text-[#64748B] shrink-0 font-medium">
                  {timeAgo(item.date)}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 truncate">{item.detail}</p>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
          </Link>
        );
      })}
    </div>
  );
}
