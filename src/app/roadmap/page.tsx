"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  ChevronLeft,
  Search,
  PlayCircle,
  Briefcase
} from "lucide-react";
import { useToast } from "@/components/Providers";

export default function LearningRoadmapPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      const userId = (session?.user as any)?.id || "demo-user-123";
      try {
        const { getAllUserRoadmapsAction } = await import("@/app/actions/skills");
        const maps = await getAllUserRoadmapsAction(userId);
        setCareerPaths(maps);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (session) fetchRoadmaps();
  }, [session]);

  const handleSelectPath = (path: any) => {
    setSelectedPath(path);
    setMilestones(path.steps);
  };

  const handleBackToExplore = () => {
    setSelectedPath(null);
    setMilestones([]);
  };

  const toggleMilestoneStatus = (weekNum: number) => {
    const updated = milestones.map((m) => {
      if (m.week === weekNum) {
        const nextStatus = m.status === "completed" ? "pending" : "completed";
        return { ...m, status: nextStatus };
      }
      return m;
    });

    setMilestones(updated);
    
    // Optimistic progress feedback toast
    const changingItem = milestones.find((m) => m.week === weekNum);
    const wasCompleted = changingItem?.status === "completed";
    toast(
      wasCompleted
        ? `Milestone Week ${weekNum} marked incomplete.`
        : `Congratulations on finishing Week ${weekNum} target!`,
      wasCompleted ? "info" : "success"
    );
  };

  const filteredPaths = careerPaths.filter((path) => {
    return path.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Learning Roadmap</h1>
          <p className="text-[#64748B] text-sm font-semibold mt-1">Discover, plan, and track your career progression timeline.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-2xl w-full" />)}
          </div>
        ) : !selectedPath ? (
          /* Explore View */
          <div className="space-y-6">
            
            {/* Search */}
            <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col xl:flex-row gap-4 items-end sticky top-24 z-10">
              <div className="w-full xl:flex-1 space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Search Roles</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 pl-10 transition-colors"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>
            </div>

            {careerPaths.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Roadmaps Generated</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Complete your profile and run a skill gap analysis to automatically generate a personalized learning roadmap.
                </p>
                <Link
                  href="/skill-gap"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md"
                >
                  Analyze Skill Gap
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPaths.map((path) => (
                  <div key={path.id} className="bg-white p-5 rounded-[20px] border border-[#E2E8F0] hover:border-emerald-500 hover:shadow-lg transition-all group cursor-pointer" onClick={() => handleSelectPath(path)}>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{path.targetRole}</h3>
                    <p className="text-sm text-[#64748B] mb-4 line-clamp-2">{path.description}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-[#0F172A]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-[#64748B]" /> {path.steps.length} Weeks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Roadmap Detail View */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={handleBackToExplore} className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Roadmaps
            </button>

            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg border border-emerald-800">
              <Sparkles className="absolute top-4 right-6 w-24 h-24 text-white opacity-5" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5" /> Your Path
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">{selectedPath.targetRole}</h2>
                <p className="text-emerald-100/80 text-sm sm:text-base mb-6 leading-relaxed">
                  {selectedPath.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-emerald-50">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-emerald-400" /> {milestones.length} Weeks</div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {milestones.map((m: any, idx: number) => {
                const isCompleted = m.status === "completed";
                const isNext = milestones.findIndex(mi => mi.status !== "completed") === idx;
                
                return (
                  <div key={m.week} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <button onClick={() => toggleMilestoneStatus(m.week)} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all shadow-sm ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : isNext ? "bg-white border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" : "bg-white border-[#CBD5E1] text-[#94A3B8] group-hover:border-emerald-300"}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{m.week}</span>}
                      </button>
                      {idx !== milestones.length - 1 && (
                        <div className={`w-0.5 h-full my-2 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-[#E2E8F0]"}`} />
                      )}
                    </div>

                    <div className={`flex-1 bg-white rounded-2xl p-6 border transition-all ${isCompleted ? "border-emerald-200 shadow-sm opacity-80" : isNext ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20" : "border-[#E2E8F0] shadow-sm hover:border-emerald-300 hover:shadow-md"} mb-2`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className={`text-lg font-bold ${isCompleted ? "text-slate-500 line-through decoration-emerald-500/30" : "text-[#0F172A]"}`}>{m.title}</h4>
                          <p className={`text-sm mt-1.5 leading-relaxed ${isCompleted ? "text-slate-400" : "text-[#64748B]"}`}>{m.focus}</p>
                        </div>
                        <div className="flex gap-2">
                          {m.resources.map((link: string, i: number) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isCompleted ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"}`}>
                              {link.includes("youtube") ? <PlayCircle className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                              Resource
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className={`mt-4 p-4 rounded-xl border ${isCompleted ? "bg-slate-50 border-slate-100" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Topics</div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isCompleted ? "bg-white text-slate-400" : "bg-white text-[#334155] border border-[#E2E8F0] shadow-sm"}`}>
                            {m.topic}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
