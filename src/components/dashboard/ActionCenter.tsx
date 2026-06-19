"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Lightbulb, Info, ArrowRight } from "lucide-react";

interface Action {
  title: string;
  desc: string;
  href: string;
  priority: "high" | "recommended" | "optional";
}

interface ActionCenterProps {
  actions: Action[];
}

const priorityConfig = {
  high: {
    label: "High Priority",
    bg: "bg-rose-50 border-rose-100",
    badge: "bg-rose-100 text-rose-700",
    icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
  },
  recommended: {
    label: "Recommended",
    bg: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
  },
  optional: {
    label: "Optional",
    bg: "bg-slate-50 border-[#E5E7EB]",
    badge: "bg-slate-100 text-slate-600",
    icon: <Info className="w-4 h-4 text-slate-400" />,
  },
};

export default function ActionCenter({ actions }: ActionCenterProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="text-sm font-bold text-[#111827]">All caught up!</p>
        <p className="text-xs text-[#64748B] mt-1">No pending actions right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {actions.map((action, i) => {
        const config = priorityConfig[action.priority];
        return (
          <Link
            key={i}
            href={action.href}
            className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:shadow-sm ${config.bg}`}
          >
            <div className="shrink-0 mt-0.5">{config.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-[#111827] truncate">{action.title}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-[#64748B] truncate">{action.desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </Link>
        );
      })}
    </div>
  );
}
