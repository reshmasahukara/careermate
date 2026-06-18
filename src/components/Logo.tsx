"use client";

import React from "react";

interface LogoProps {
  className?: string;
  hideWordmark?: boolean;
  lightWordmark?: boolean;
}

export default function Logo({ className = "w-6 h-6", hideWordmark = false, lightWordmark = false }: LogoProps) {
  const mainColorClass = lightWordmark ? "text-white" : "text-[#0F172A]";

  return (
    <div className="flex items-center gap-2 group shrink-0">
      {/* Compass + Upward Arrow + Roadmap Path (No enclosing circle, flat design) */}
      <div className={`${className} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* 1. Roadmap Path - winding career roadmap (Emerald Accent) */}
          <path
            d="M4 19c3-3 5-1 8-5s3-6 8-8"
            className="text-[#10B981]"
            stroke="currentColor"
            strokeWidth="2.2"
          />

          {/* 2. Upward Arrow merged with compass needle (Midnight Navy or White) */}
          <path
            d="M12 21V4M12 4L7.5 8.5M12 4l4.5 4.5"
            className={mainColorClass}
            stroke="currentColor"
            strokeWidth="2.2"
          />

          {/* 3. Compass horizontal tick markers (Midnight Navy or White) */}
          <path
            d="M4 12h2.5M20 12h-2.5"
            className={mainColorClass}
            stroke="currentColor"
            strokeWidth="1.8"
          />

          {/* 4. Pivot dot representing career focus/destination (Emerald Accent) */}
          <circle cx="12" cy="12" r="1.5" className="text-[#10B981]" fill="currentColor" stroke="none" />
        </svg>
      </div>
      
      {!hideWordmark && (
        <span className={`font-semibold text-lg tracking-[-0.02em] font-sans ${lightWordmark ? "text-white" : "text-[#0F172A]"}`}>
          CareerMate
        </span>
      )}
    </div>
  );
}
