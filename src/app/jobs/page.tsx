"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  MapPin,
  Briefcase,
  Heart,
  ExternalLink,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { toggleSaveJobAction, getSavedJobsAction } from "@/app/actions/jobs";
import { MOCK_JOBS } from "@/lib/mockData";
import { getUserSkillsAction } from "@/app/actions/skills";

export default function JobListingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>(MOCK_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"all" | "recommended">("all");

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterRemote, setFilterRemote] = useState<boolean | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      loadSavedJobs();
      loadUserSkills();
    }
  }, [session]);

  const loadSavedJobs = async () => {
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const saved = await getSavedJobsAction(userId);
      setSavedJobIds(saved.map((j) => j.id));
    } catch (e) {
      console.error("Error loading saved jobs:", e);
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

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!session?.user) {
      toast("Please log in to bookmark job postings.", "warning");
      return;
    }

    const userId = (session.user as any).id || "demo-user-123";
    try {
      const isSaved = await toggleSaveJobAction(userId, jobId);
      if (isSaved) {
        setSavedJobIds((prev) => [...prev, jobId]);
        toast("Job saved successfully!", "success");
      } else {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        toast("Job unsaved.", "info");
      }
    } catch (err) {
      toast("Error managing saved jobs.", "error");
    }
  };

  // Filter listings
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = filterLocation
      ? job.location.toLowerCase().includes(filterLocation.toLowerCase())
      : true;

    const matchesExperience = filterExperience
      ? job.experience.toLowerCase() === filterExperience.toLowerCase()
      : true;

    const matchesRemote =
      filterRemote !== null ? job.isRemote === filterRemote : true;

    // Skill recommendation filter
    const matchesSkills =
      activeTab === "recommended"
        ? job.skills.some((s: string) => userSkills.includes(s.toLowerCase()))
        : true;

    return matchesSearch && matchesLocation && matchesExperience && matchesRemote && matchesSkills;
  });

  // Paginated listings
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterLocation("");
    setFilterExperience("");
    setFilterRemote(null);
    setCurrentPage(1);
    toast("Filters reset successfully.", "info");
  };

  return (
    <div className="flex-1 bg-brand-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Job Board</h1>
          <p className="text-slate-500 text-sm mt-1">Explore job postings recommended based on your technical skill profiles.</p>
        </div>

        {/* Tab Switching */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            All Open Positions
          </button>
          
          <button
            onClick={() => {
              setActiveTab("recommended");
              setCurrentPage(1);
              if (userSkills.length === 0) {
                toast("Upload a resume or save skills in Profile to get custom recommendations.", "info");
              }
            }}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "recommended"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Recommended for You
          </button>
        </div>

        {/* Board Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar (col 4) */}
          <div className="lg:col-span-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Filter Roles
              </span>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Keyword Search */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Keyword Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="e.g. Next.js, Stripe, Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary pl-8 text-slate-700 font-semibold"
                  />
                  <Search className="absolute left-2.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              {/* Location selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Location
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => {
                    setFilterLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none font-semibold text-slate-600 focus:bg-white transition-colors"
                >
                  <option value="">All Locations</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="Seattle">Seattle, WA</option>
                  <option value="New York">New York, NY</option>
                </select>
              </div>

              {/* Experience selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <select
                  value={filterExperience}
                  onChange={(e) => {
                    setFilterExperience(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none font-semibold text-slate-600 focus:bg-white transition-colors"
                >
                  <option value="">All Experience</option>
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid">Mid (2-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>

              {/* Remote selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Work Environment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "All", value: null },
                    { label: "Remote", value: true },
                    { label: "Onsite", value: false },
                  ].map((env) => {
                    const isSelected = filterRemote === env.value;
                    return (
                      <button
                        key={env.label}
                        onClick={() => {
                          setFilterRemote(env.value);
                          setCurrentPage(1);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {env.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Job listings (col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-primary/40 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {job.company} • {job.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isSaved
                                ? "bg-rose-50 border-rose-100 text-rose-500"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Required skills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.map((skill: string) => {
                          const matchesUser = userSkills.includes(skill.toLowerCase());
                          return (
                            <span
                              key={skill}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                matchesUser
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                  : "bg-slate-50 border-slate-200/60 text-slate-600"
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>

                      {/* Footer salary info */}
                      <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100/60 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold">
                          <DollarSign className="w-4.5 h-4.5 text-slate-400" />
                          {job.salary}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                    </div>
                  );
                })}

                {/* Pagination bar */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center gap-3">
                <Briefcase className="w-12 h-12 text-slate-300 animate-bounce" />
                <h3 className="font-bold text-slate-800 text-sm">No job positions found</h3>
                <p className="text-slate-500 text-xs">Try clearing search parameters or adjusting active filters.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Detail dialog modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-y-auto max-h-[85vh] border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedJob.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  {selectedJob.company} • {selectedJob.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Salary details bar */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100/60">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4.5 h-4.5 text-primary shrink-0" />
                Salary: {selectedJob.salary}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4.5 h-4.5 text-secondary shrink-0" />
                Type: {selectedJob.type}
              </span>
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                Level: {selectedJob.experience}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Position Overview</h4>
              <p>{selectedJob.description}</p>
            </div>

            {/* Requirements list */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Job Requirements</h4>
              <ul className="space-y-2">
                {selectedJob.requirements.map((req: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-semibold">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA action buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100 justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close details
              </button>
              
              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow shadow-primary/15 transition-colors cursor-pointer"
              >
                Apply Direct
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
