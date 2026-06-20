import React from "react";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";

export default function JobCard({ job, isSaved, toggleSaveJob, onClick }: any) {
  // calculate time ago
  const getTimeAgo = (date: string | Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="group bg-white border border-[#E2E8F0] rounded-[20px] p-6 hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer flex flex-col gap-4 relative"
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleSaveJob(job.id);
        }}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-colors z-10"
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5 text-emerald-600" /> : <Bookmark className="w-5 h-5" />}
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-12">
        <div className="flex items-start gap-4 w-full">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt={job.company} className="w-14 h-14 rounded-[12px] object-cover border border-[#E2E8F0] shrink-0" />
          ) : (
            <div className="w-14 h-14 bg-slate-50 rounded-[12px] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-xl font-bold text-[#0F172A] uppercase">
              {job.company.charAt(0)}
            </div>
          )}
          <div className="w-full min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-emerald-600 transition-colors leading-tight truncate">
                {job.title}
              </h3>
              {job.matchScore && job.matchScore > 80 && (
                <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  High Match
                </span>
              )}
              {job.remote && (
                 <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  Remote
                 </span>
              )}
            </div>
            
            <p className="text-sm font-semibold text-[#64748B]">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium truncate max-w-[150px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{job.location || "Remote"}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {job.employmentType || "Full-time"} {job.experienceLevel ? `• ${job.experienceLevel}` : ""}
              </span>
              {(job.salaryMin || job.salaryMax) ? (
                <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ${job.salaryMin ? (job.salaryMin / 1000) + "k" : ""}{job.salaryMin && job.salaryMax ? " - " : ""}{job.salaryMax ? (job.salaryMax / 1000) + "k" : ""}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {getTimeAgo(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]/60">
        <div className="flex flex-wrap gap-2 w-full pr-4">
          {(job.skills || []).slice(0, 5).map((skill: string, index: number) => {
            const isMissing = job.missingSkills && job.missingSkills.includes(skill.toLowerCase());
            return (
              <span
                key={`${job.id}-${skill}-${index}`}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-[8px] border ${
                  isMissing 
                    ? "bg-rose-50 text-rose-700 border-rose-200" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {skill}
              </span>
            );
          })}
          {job.skills && job.skills.length > 5 && (
            <span className="px-3 py-1 text-[10px] font-bold text-slate-500 tracking-wider rounded-[8px] bg-slate-50 border border-slate-200">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
        
        <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
          {job.matchScore !== undefined && (
            <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-white shadow-sm">
              <span className="font-black text-lg leading-none">{job.matchScore}</span>
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-90 leading-none mt-0.5">Match</span>
            </div>
          )}
          <a
            href={job.applyUrl || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 sm:flex-none sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-[12px] shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            Apply
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
