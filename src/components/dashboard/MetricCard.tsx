"use client";

import React from "react";
import Link from "next/link";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
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
  icon,
  href,
  accentColor = "#14B8A6",
  isEmpty = false,
  emptyText = "No data",
}: MetricCardProps) {
  const content = (
    <div
      className="group bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
    >
      <div 
        className="absolute top-0 left-0 w-full h-1" 
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[18px] font-semibold text-[#111827]">
          {title}
        </h3>
        <div
          className="p-2 rounded-xl bg-opacity-10"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {icon}
        </div>
      </div>

      {isEmpty ? (
        <div className="mt-2">
          <p className="text-[28px] font-bold text-slate-300 tracking-tight">—</p>
          <p className="text-[15px] text-[#64748B] mt-1">{emptyText}</p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-[28px] font-bold text-[#111827] tracking-tight">
            {value}
          </p>
          <p className="text-[15px] text-[#64748B] mt-1 leading-snug">{subtitle}</p>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href} className="block">{content}</Link>;
  return content;
}
