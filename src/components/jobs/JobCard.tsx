import React, { useState } from "react";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Briefcase, DollarSign, Clock, Share2, Building2 } from "lucide-react";
import { useToast } from "@/components/Providers";

const getSourceBadge = (externalId: string, applyUrl: string) => {
  const url = (applyUrl || "").toLowerCase();
  const ext = (externalId || "").toLowerCase();
  
  if (url.includes("linkedin.com")) return { name: "LinkedIn", color: "bg-blue-50 text-blue-700 border-blue-200" };
  if (url.includes("indeed.com")) return { name: "Indeed", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  if (url.includes("unstop.com")) return { name: "Unstop", color: "bg-sky-50 text-sky-700 border-sky-200" };
  if (url.includes("wellfound.com") || url.includes("angel.co")) return { name: "Wellfound", color: "bg-slate-900 text-slate-100 border-slate-700" };
  if (url.includes("naukri.com")) return { name: "Naukri", color: "bg-orange-50 text-orange-700 border-orange-200" };
  if (url.includes("internshala.com")) return { name: "Internshala", color: "bg-cyan-50 text-cyan-700 border-cyan-200" };
  if (url.includes("google.com/search") || url.includes("google.jobs")) return { name: "Google Jobs", color: "bg-rose-50 text-rose-700 border-rose-200" };
  if (url.includes("remotive.com") || ext.startsWith("remotive-")) return { name: "Remotive", color: "bg-purple-50 text-purple-700 border-purple-200" };
  if (url.includes("arbeitnow.com") || ext.startsWith("arbeitnow-")) return { name: "Arbeitnow", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  
  try {
    const domain = new URL(applyUrl).hostname.replace("www.", "");
    return { name: domain, color: "bg-slate-50 text-slate-700 border-slate-200" };
  } catch (e) {
    return { name: "Direct Apply", color: "bg-slate-50 text-slate-700 border-slate-200" };
  }
};

import Link from "next/link";

export default function JobCard({ job, isSaved, toggleSaveJob, onClick }: any) {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  
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

  const badge = getSourceBadge(job.externalId, job.applyUrl || job.companyCareersUrl);

  const finalUrl = job.applyUrl || job.companyCareersUrl;

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!finalUrl) {
      toast("Application link is missing or broken", "error");
      return;
    }
    
    setIsApplying(true);
    
    // Auto-track application in background
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.id) {
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            jobId: job.id,
            company: job.company,
            title: job.title,
            status: "Applied"
          })
        });
      }
    } catch (err) {
      console.error("Failed to auto-track application:", err);
    }

    setTimeout(() => {
      setIsApplying(false);
      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }, 600);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: finalUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(finalUrl);
      toast("Link copied to clipboard!", "success");
    }
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="group bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col gap-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full">
          {job.logoUrl ? (
            <img 
              src={job.logoUrl} 
              alt={job.company} 
              className="w-16 h-16 rounded-[16px] object-cover border border-[#E2E8F0] bg-slate-50 shrink-0" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-tr from-slate-50 to-slate-100 rounded-[16px] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-2xl font-black text-[#0F172A] uppercase shadow-sm">
              {job.company.charAt(0)}
            </div>
          )}
          
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-lg font-black text-[#0F172A] group-hover:text-[#10B981] transition-colors leading-snug truncate pr-6">
                {job.title}
              </h3>
              {job.matchScore !== undefined && job.matchScore > 75 && (
                <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border border-emerald-200">
                  Strong Match
                </span>
              )}
              {job.remote && (
                 <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border border-indigo-100">
                  Remote
                 </span>
              )}
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${badge.color}`}>
                {badge.name}
              </span>
            </div>
            
            {job.companyId ? (
              <Link 
                href={`/companies/${job.companyId}`} 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm font-bold text-[#64748B] hover:text-[#10B981] transition-colors"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{job.company}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1 text-sm font-bold text-[#64748B]">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 truncate max-w-[160px]">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{job.location || "Remote"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                {job.employmentType || "Full-time"} {job.experienceLevel ? `• ${job.experienceLevel}` : ""}
              </span>
              {(job.salaryMin || job.salaryMax) ? (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                  ${job.salaryMin ? (job.salaryMin / 1000) + "k" : ""}{job.salaryMin && job.salaryMax ? " - " : ""}{job.salaryMax ? (job.salaryMax / 1000) + "k" : ""}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                {getTimeAgo(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {job.whyMatches && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-[14px] px-4 py-3 text-xs text-[#0F172A] font-semibold leading-relaxed">
          <span className="text-emerald-600 font-extrabold mr-1">Why matches:</span>
          {job.whyMatches}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]/60">
        <div className="flex flex-wrap gap-1.5 w-full pr-4">
          {(job.skills || []).slice(0, 5).map((skill: string, index: number) => {
            const isMissing = job.missingSkills && job.missingSkills.includes(skill.toLowerCase());
            return (
              <span
                key={`${job.id}-${skill}-${index}`}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-[8px] border ${
                  isMissing 
                    ? "bg-rose-50 text-rose-700 border-rose-100" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}
              >
                {skill}
              </span>
            );
          })}
          {job.skills && job.skills.length > 5 && (
            <span className="px-2.5 py-1 text-[9px] font-bold text-slate-500 tracking-wider rounded-[8px] bg-slate-50 border border-slate-200">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
        
        <div className="shrink-0 flex items-center justify-end gap-2 w-full sm:w-auto">
          {job.matchScore !== undefined && (
            <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-white shadow-sm mr-1">
              <span className="font-black text-base leading-none">{job.matchScore}</span>
              <span className="text-[8px] uppercase tracking-widest font-black opacity-90 leading-none mt-0.5">Match</span>
            </div>
          )}
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className={`p-2.5 rounded-[12px] border transition-all cursor-pointer ${
              isSaved 
                ? "bg-emerald-50 border-emerald-200 text-[#10B981] hover:bg-emerald-100" 
                : "bg-white border-[#E2E8F0] text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title={isSaved ? "Saved" : "Save Job"}
          >
            {isSaved ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
          </button>

          <button 
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-[12px] border bg-white border-[#E2E8F0] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            title="Share Job"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 sm:flex-none sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-2.5 px-5 rounded-[12px] shadow-sm transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-70"
          >
            {isApplying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
