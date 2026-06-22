"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";
import JobDetailsDrawer from "@/components/jobs/JobDetailsDrawer";
import { Building2, MapPin, Users, Globe, ArrowLeft, ExternalLink, Briefcase } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function CompanyProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const userId = session?.user ? (session.user as any).id : null;

  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) {
          throw new Error("Company not found");
        }
        const data = await res.json();
        setCompany(data.company);
        setJobs(data.jobs || []);
      } catch (err) {
        toast("Failed to load company details", "error");
        router.push("/jobs");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompanyData();
  }, [id, router, toast]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/jobs/save?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.savedJobs)) {
            setSavedJobIds(new Set(data.savedJobs.map((sj: any) => sj.jobId)));
          }
        })
        .catch(console.error);
    }
  }, [userId]);

  const toggleSaveJob = async (jobId: string) => {
    if (!userId) {
      toast("Please sign in to save jobs", "error");
      return;
    }
    const newSaved = new Set(savedJobIds);
    const isSaved = newSaved.has(jobId);

    if (isSaved) newSaved.delete(jobId);
    else newSaved.add(jobId);
    setSavedJobIds(newSaved);

    try {
      if (isSaved) {
        await fetch(`/api/jobs/save?userId=${userId}&jobId=${jobId}`, { method: "DELETE" });
        toast("Removed from saved list", "info");
      } else {
        await fetch(`/api/jobs/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, jobId })
        });
        toast("Job saved successfully", "success");
      }
    } catch (e) {
      toast("Failed to update saved status", "error");
      const reverted = new Set(savedJobIds);
      if (isSaved) reverted.add(jobId);
      else reverted.delete(jobId);
      setSavedJobIds(reverted);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) return null;

  return (
    <DashboardLayout>
      <div className="pb-16 space-y-8">
        
        <button 
          onClick={() => router.push("/jobs")}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Board
        </button>

        {/* Company Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
          
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="w-32 h-32 rounded-[24px] object-cover bg-slate-50 border border-slate-100 shadow-sm shrink-0" />
          ) : (
            <div className="w-32 h-32 rounded-[24px] bg-indigo-50 text-indigo-600 font-black text-5xl flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
              {company.name.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  {company.industry || "Technology"}
                </span>
                {company.remoteFriendly && (
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                    Remote Friendly
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">{company.name}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
              {company.headquarters && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {company.headquarters}
                </div>
              )}
              {company.companySize && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {company.companySize} Employees
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <a 
                href={company.careersUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-xl shadow-sm transition-all text-sm"
              >
                <Globe className="w-4 h-4" />
                Official Careers Page
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Jobs Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-black text-[#0F172A]">Available Roles</h2>
            <span className="ml-2 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 px-3 py-1 rounded-full text-xs font-black">
              {jobs.length}
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-12 text-center flex flex-col items-center">
              <Briefcase className="w-8 h-8 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No active openings found</h3>
              <p className="text-sm text-slate-500 font-medium max-w-sm mt-2">
                There are currently no cached jobs for this company. Check back later or visit their official careers page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job: any) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  isSaved={savedJobIds.has(job.id)} 
                  toggleSaveJob={toggleSaveJob}
                  onClick={setSelectedJob}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <JobDetailsDrawer 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
        toggleSaveJob={toggleSaveJob}
      />
    </DashboardLayout>
  );
}
