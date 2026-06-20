"use client";

import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { MapPin, DollarSign, ArrowRight, Briefcase, FileSearch, CheckCircle2 } from "lucide-react";

interface JobRecommendationsProps {
  targetRole?: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobRecommendations({ targetRole }: JobRecommendationsProps) {
  const { data, error, isLoading } = useSWR(
    targetRole ? `/api/jobs?search=${encodeURIComponent(targetRole)}&limit=3` : null,
    fetcher
  );

  if (!targetRole) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-[16px] bg-[#111827]">
        <div className="w-12 h-12 bg-[#14B8A6]15 text-[#14B8A6] rounded-full flex items-center justify-center mb-3">
          <FileSearch className="w-6 h-6" />
        </div>
        <h4 className="text-[15px] font-semibold text-[#F9FAFB] mb-1">No Recommendations</h4>
        <p className="text-[13px] text-[#9CA3AF] max-w-[200px] mb-4">
          Upload your resume to get matching jobs
        </p>
        <Link href="/resume-upload" className="text-xs font-bold text-white bg-[#14B8A6] hover:bg-[#0d9488] px-4 py-2 rounded-xl transition-colors">
          Upload Resume
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-[#111827] h-32 rounded-[16px] border border-[rgba(255,255,255,0.05)]"></div>
        ))}
      </div>
    );
  }

  if (error || !data || !data.jobs || data.jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-[16px] bg-[#111827]">
        <h4 className="text-[15px] font-semibold text-[#F9FAFB] mb-1">No Jobs Found</h4>
        <p className="text-[13px] text-[#9CA3AF] mb-4">
          We couldn't find active jobs for "{targetRole}" at the moment.
        </p>
      </div>
    );
  }

  const jobs = data.jobs.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job: any, i: number) => {
          // Mock match percentage since API doesn't return it
          const matchPercentage = 85 + (i * 4) - i;
          
          return (
            <a
              key={job.id}
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 bg-[#111827] hover:bg-[#1f2937] border border-[rgba(255,255,255,0.05)] hover:border-[#14B8A6] rounded-[16px] transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-1 bg-[#14B8A6]15 text-[#14B8A6] px-2 py-0.5 rounded-full text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {matchPercentage}% Match
                </div>
              </div>
              
              <div className="mb-auto">
                <p className="text-[15px] font-semibold text-[#F9FAFB] line-clamp-2 group-hover:text-[#14B8A6] transition-colors">
                  {job.title}
                </p>
                <p className="text-[13px] text-[#9CA3AF] mt-1 truncate">{job.companyName}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-[12px] text-[#9CA3AF] font-medium pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {job.location || "Remote"}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Link
          href={`/jobs?search=${encodeURIComponent(targetRole)}`}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14B8A6] hover:text-[#0d9488] transition-colors"
        >
          View All Recommended Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
