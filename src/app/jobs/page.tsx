"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import DashboardLayout from "@/components/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import JobErrorState from "@/components/jobs/JobErrorState";
import JobDetailsDrawer from "@/components/jobs/JobDetailsDrawer";
import JobFiltersSidebar from "@/components/jobs/JobFiltersSidebar";
import {
  FileText,
  Sparkles,
  Filter,
} from "lucide-react";
import { useToast } from "@/components/Providers";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function JobListingsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    experience: "",
    remote: "",
    jobType: "",
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Derive userId safely
  const userId = session?.user ? (session.user as any).id || "demo-user-123" : null;

  // Use SWR to fetch recommendations. We ONLY fetch if user is logged in.
  const { data: recommendationsData, error: recError, isLoading: isRecLoading, mutate: mutateRec } = useSWR(
    userId ? `/api/jobs/recommended?userId=${userId}` : null,
    fetcher
  );

  const needsResume = recommendationsData?.needsResume;
  
  // Prepare general jobs query params
  const queryParams = new URLSearchParams({
    search: filters.search,
    category: filters.category,
    location: filters.location,
    experience: filters.experience,
    remote: filters.remote,
    jobType: filters.jobType,
    page: "1",
    limit: "20"
  }).toString();

  const hasActiveFilters = Object.values(filters).some(val => val !== "");

  // Fetch general jobs via SWR if they have filters or if we don't need a resume
  // But to save requests, we usually only fetch general jobs if there are active filters OR if we want to show generic jobs instead of recs.
  // The user requirement: display jobs. If filters are active, show general jobs matching filters.
  const { data: generalData, error: genError, isLoading: isGenLoading, mutate: mutateGen } = useSWR(
    userId && !needsResume ? `/api/jobs?${queryParams}` : null,
    fetcher
  );

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      experience: "",
      remote: "",
      jobType: "",
    });
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!userId) return;
    const newSaved = new Set(savedJobIds);
    const isSaved = newSaved.has(jobId);
    
    // Optimistic update
    if (isSaved) {
      newSaved.delete(jobId);
      setSavedJobIds(newSaved);
    } else {
      newSaved.add(jobId);
      setSavedJobIds(newSaved);
    }

    try {
      if (isSaved) {
        await fetch(`/api/jobs/save?userId=${userId}&jobId=${jobId}`, { method: "DELETE" });
        toast("Job removed from saved list", "info");
      } else {
        await fetch(`/api/jobs/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, jobId })
        });
        toast("Job saved successfully", "success");
      }
    } catch (e) {
      // Revert optimistic update on failure
      toast("Failed to update saved jobs", "error");
      const reverted = new Set(savedJobIds);
      if (isSaved) reverted.add(jobId);
      else reverted.delete(jobId);
      setSavedJobIds(reverted);
    }
  };

  // Auth Loading state
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
        </div>
      </DashboardLayout>
    );
  }

  // --- NEW USER EXPERIENCE (No Resume) ---
  if (needsResume) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto mt-12 bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] mb-3">No recommendations yet</h1>
          <p className="text-slate-500 font-semibold mb-8 max-w-md leading-relaxed">
            Upload your resume to receive personalized job recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => router.push("/resume-upload")}
              className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Upload Resume
            </button>
            <button
              onClick={() => router.push("/ats-checker")}
              className="bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold py-3 px-8 rounded-xl shadow-sm transition-all"
            >
              Run ATS Analysis
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = hasActiveFilters ? isGenLoading : isRecLoading;
  const isError = hasActiveFilters ? genError : recError;
  const displayJobs = hasActiveFilters ? (generalData?.jobs || []) : (recommendationsData?.jobs || []);

  return (
    <DashboardLayout>
      <div className="pb-12 h-full flex flex-col">
        
        {/* Header */}
        <div className="border-b border-[#E2E8F0] pb-5 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Job Board</h1>
            <p className="text-sm text-[#64748B] font-semibold mt-1">
              Discover opportunities tailored to your skills and career goals.
            </p>
          </div>
          
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden p-2.5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm text-slate-600 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-bold">Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative h-full">
          
          {/* Left Sidebar (Filters) */}
          <JobFiltersSidebar 
            filters={filters} 
            setFilters={setFilters} 
            resetFilters={resetFilters}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Right Content Area (Jobs) */}
          <div className="flex-1 w-full space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
                {hasActiveFilters ? "Search Results" : "Top Personalized Matches"}
              </h2>
              {!isLoading && !isError && (
                <span className="text-xs font-bold text-slate-400">
                  {displayJobs.length} {displayJobs.length === 1 ? "Job" : "Jobs"} found
                </span>
              )}
            </div>

            {/* Content States */}
            {isError ? (
              <JobErrorState onRetry={() => hasActiveFilters ? mutateGen() : mutateRec()} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : displayJobs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">No jobs matched your filters</h3>
                <p className="text-[#64748B] text-sm font-medium mb-6 max-w-sm leading-relaxed">
                  Try changing your search criteria, widening your location, or clearing your filters to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayJobs.map((job: any) => (
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

      </div>

      {/* Details Drawer */}
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
