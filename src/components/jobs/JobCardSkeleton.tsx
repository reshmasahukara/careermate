import React from "react";

export default function JobCardSkeleton() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full">
          {/* Logo Skeleton */}
          <div className="w-14 h-14 bg-slate-200 rounded-[12px] shrink-0" />
          
          <div className="w-full space-y-3">
            {/* Title & Badge Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded-full w-16" />
            </div>
            
            {/* Company Skeleton */}
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            
            {/* Stats Skeleton */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]/60">
        {/* Skills Skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 rounded-[8px]" />
          <div className="h-6 w-20 bg-slate-200 rounded-[8px]" />
          <div className="h-6 w-14 bg-slate-200 rounded-[8px]" />
        </div>
        
        {/* Actions Skeleton */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="h-10 w-24 bg-slate-200 rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
