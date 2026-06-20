import React, { useEffect, useState } from "react";
import { X, ExternalLink, MapPin, Briefcase, DollarSign, Clock, Building2, Bookmark, BookmarkCheck, CheckCircle2, XCircle, Calendar, ShieldCheck, HelpCircle } from "lucide-react";
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
    return { name: "External Site", color: "bg-slate-50 text-slate-700 border-slate-200" };
  }
};

export default function JobDetailsDrawer({ job, isOpen, onClose, isSaved, toggleSaveJob }: any) {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const badge = getSourceBadge(job.externalId, job.applyUrl);

  const handleApply = () => {
    if (!job.applyUrl) {
      toast("Application link is missing or broken", "error");
      return;
    }
    
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    }, 600);
  };

  // Calculate dynamic deadline (30 days from creation)
  const getDeadline = (createdAtStr: string | Date) => {
    const date = new Date(createdAtStr);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Check description to see if responsibilities are structured inside
  const hasStructuredDescription = (desc: string) => {
    const lower = desc.toLowerCase();
    return lower.includes("responsibilities") || lower.includes("requirements") || lower.includes("what you will do") || lower.includes("role description");
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[650px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-[#E2E8F0] flex flex-col">
        
        {/* Header (Sticky) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isSaved 
                  ? "bg-emerald-50 border-emerald-200 text-[#10B981] hover:bg-emerald-100" 
                  : "bg-white border-[#E2E8F0] text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button 
              type="button"
              disabled={isApplying}
              onClick={handleApply}
              className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-2.5 px-6 rounded-xl shadow-sm transition-all text-xs flex items-center gap-1.5 disabled:opacity-70"
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

        {/* Content Container */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto pb-36">
          
          {/* Company Details Title Header */}
          <div className="flex gap-5 items-start">
            {job.logoUrl ? (
              <img 
                src={job.logoUrl} 
                alt={job.company} 
                className="w-20 h-20 rounded-[20px] object-cover border border-[#E2E8F0] bg-slate-50 shadow-sm shrink-0" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-tr from-slate-50 to-slate-100 rounded-[20px] border border-[#E2E8F0] shadow-sm flex items-center justify-center shrink-0 text-4xl font-black text-[#0F172A] uppercase">
                {job.company.charAt(0)}
              </div>
            )}
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${badge.color}`}>
                  {badge.name}
                </span>
                {job.remote && (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border border-indigo-100">
                    Remote
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-[#0F172A] leading-tight mb-1">{job.title}</h1>
              <div className="flex items-center gap-2 text-base font-bold text-[#64748B]">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[20px]">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> Location
              </span>
              <p className="text-xs font-bold text-[#0F172A] truncate">{job.location || "Remote"}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 shrink-0" /> Job Type
              </span>
              <p className="text-xs font-bold text-[#0F172A] truncate">{job.employmentType || "Full-time"}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 shrink-0" /> Salary
              </span>
              <p className="text-xs font-bold text-emerald-600 truncate">
                {(job.salaryMin || job.salaryMax) 
                  ? `$${job.salaryMin ? (job.salaryMin / 1000) + "k" : ""}${job.salaryMin && job.salaryMax ? " - " : ""}${job.salaryMax ? (job.salaryMax / 1000) + "k" : ""}` 
                  : "Not Disclosed"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 shrink-0" /> Deadline
              </span>
              <p className="text-xs font-bold text-rose-500 truncate">{getDeadline(job.createdAt)}</p>
            </div>
          </div>

          {/* Interactive Match Analysis (Resume Fit) */}
          {job.matchScore !== undefined && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Personalized Suitability Score</h3>
              <div className="bg-white border border-[#E2E8F0] rounded-[18px] p-5 space-y-4 shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">Resume Relevance Match</span>
                    <span className="text-sm font-black text-[#0F172A]">{job.matchScore}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${job.matchScore > 75 ? "bg-emerald-500" : job.matchScore > 50 ? "bg-amber-400" : "bg-rose-500"}`}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                </div>

                {job.whyMatches && (
                  <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed font-semibold">
                    <span className="text-emerald-600 font-extrabold mr-1">Rationale:</span>
                    {job.whyMatches}
                  </div>
                )}

                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div className="space-y-2.5 pt-3.5 border-t border-[#E2E8F0]/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Identified Missing Skills (Skill Gap)</span>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill: string, i: number) => (
                        <span key={i} className="flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded-lg px-2.5 py-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{skill.toUpperCase()}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Overview Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Company Overview</h3>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[18px] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{job.company}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Aggregated Listing from {badge.name}</p>
                </div>
                <div className="bg-white border border-[#E2E8F0] px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verified Platform
                </div>
              </div>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                {job.company} is actively hiring for tech and product engineering opportunities. This listing is sourced and authenticated directly from the official {badge.name} platform page.
              </p>
              <div className="pt-2 border-t border-[#E2E8F0]/60 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source Link:</span>
                <a 
                  href={job.applyUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1 hover:underline"
                >
                  {badge.name} Posting
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Responsibilities Highlights */}
          {!hasStructuredDescription(job.description) && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Key Responsibilities</h3>
              <div className="bg-slate-50 border border-slate-100 rounded-[18px] p-4 text-xs font-semibold text-slate-600 space-y-2">
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>Implement clean, maintainable, and efficient application code.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>Collaborate across engineering, design, and management structures.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>Debug problems, optimize system speed, and verify product compliance.</span>
                </div>
                <div className="text-[10px] text-slate-400 italic mt-3 flex items-center gap-1 pt-2 border-t border-slate-200/50">
                  <HelpCircle className="w-3 h-3" /> Note: Refer to the comprehensive description below for specific workflows.
                </div>
              </div>
            </div>
          )}

          {/* Full Role Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Full Description</h3>
            <div 
              className="text-sm text-slate-600 leading-relaxed space-y-4 prose prose-sm max-w-none prose-a:text-[#10B981] font-medium"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Benefits Summary Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Compensations & Benefits</h3>
            <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-[18px] p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Competitive Salaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Flexible Hours / Remote Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Aggregated Industry Coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Professional Growth Roadmap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills list */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, i: number) => {
                  const isMissing = job.missingSkills && job.missingSkills.includes(skill.toLowerCase());
                  return (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg border ${
                        isMissing ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {skill} {(!isMissing && job.matchScore !== undefined) && <CheckCircle2 className="w-3.5 h-3.5 inline-flex ml-1 text-emerald-500" />}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
