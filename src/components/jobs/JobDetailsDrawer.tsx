import React, { useEffect } from "react";
import { X, ExternalLink, MapPin, Briefcase, DollarSign, Clock, Building2, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from "lucide-react";

export default function JobDetailsDrawer({ job, isOpen, onClose, isSaved, toggleSaveJob }: any) {
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

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-[#E2E8F0]">
        
        {/* Header (Sticky) */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleSaveJob(job.id)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-emerald-600"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-emerald-600" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <a 
              href={job.applyUrl || "#"} 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2"
            >
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-8 space-y-8 pb-32">
          
          {/* Top Section */}
          <div className="flex gap-5 items-start">
            {job.logoUrl ? (
              <img src={job.logoUrl} alt={job.company} className="w-20 h-20 rounded-[16px] object-cover border border-[#E2E8F0] shadow-sm shrink-0" />
            ) : (
              <div className="w-20 h-20 bg-slate-50 rounded-[16px] border border-[#E2E8F0] shadow-sm flex items-center justify-center shrink-0 text-3xl font-black text-[#0F172A] uppercase">
                {job.company.charAt(0)}
              </div>
            )}
            <div className="pt-1">
              <h1 className="text-2xl font-black text-[#0F172A] leading-tight mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-base font-bold text-slate-600 mb-3">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {job.matchScore !== undefined && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider border border-emerald-200">
                    {job.matchScore}% Match
                  </span>
                )}
                {job.remote && (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider border border-indigo-100">
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px]">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <p className="text-sm font-bold text-[#0F172A]">{job.location || "Remote"}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Briefcase className="w-3.5 h-3.5" /> Job Type
              </span>
              <p className="text-sm font-bold text-[#0F172A]">{job.employmentType || "Full-time"}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <DollarSign className="w-3.5 h-3.5" /> Salary Range
              </span>
              <p className="text-sm font-bold text-[#0F172A]">
                {(job.salaryMin || job.salaryMax) 
                  ? `$${job.salaryMin ? (job.salaryMin / 1000) + "k" : ""}${job.salaryMin && job.salaryMax ? " - " : ""}${job.salaryMax ? (job.salaryMax / 1000) + "k" : ""}` 
                  : "Not Disclosed"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" /> Posted
              </span>
              <p className="text-sm font-bold text-[#0F172A]">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Match Analysis */}
          {job.matchScore !== undefined && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Resume Fit Analysis</h3>
              
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600">Overall Match Score</span>
                    <span className="text-sm font-black text-[#0F172A]">{job.matchScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${job.matchScore > 75 ? "bg-emerald-500" : job.matchScore > 50 ? "bg-amber-400" : "bg-rose-500"}`}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                </div>

                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-[#E2E8F0]/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Gaps Identified</span>
                    <div className="grid grid-cols-1 gap-2">
                      {job.missingSkills.map((skill: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Missing <span className="font-bold text-slate-800">{skill}</span> from resume</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">About The Role</h3>
            <div 
              className="text-sm text-slate-600 leading-relaxed space-y-4 prose prose-sm max-w-none prose-a:text-emerald-600"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Tags / Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, i: number) => {
                  const isMissing = job.missingSkills && job.missingSkills.includes(skill.toLowerCase());
                  return (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                        isMissing ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {skill} {(!isMissing && job.matchScore !== undefined) && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
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
