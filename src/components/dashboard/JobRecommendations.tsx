"use client";

import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { MapPin, DollarSign, ArrowRight, Briefcase, FileSearch } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
          <FileSearch className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">No Recommendations</h4>
        <p className="text-xs text-slate-500 max-w-[200px] mb-4">
          Upload your resume and set a target role to receive personalized job recommendations.
        </p>
        <Link href="/resume-upload" className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
          Upload Resume
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-slate-100 h-20 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error || !data || !data.jobs || data.jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <h4 className="text-sm font-bold text-slate-800 mb-1">No Jobs Found</h4>
        <p className="text-xs text-slate-500 mb-4">
          We couldn't find active jobs for "{targetRole}" at the moment.
        </p>
      </div>
    );
  }

  const jobs = data.jobs.slice(0, 3);

  return (
    <div className="space-y-3">
      {jobs.map((job: any) => (
        <a
          key={job.id}
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-3.5 bg-[#F7F8FA] hover:bg-white border border-[#E5E7EB] hover:border-emerald-200 hover:shadow-sm rounded-xl transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate group-hover:text-emerald-700 transition-colors">
                  {job.title}
                </p>
                <p className="text-xs text-[#64748B] truncate">{job.companyName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-[#64748B] font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location || "Remote"}
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> {job.salaryRange}
              </span>
            )}
          </div>
        </a>
      ))}

      <Link
        href={`/jobs?search=${encodeURIComponent(targetRole)}`}
        className="w-full flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 py-2.5 rounded-xl transition-all"
      >
        View All Jobs <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
