"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";
import JobDetailsDrawer from "@/components/jobs/JobDetailsDrawer";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  FileText,
  Sparkles,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/Providers";

export default function JobListingsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Job states
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [generalJobs, setGeneralJobs] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [needsResume, setNeedsResume] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterRemote, setFilterRemote] = useState("");
  
  // Drawer state
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user) {
      loadInitialData();
    }
  }, [session]);

  // When filters change, load general jobs
  useEffect(() => {
    if (session?.user && !needsResume) {
      loadGeneralJobs();
    }
  }, [currentPage, searchQuery, filterCategory, filterLocation, filterExperience, filterRemote]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      
      // Load Recommendations (which checks if resume exists)
      const res = await fetch(`/api/jobs/recommended?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to load recommendations");
      const data = await res.json();
      
      if (data.needsResume) {
        setNeedsResume(true);
      } else {
        setRecommendedJobs(data.jobs || []);
      }
      
      // Also load initial general jobs
      await loadGeneralJobs();

    } catch (e) {
      console.error("Error loading initial data:", e);
      toast("Failed to load job recommendations.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadGeneralJobs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        category: filterCategory,
        location: filterLocation,
        experience: filterExperience,
        remote: filterRemote,
      });

      const res = await fetch(`/api/jobs?${params}`);
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      
      setGeneralJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
    } catch (e) {
      console.error("Error loading general jobs:", e);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory("");
    setFilterLocation("");
    setFilterExperience("");
    setFilterRemote("");
    setCurrentPage(1);
    toast("Filters reset successfully.", "info");
  };

  const toggleSaveJob = async (jobId: string) => {
    const userId = (session?.user as any).id || "demo-user-123";
    const newSaved = new Set(savedJobIds);
    const isSaved = newSaved.has(jobId);
    
    try {
      if (isSaved) {
        await fetch(`/api/jobs/save?userId=${userId}&jobId=${jobId}`, { method: "DELETE" });
        newSaved.delete(jobId);
        toast("Job removed from saved list", "info");
      } else {
        await fetch(`/api/jobs/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, jobId })
        });
        newSaved.add(jobId);
        toast("Job saved successfully", "success");
      }
      setSavedJobIds(newSaved);
    } catch (e) {
      toast("Failed to update saved jobs", "error");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
          <p className="text-sm font-semibold text-[#64748B]">Personalizing job board...</p>
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
          <h1 className="text-3xl font-black text-[#0F172A] mb-3">No job recommendations yet</h1>
          <p className="text-slate-500 font-semibold mb-8 max-w-md leading-relaxed">
            Upload your resume and complete an ATS analysis to unlock highly personalized, dynamic job opportunities tailored strictly to your skills and experience.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/resume-analysis")}
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

  // Determine which list to show based on filters
  const hasActiveFilters = searchQuery || filterCategory || filterLocation || filterExperience || filterRemote;
  const displayJobs = hasActiveFilters ? generalJobs : recommendedJobs;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        
        {/* Header */}
        <div className="border-b border-[#E2E8F0] pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> AI Matched
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mt-1.5">Job Board</h1>
          <p className="text-sm text-[#64748B] font-semibold mt-1">
            Personalized opportunities based on your parsed resume and skills profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Job Listings (col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Filter Bar */}
            <div className="bg-white p-4 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Role, company, keywords..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 pl-9 transition-colors font-semibold text-slate-700"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <div className="relative flex-1 min-w-[150px]">
                <input
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder="Location..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 pl-9 transition-colors font-semibold text-slate-700"
                />
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-semibold text-slate-700 min-w-[120px]"
              >
                <option value="">Any Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
              <select
                value={filterRemote}
                onChange={(e) => setFilterRemote(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-semibold text-slate-700 min-w-[100px]"
              >
                <option value="">Worksite</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site</option>
              </select>
              
              <button
                onClick={resetFilters}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-rose-600"
                title="Clear Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
                {hasActiveFilters ? "Search Results" : "Top Personalized Matches"}
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {displayJobs.length} {displayJobs.length === 1 ? "Opportunity" : "Opportunities"}
              </span>
            </div>

            {/* Jobs List */}
            {displayJobs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center flex flex-col items-center shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">No jobs matched your criteria.</h3>
                <p className="text-[#64748B] text-sm font-medium mb-6">Try broadening your search filters or check back later.</p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayJobs.map((job) => (
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

          {/* Right Sidebar (col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Insights Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 shadow-md text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400">Market Insights</h3>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4">
                Based on your resume, roles emphasizing <strong className="text-white">React</strong> and <strong className="text-white">Node.js</strong> are currently seeing a 14% increase in hiring volume.
              </p>
              <Link
                href="/career-insights"
                className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View full trends <TrendingUp className="w-3 h-3" />
              </Link>
            </div>

            {/* Recommended Skills */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-wider">Skills to Learn</h3>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-4 leading-relaxed">
                Many of your top matched jobs require these skills which are currently missing from your profile:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider">TypeScript</span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider">AWS</span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider">Docker</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Drawer */}
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
