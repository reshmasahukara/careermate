"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface ProfileCompletionProps {
  progress: number;
  stats: {
    resumes: number;
    skills: number;
    paths: number;
    atsChecks: number;
  };
}

export default function ProfileCompletion({ progress, stats }: ProfileCompletionProps) {
  const checklist = [
    { label: "Upload resume", done: stats.resumes > 0, href: "/resume-upload" },
    { label: "Add 5+ skills", done: stats.skills >= 5, href: "/skill-gap" },
    { label: "Set target role", done: stats.paths > 0, href: "/career-pathways" },
    { label: "Run ATS scan", done: stats.atsChecks > 0, href: "/ats-checker" },
    { label: "Complete profile", done: progress >= 80, href: "/settings" },
  ];

  const completedCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[#111827]">{completedCount}/{checklist.length} completed</span>
          <span className="text-sm font-extrabold text-emerald-600">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li key={i}>
            <Link
              href={item.done ? "#" : item.href}
              className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                item.done
                  ? "opacity-60 cursor-default"
                  : "hover:bg-[#F7F8FA] cursor-pointer"
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4.5 h-4.5 text-slate-300 shrink-0 group-hover:text-emerald-400 transition-colors" />
              )}
              <span
                className={`text-sm font-semibold flex-1 ${
                  item.done ? "text-[#64748B] line-through" : "text-[#111827]"
                }`}
              >
                {item.label}
              </span>
              {!item.done && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {progress < 100 && (
        <Link
          href="/settings"
          className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl text-sm transition-all border border-emerald-100"
        >
          Complete Profile →
        </Link>
      )}
    </div>
  );
}
