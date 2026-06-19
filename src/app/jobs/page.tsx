"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Globe,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getJobsAction } from "@/app/actions/jobs";
import { getUserSkillsAction } from "@/app/actions/skills";

export default function JobListingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterRemote, setFilterRemote] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user) {
      loadUserSkills();
    }
  }, [session]);

  useEffect(() => {
    loadJobs();
  }, [currentPage, searchQuery, filterCategory, filterLocation, filterExperience, filterRemote]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const response = await getJobsAction({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: filterCategory,
      });
      // We do frontend filtering for the new fields since the backend getJobsAction might not support them yet
      let filteredJobs = response.jobs;
      if (filterLocation) {
        filteredJobs = filteredJobs.filter((j: any) => j.location.toLowerCase().includes(filterLocation.toLowerCase()));
      }
      if (filterExperience) {
        filteredJobs = filteredJobs.filter((j: any) => j.experience?.toLowerCase() === filterExperience.toLowerCase());
      }
      if (filterRemote) {
        if (filterRemote === "remote") {
          filteredJobs = filteredJobs.filter((j: any) => j.isRemote);
        } else if (filterRemote === "onsite") {
          filteredJobs = filteredJobs.filter((j: any) => !j.isRemote);
        }
      }
      setJobs(filteredJobs);
      setTotalJobs(filteredJobs.length);
      setTotalPages(Math.ceil(filteredJobs.length / itemsPerPage) || 1);
    } catch (e) {
      console.error("Error loading jobs:", e);
      toast("Failed to load jobs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSkills = async () => {
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const skills = await getUserSkillsAction(userId);
      setUserSkills(skills.map((s) => s.name.toLowerCase()));
    } catch (e) {
      console.error("Error loading skills:", e);
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

  const toggleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const newSaved = new Set(savedJobIds);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
      toast("Job removed from saved list", "info");
    } else {
      newSaved.add(jobId);
      toast("Job saved successfully", "success");
    }
    setSavedJobIds(newSaved);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Job Board</h1>
          <p className="text-[#64748B] text-sm font-semibold mt-1">Discover premium open roles that match your career goals.</p>
        </div>

        {/* Board Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar (col 3) */}
          <div className="lg:col-span-3 bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm space-y-6 lg:sticky lg:top-24">
            <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]/60">
              <span className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-[#10B981] hover:underline uppercase tracking-wider cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-5">
              
              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Role, company..."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 pl-9 transition-colors"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Category selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Design">Design</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Engineering">Cloud Engineering</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filterLocation}
                    onChange={(e) => {
                      setFilterLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="City, State, Country..."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 pl-9 transition-colors"
                  />
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Experience Level</label>
                <select
                  value={filterExperience}
                  onChange={(e) => {
                    setFilterExperience(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">Any Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead/Manager">Lead/Manager</option>
                </select>
              </div>

              {/* Remote Options */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Work Environment</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#64748B] hover:text-[#0F172A]">
                    <input type="radio" name="remote" value="" checked={filterRemote === ""} onChange={(e) => setFilterRemote(e.target.value)} className="accent-emerald-600" /> All
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#64748B] hover:text-[#0F172A]">
                    <input type="radio" name="remote" value="remote" checked={filterRemote === "remote"} onChange={(e) => setFilterRemote(e.target.value)} className="accent-emerald-600" /> Remote Only
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#64748B] hover:text-[#0F172A]">
                    <input type="radio" name="remote" value="onsite" checked={filterRemote === "onsite"} onChange={(e) => setFilterRemote(e.target.value)} className="accent-emerald-600" /> On-site / Hybrid
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Job listings (col 9) */}
          <div className="lg:col-span-9 space-y-4">
            
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-[#E2E8F0] rounded-[16px] shadow-sm">
              <span className="text-sm font-bold text-[#0F172A]">
                {totalJobs} {totalJobs === 1 ? "Job" : "Jobs"} Found
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 animate-pulse flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-200 rounded-[12px]"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2 mt-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">No jobs matched your filters</h3>
                <p className="text-[#64748B] text-sm mb-6">Try adjusting your search criteria or resetting filters.</p>
                <button
                  onClick={resetFilters}
                  className="bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => {
                  const isSaved = savedJobIds.has(job.id);
                  return (
                    <div
                      key={job.id}
                      className="group bg-white border border-[#E2E8F0] rounded-[20px] p-6 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col gap-4 relative"
                    >
                      <button 
                        onClick={(e) => toggleSaveJob(e, job.id)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-colors z-10"
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5 text-emerald-600" /> : <Bookmark className="w-5 h-5" />}
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-12">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-slate-50 rounded-[12px] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-xl font-bold text-[#0F172A]">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-emerald-600 transition-colors leading-tight">
                              {job.title}
                            </h3>
                            <p className="text-sm font-semibold text-[#64748B] mt-1">{job.company}</p>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {job.location} {job.isRemote && "(Remote)"}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                {job.type || "Full-time"} • {job.experience || "Mid-Level"}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                {job.salary || "$120k - $150k"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]/60">
                        <div className="flex flex-wrap gap-2">
                          {(job.skills || []).map((skill: string, index: number) => {
                            const isMatch = userSkills.includes(skill.toLowerCase());
                            return (
                              <span
                                key={`${job.id}-${skill}-${index}`}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-[8px] border ${
                                  isMatch 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-slate-100 text-slate-600 border-[#E2E8F0]"
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                        <div className="shrink-0 w-full sm:w-auto">
                          <a
                            href={job.applyUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-[10px] shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                          >
                            Apply
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] font-bold text-sm bg-white border border-[#E2E8F0] text-[#0F172A] disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-sm font-semibold text-[#64748B]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] font-bold text-sm bg-white border border-[#E2E8F0] text-[#0F172A] disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Explore salary benchmarks and growth trends</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Once you identify matching job openings, explore corresponding market salary guidelines and tech trend benchmarks.
            </p>
          </div>
          <Link
            href="/career-insights"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Career Insights
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
