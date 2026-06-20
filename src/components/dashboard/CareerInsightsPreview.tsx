"use client";

import React from "react";
import { TrendingUp, DollarSign, Award, Star } from "lucide-react";

interface CareerInsightsPreviewProps {
  targetRole: string | null;
}

export default function CareerInsightsPreview({ targetRole }: CareerInsightsPreviewProps) {
  // In a real app, this data would come from the backend based on the target role
  // Since we only have static data for now, we'll display meaningful static insights
  // when a target role exists, or a prompt if it doesn't.

  if (!targetRole) {
    return (
      <div className="bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-[16px] shadow-sm p-6 flex flex-col items-center justify-center text-center h-full">
        <Star className="w-8 h-8 text-[#64748B] mb-3" />
        <p className="text-[15px] text-[#9CA3AF]">
          Set a target role or upload a resume to view career insights.
        </p>
      </div>
    );
  }

  const insights = [
    {
      label: "Average Salary Range",
      value: "$85k - $130k",
      icon: <DollarSign className="w-4 h-4 text-[#14B8A6]" />,
      bgColor: "bg-[#14B8A6]15"
    },
    {
      label: "Trending Tech",
      value: "React, Node.js, Cloud",
      icon: <TrendingUp className="w-4 h-4 text-[#F59E0B]" />,
      bgColor: "bg-[#F59E0B]15"
    },
    {
      label: "Recommended Certs",
      value: "AWS Solutions Architect",
      icon: <Award className="w-4 h-4 text-[#6366F1]" />,
      bgColor: "bg-[#6366F1]15"
    }
  ];

  return (
    <div className="bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-[16px] shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-[18px] font-semibold text-[#F9FAFB]">Career Insights</h3>
        <p className="text-[15px] text-[#9CA3AF] mt-1">Market data for {targetRole}</p>
      </div>
      <div className="p-6 space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div 
              className="p-3 rounded-[12px] bg-opacity-10"
              style={{ backgroundColor: insight.bgColor.replace("15", "1a") }}
            >
              {insight.icon}
            </div>
            <div>
              <p className="text-[13px] text-[#9CA3AF] font-medium uppercase tracking-wider">{insight.label}</p>
              <p className="text-[15px] font-semibold text-[#F9FAFB] mt-0.5">{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
