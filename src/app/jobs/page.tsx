"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import DashboardLayout from "@/components/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import JobErrorState from "@/components/jobs/JobErrorState";
import JobDetailsDrawer from "@/components/jobs/JobDetailsDrawer";
import {
  FileText,
  Sparkles,
  Filter,
  Search,
  MapPin,
  ChevronDown,
  X,
  RefreshCw,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  Globe,
  SlidersHorizontal
} from "lucide-react";
import { useToast } from "@/components/Providers";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Mobile Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "Business Analyst",
  "Software Engineer Intern"
];

const LOCATION_EXAMPLES = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi NCR",
  "Noida",
  "Gurugram",
  "Remote"
];

export default function JobListingsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Derive userId safely
  const userId = session?.user ? (session.user as any).id : null;

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    location: "",
    experience: "",
    jobType: "",
    remoteOnly: false
  });

  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  
  // Custom dropdown search state
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [roleSearchText, setRoleSearchText] = useState("");
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Responsive mobile states
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isTabletAccordionOpen, setIsTabletAccordionOpen] = useState(false);

  // Paginated Feed States
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [feedError, setFeedError] = useState<any>(null);

  // Carousel Feeds (saved from unfiltered initial sync response)
  const [carousels, setCarousels] = useState({
    trending: [] as any[],
    remote: [] as any[],
    companies: [] as any[],
    recent: [] as any[]
  });

  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Search input debouncer (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  // Location input debouncer (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters(prev => ({ ...prev, location: locationInput }));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [locationInput]);

  // Close role selector dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Personalized Recommendations (only if user is logged in)
  const { data: recommendationsData, error: recError, isLoading: isRecLoading, mutate: mutateRec } = useSWR(
    userId ? `/api/jobs/recommended?userId=${userId}` : null,
    fetcher
  );

  const needsResume = recommendationsData?.needsResume;

  // Active filters check
  const hasActiveFilters = !!(
    filters.search ||
    filters.role ||
    filters.location ||
    filters.experience ||
    filters.jobType ||
    filters.remoteOnly
  );

  // Fetch jobs dynamically based on page & filters
  const fetchJobsFeed = async (pageNum: number, isNewSearch: boolean) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: filters.search,
        role: filters.role,
        location: filters.location,
        experience: filters.experience,
        jobType: filters.jobType,
        remote: filters.remoteOnly ? "true" : "",
        page: pageNum.toString(),
        limit: "20"
      });
      if (userId) {
        queryParams.append("userId", userId);
      }

      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch job board");
      const data = await res.json();

      if (isNewSearch) {
        setJobs(data.jobs || []);
        // Save carousel data from the initial feed query if search is clean
        if (!hasActiveFilters) {
          setCarousels({
            trending: data.trendingInternships || [],
            remote: data.remoteJobs || [],
            companies: data.topCompanies || [],
            recent: data.recentlyPosted || []
          });
        }
      } else {
        setJobs(prev => {
          // Avoid duplicate entries
          const existingIds = new Set(prev.map(j => j.id));
          const newJobs = (data.jobs || []).filter((j: any) => !existingIds.has(j.id));
          return [...prev, ...newJobs];
        });
      }

      setTotalJobs(data.total || 0);
      setHasMore(pageNum < (data.totalPages || 1));
      setFeedError(null);
    } catch (err: any) {
      setFeedError(err);
      toast("Error loading job board", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs list on filter change
  useEffect(() => {
    setPage(1);
    fetchJobsFeed(1, true);
  }, [filters, userId]);

  // Load Saved Jobs state for user
  useEffect(() => {
    if (userId) {
      fetch(`/api/jobs/save?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.savedJobs)) {
            setSavedJobIds(new Set(data.savedJobs.map((sj: any) => sj.jobId)));
          }
        })
        .catch(err => console.error("Error loading saved jobs list:", err));
    }
  }, [userId]);

  const loadMoreJobs = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobsFeed(nextPage, false);
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setFilters({
      search: "",
      role: "",
      location: "",
      experience: "",
      jobType: "",
      remoteOnly: false
    });
    setRoleSearchText("");
    setIsRoleDropdownOpen(false);
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!userId) {
      toast("Please sign in to save jobs", "error");
      return;
    }
    const newSaved = new Set(savedJobIds);
    const isSaved = newSaved.has(jobId);

    // Optimistic UI updates
    if (isSaved) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
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
      // Revert state
      const reverted = new Set(savedJobIds);
      if (isSaved) reverted.add(jobId);
      else reverted.delete(jobId);
      setSavedJobIds(reverted);
    }
  };

  // Filter Target role suggestions matching selector
  const filteredRoles = ROLE_OPTIONS.filter(r =>
    r.toLowerCase().includes(roleSearchText.toLowerCase())
  );

  // Render a filter select or input item
  const renderFilterControls = () => (
    <>
      {/* Search Bar Input */}
      <div className="flex-1 min-w-[200px] relative">
        <label className="sr-only">Search</label>
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search roles, companies, or keywords"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 pl-9 transition-colors font-bold text-[#0F172A]"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          {searchInput && (
            <button onClick={() => setSearchInput("")} className="absolute right-3 top-2.5 hover:text-slate-600"><X className="w-3.5 h-3.5 text-slate-400" /></button>
          )}
        </div>
      </div>

      {/* Role searchable dropdown */}
      <div className="w-full md:w-56 relative" ref={roleDropdownRef}>
        <button
          type="button"
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-4 text-xs focus:outline-none hover:bg-slate-50 transition-colors flex items-center justify-between font-bold text-[#0F172A]"
        >
          <span className="truncate">{filters.role || "Role Type"}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
        </button>

        {isRoleDropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-2 space-y-2 max-h-60 overflow-y-auto">
            <input
              type="text"
              value={roleSearchText}
              onChange={(e) => setRoleSearchText(e.target.value)}
              placeholder="Search target role..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-bold"
            />
            <div className="space-y-0.5 max-h-44 overflow-y-auto">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, role: "" }));
                  setIsRoleDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-md transition-colors"
              >
                Clear Selector
              </button>
              {filteredRoles.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, role: r }));
                    setIsRoleDropdownOpen(false);
                    setRoleSearchText("");
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md font-bold transition-colors block truncate ${
                    filters.role === r ? "bg-emerald-50 text-[#10B981]" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {r}
                </button>
              ))}
              {filteredRoles.length === 0 && (
                <p className="text-[10px] text-slate-400 p-2 text-center">No options match</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Location Search Input */}
      <div className="w-full md:w-48 relative">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="City, state, or country"
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 pl-9 transition-colors font-bold text-[#0F172A]"
        />
        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        {locationInput && (
          <button onClick={() => setLocationInput("")} className="absolute right-3 top-2.5 hover:text-slate-600"><X className="w-3.5 h-3.5 text-slate-400" /></button>
        )}
      </div>

      {/* Experience level select */}
      <div className="w-full md:w-36">
        <select
          value={filters.experience}
          onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-bold text-[#0F172A] appearance-none"
        >
          <option value="">Any Level</option>
          <option value="Internship">Internship</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Junior">Junior</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </select>
      </div>

      {/* Job type select */}
      <div className="w-full md:w-36">
        <select
          value={filters.jobType}
          onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-bold text-[#0F172A] appearance-none"
        >
          <option value="">Any Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* Remote Only Toggle */}
      <div className="flex items-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl py-1.5 px-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Remote Only</span>
        <button
          type="button"
          onClick={() => setFilters(prev => ({ ...prev, remoteOnly: !prev.remoteOnly }))}
          className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${filters.remoteOnly ? "bg-emerald-500" : "bg-slate-300"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${filters.remoteOnly ? "left-4.5" : "left-0.5"}`} />
        </button>
      </div>

      {/* Clear Filters CTA */}
      <button
        onClick={resetAllFilters}
        className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        title="Clear filters"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reset
      </button>
    </>
  );

  // Auth Loading state
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-500">Authenticating user...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pb-16 flex flex-col space-y-8">
        
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Job Board</h1>
            <p className="text-sm text-[#64748B] font-semibold mt-1">
              Discover jobs and internships tailored to your goals.
            </p>
          </div>
          
          {/* Tablet/Mobile filters triggers */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 py-2.5 px-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm text-slate-600 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black uppercase">Filters drawer</span>
            </button>
          </div>
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <button 
              onClick={() => setIsTabletAccordionOpen(!isTabletAccordionOpen)}
              className="py-2.5 px-5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm text-slate-600 flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-black uppercase">{isTabletAccordionOpen ? "Hide filters" : "Show filters"}</span>
            </button>
          </div>
        </div>

        {/* Sticky Filters Bar (Desktop Row Layout) */}
        <div className="hidden lg:block sticky top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] py-4 shadow-sm -mx-8 px-8">
          <div className="max-w-[1280px] mx-auto flex items-center gap-3">
            {renderFilterControls()}
          </div>
        </div>

        {/* Tablet Collapsible Accordion (Expanded State) */}
        {isTabletAccordionOpen && (
          <div className="hidden md:block lg:hidden bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderFilterControls()}
            </div>
          </div>
        )}

        {/* ── Top Personalized Matches Section ── */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            Top Personalized Matches
          </h2>
          
          {needsResume ? (
            // Callout Prompt when resume does not exist
            <div className="bg-gradient-to-tr from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Personalized scoring is locked</h3>
                  <p className="text-xs text-[#64748B] font-semibold mt-0.5">
                    Upload your resume to unlock personalized job recommendations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/resume-upload")}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
              >
                Upload Resume
              </button>
            </div>
          ) : isRecLoading ? (
            // Recommendations Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : recommendationsData?.jobs && recommendationsData.jobs.length > 0 ? (
            // Recommendations list (Top 10)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendationsData.jobs.map((job: any) => (
                <JobCard 
                  key={`rec-${job.id}`} 
                  job={job} 
                  isSaved={savedJobIds.has(job.id)} 
                  toggleSaveJob={toggleSaveJob}
                  onClick={setSelectedJob}
                />
              ))}
            </div>
          ) : (
            // Recommendations fallback message
            <p className="text-xs text-slate-400 italic font-semibold">No matches analyzed yet.</p>
          )}
        </div>

        {/* ── FEATURED SECTIONS CAROUSELS (Only visible when unfiltered) ── */}
        {!hasActiveFilters && (
          <div className="space-y-10">
            
            {/* Carousel 1: Trending Internships */}
            {carousels.trending.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Trending Internships
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Scroll Horizontal →</span>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-3">
                  {carousels.trending.map((job: any) => (
                    <div key={`trend-${job.id}`} className="min-w-[310px] max-w-[340px] shrink-0">
                      <JobCard 
                        job={job} 
                        isSaved={savedJobIds.has(job.id)} 
                        toggleSaveJob={toggleSaveJob}
                        onClick={setSelectedJob}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carousel 2: Remote Jobs */}
            {carousels.remote.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Remote Opportunities
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Scroll Horizontal →</span>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-3">
                  {carousels.remote.map((job: any) => (
                    <div key={`remote-${job.id}`} className="min-w-[310px] max-w-[340px] shrink-0">
                      <JobCard 
                        job={job} 
                        isSaved={savedJobIds.has(job.id)} 
                        toggleSaveJob={toggleSaveJob}
                        onClick={setSelectedJob}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carousel 3: Top Companies Hiring */}
            {carousels.companies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-500" />
                    Top Companies Hiring
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Scroll Horizontal →</span>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-3">
                  {carousels.companies.map((job: any) => (
                    <div key={`comp-${job.id}`} className="min-w-[310px] max-w-[340px] shrink-0">
                      <JobCard 
                        job={job} 
                        isSaved={savedJobIds.has(job.id)} 
                        toggleSaveJob={toggleSaveJob}
                        onClick={setSelectedJob}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carousel 4: Recently Posted */}
            {carousels.recent.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-teal-500" />
                    Recently Posted
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Scroll Horizontal →</span>
                </div>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-3">
                  {carousels.recent.map((job: any) => (
                    <div key={`recent-${job.id}`} className="min-w-[310px] max-w-[340px] shrink-0">
                      <JobCard 
                        job={job} 
                        isSaved={savedJobIds.has(job.id)} 
                        toggleSaveJob={toggleSaveJob}
                        onClick={setSelectedJob}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Main Opportunities Listings Grid ── */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <div>
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
                {hasActiveFilters ? "Search Results" : "Explore All Opportunities"}
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Always displaying {totalJobs > 50 ? "50-60+" : totalJobs} verified jobs.
              </p>
            </div>
            
            {!loading && !feedError && (
              <span className="text-xs font-black text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
                {totalJobs} listings
              </span>
            )}
          </div>

          {/* Feed States */}
          {feedError ? (
            <JobErrorState onRetry={() => fetchJobsFeed(page, true)} />
          ) : loading && jobs.length === 0 ? (
            // Initial Skeleton Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            // Custom Empty State
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Filter className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">No opportunities matched your filters</h3>
              <p className="text-[#64748B] text-xs font-semibold mb-6 max-w-sm leading-relaxed">
                Try changing your search parameters, exploring remote roles, or resetting your filter fields.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resetAllFilters}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-extrabold py-2.5 px-6 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, role: "Software Engineer Intern" }))}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Explore Trending Roles
                </button>
              </div>
            </div>
          ) : (
            // Unified Jobs Listings list
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job: any) => (
                  <JobCard 
                    key={`feed-${job.id}`} 
                    job={job} 
                    isSaved={savedJobIds.has(job.id)} 
                    toggleSaveJob={toggleSaveJob}
                    onClick={setSelectedJob}
                  />
                ))}
              </div>

              {/* Infinite Scroll / Interaction Trigger */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={loadMoreJobs}
                    disabled={loading}
                    className="bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-emerald-300 text-slate-700 font-extrabold py-3 px-8 rounded-xl shadow-sm transition-all text-xs flex items-center gap-2 cursor-pointer disabled:opacity-55"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        Load More Opportunities
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ── Details Side Drawer Overlay ── */}
      <JobDetailsDrawer 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
        toggleSaveJob={toggleSaveJob}
      />

      {/* ── Mobile Slide-Up Bottom Sheet Filters Modal ── */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden flex items-end justify-center"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div 
            className="bg-white rounded-t-[32px] w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag Handle Bar */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0F172A]">Filter Options</h3>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {renderFilterControls()}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
