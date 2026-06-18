"use client";

import React from "react";

interface LogoProps {
  className?: string;
  hideWordmark?: boolean;
  lightWordmark?: boolean;
}

export default function Logo({ className = "w-6 h-6", hideWordmark = false, lightWordmark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 group shrink-0">
      {/* Circle compass icon merged with upward arrow */}
      <div className={`${className} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Circular shape representing career growth and guidance (Deep Blue) */}
          <circle
            cx="12"
            cy="12"
            r="10"
            className="text-[#1E40AF]"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          
          {/* Compass dial indicators (Deep Blue) */}
          <line x1="12" y1="2" x2="12" y2="4.5" className="text-[#1E40AF]" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="19.5" x2="12" y2="22" className="text-[#1E40AF]" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="12" x2="4.5" y2="12" className="text-[#1E40AF]" stroke="currentColor" strokeWidth="1.5" />
          <line x1="19.5" y1="12" x2="22" y2="12" className="text-[#1E40AF]" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Upward arrow merged with compass needle (Teal accent) */}
          <path
            d="M12 17V5.5M12 5.5L8.5 9M12 5.5L15.5 9"
            className="text-[#14B8A6]"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          
          {/* Pivot dot (Teal accent) */}
          <circle cx="12" cy="12" r="1.2" className="text-[#14B8A6]" fill="currentColor" />
        </svg>
      </div>
      
      {!hideWordmark && (
        <span className={`font-semibold text-lg tracking-tight font-sans ${lightWordmark ? "text-white" : "text-[#0F172A]"}`}>
          CareerMate
        </span>
      )}
    </div>
  );
}
