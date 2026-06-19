"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: { value: number; label: string };
  icon: React.ReactNode;
  href?: string;
  accentColor?: string;
  isEmpty?: boolean;
  emptyText?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  href,
  accentColor = "#10B981",
  isEmpty = false,
  emptyText = "No data yet",
}: MetricCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  const content = (
    <div
      className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
        {trend && !isEmpty && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              trendPositive
                ? "bg-emerald-50 text-emerald-600"
                : trendNeutral
                ? "bg-slate-100 text-slate-500"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : trendNeutral ? (
              <Minus className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value > 0 ? "+" : ""}
            {trend.value} {trend.label}
          </div>
        )}
      </div>

      {isEmpty ? (
        <div>
          <p className="text-2xl font-extrabold text-slate-300 tracking-tight">—</p>
          <p className="text-xs text-slate-400 mt-1">{emptyText}</p>
        </div>
      ) : (
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            {value}
          </p>
          <p className="text-xs text-[#64748B] mt-1 leading-snug">{subtitle}</p>
        </div>
      )}

      <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest mt-3">
        {title}
      </p>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
