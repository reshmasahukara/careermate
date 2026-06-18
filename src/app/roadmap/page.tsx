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
  Award,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Search,
  Clock,
  PlayCircle,
  Briefcase
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { MOCK_CAREER_PATHS } from "@/lib/constants/roadmaps";

export default function LearningRoadmapPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [careerPaths, setCareerPaths] = useState<any[]>(MOCK_CAREER_PATHS);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterDuration, setFilterDuration] = useState("");

  const handleSelectPath = async (path: any) => {
    setIsGenerating(true);
    try {
      const userId = (session?.user as any)?.id || "demo-user-123";
      // Dynamically import the action to avoid server component errors
      const { generateRoadmapAction } = await import("@/app/actions/skills");
      
      const newPath = await generateRoadmapAction(userId, path.targetRole);
      
      setSelectedPath({
        ...path,
        id: newPath.id
      });
      setMilestones(JSON.parse(newPath.roadmapData));
      toast("Roadmap generated and saved to your profile!", "success");
    } catch (e) {
      console.error(e);
      toast("Failed to generate roadmap", "error");
    } finally {
      setIsGenerating(false);
    }
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

  const getDerivedFields = (targetRole: string) => {
    const difficulty = targetRole.includes("Senior") || targetRole.includes("Lead") || targetRole.includes("Architect") ? "Advanced" : 
                       targetRole.includes("Intern") || targetRole.includes("Junior") ? "Beginner" : "Intermediate";
    
    const domain = targetRole.includes("Data") || targetRole.includes("AI") || targetRole.includes("Machine Learning") ? "Data & AI" :
                   targetRole.includes("Design") || targetRole.includes("UX") ? "Design" :
                   targetRole.includes("Product") || targetRole.includes("Scrum") ? "Product & Management" :
                   targetRole.includes("Security") || targetRole.includes("Cyber") ? "Security" : "Engineering";
    
    // Mock duration based on targetRole string length as a deterministic pseudo-randomizer
    const durMod = targetRole.length % 3;
    const duration = durMod === 0 ? "Long (> 24 weeks)" : durMod === 1 ? "Medium (12-24 weeks)" : "Short (< 12 weeks)";
    const estWeeks = durMod === 0 ? 32 : durMod === 1 ? 16 : 8;

    return { difficulty, domain, duration, estWeeks };
  };

  const filteredPaths = careerPaths.filter((path) => {
    const { difficulty, domain, duration } = getDerivedFields(path.targetRole);
    
    const matchesSearch = path.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty ? difficulty === filterDifficulty : true;
    const matchesDomain = filterDomain ? domain === filterDomain : true;
    const matchesDuration = filterDuration ? duration === filterDuration : true;

    return matchesSearch && matchesDifficulty && matchesDomain && matchesDuration;
  });

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Learning Roadmap</h1>
          <p className="text-[#64748B] text-sm font-semibold mt-1">Discover, plan, and track your career progression timeline.</p>
        </div>

        {!selectedPath ? (
          /* Explore View (Empty State / Directory) */
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col xl:flex-row gap-4 items-end sticky top-24 z-10">
              <div className="w-full xl:flex-1 space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Search Roles</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Frontend Engineer, Product Manager"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 pl-10 transition-colors"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>
              <div className="w-full xl:w-48 space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Domain</label>
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">All Domains</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Design">Design</option>
                  <option value="Product & Management">Product & Management</option>
                  <option value="Security">Security</option>
                </select>
              </div>
              <div className="w-full xl:w-48 space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Duration</label>
                <select
                  value={filterDuration}
                  onChange={(e) => setFilterDuration(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Any Length</option>
                  <option value="Short (< 12 weeks)">Short (&lt; 12 weeks)</option>
                  <option value="Medium (12-24 weeks)">Medium (12-24 weeks)</option>
                  <option value="Long (> 24 weeks)">Long (&gt; 24 weeks)</option>
                </select>
              </div>
              <div className="w-full xl:w-48 space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Career Path Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => {
                const { difficulty, domain, duration, estWeeks } = getDerivedFields(path.targetRole);
                return (
                  <div key={path.id} className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Compass className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-[6px] ${
                          difficulty === "Advanced" ? "bg-purple-100 text-purple-700" :
                          difficulty === "Beginner" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-[#0F172A] leading-tight mb-2">{path.targetRole}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">{domain}</span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">{duration}</span>
                      </div>
                      <p className="text-sm text-[#64748B] mb-6 line-clamp-2">
                        {path.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectPath(path)}
                      disabled={isGenerating}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors border border-slate-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? "Generating..." : (
                        <>View Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            {filteredPaths.length === 0 && (
              <div className="text-center py-20 text-slate-500 font-semibold bg-white rounded-[20px] border border-slate-200 shadow-sm">
                No career paths found matching your criteria. Try adjusting your search.
              </div>
            )}
            
          </div>
        ) : (
          /* Timeline View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Timeline (col 8) */}
            <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm">
              <button 
                onClick={handleBackToExplore}
                className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-8 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Explore
              </button>

              <div className="mb-8 border-b border-slate-100 pb-8">
                <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{selectedPath.targetRole} Roadmap</h2>
                <p className="text-[#64748B] text-sm mt-2 max-w-2xl">{selectedPath.description}</p>
                <div className="flex gap-4 mt-6">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Clock className="w-4 h-4 text-slate-400" /> {getDerivedFields(selectedPath.targetRole).estWeeks} Weeks Est.
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <BookOpen className="w-4 h-4 text-slate-400" /> {milestones.length} Modules
                  </span>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-4 md:pl-0">
                <div className="absolute left-[15px] md:left-[39px] top-4 bottom-8 w-0.5 bg-slate-100" />
                
                <div className="space-y-12">
                  {milestones.map((milestone, idx) => {
                    const isCompleted = milestone.status === "completed";
                    const isInProgress = milestone.status === "in-progress";

                    return (
                      <div key={idx} className="relative flex items-start gap-6 group">
                        
                        {/* Timeline Node */}
                        <div className={`relative z-10 w-8 h-8 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center border-4 border-white ${
                          isCompleted ? "bg-emerald-500 text-white" :
                          isInProgress ? "bg-blue-500 text-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "bg-slate-200 text-slate-400"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8" /> : 
                           isInProgress ? <PlayCircle className="w-4 h-4 md:w-8 md:h-8" /> : 
                           <span className="text-xs md:text-xl font-bold">{idx + 1}</span>}
                        </div>

                        {/* Content Card */}
                        <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                          isCompleted ? "bg-emerald-50/30 border-emerald-100" :
                          isInProgress ? "bg-white border-blue-200 shadow-md" : "bg-white border-slate-100 hover:border-slate-300"
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module {milestone.week}</span>
                                {isCompleted && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Completed</span>}
                                {isInProgress && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">In Progress</span>}
                              </div>
                              <h3 className={`text-lg font-bold ${isCompleted ? "text-slate-600 line-through decoration-emerald-300" : "text-[#0F172A]"}`}>
                                {milestone.title}
                              </h3>
                            </div>
                            <button
                              onClick={() => toggleMilestoneStatus(milestone.week)}
                              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                isCompleted ? "bg-white text-slate-500 border-slate-200 hover:bg-slate-50" :
                                isInProgress ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                              }`}
                            >
                              {isCompleted ? "Mark Incomplete" : isInProgress ? "Complete Module" : "Start Module"}
                            </button>
                          </div>
                          <p className={`text-sm ${isCompleted ? "text-slate-400" : "text-slate-600"}`}>
                            {milestone.description}
                          </p>
                          
                          {/* Recommended Resources */}
                          {!isCompleted && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-500" /> Recommended Resource
                              </p>
                              <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4 text-slate-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">Advanced Patterns Guide</p>
                                    <p className="text-xs text-slate-500">Read time: 45 mins</p>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Progress Summary (col 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm space-y-6 sticky top-24">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Your Progress</h3>
                  <p className="text-xs text-slate-500">Track your milestones towards this role.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-600">Completion</span>
                    <span className="text-blue-600">{Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(milestones.filter(m => m.status === 'completed').length / milestones.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 text-right mt-1">
                    {milestones.filter(m => m.status === 'completed').length} of {milestones.length} modules
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Next Action</h4>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="font-bold text-amber-800 text-sm mb-1">Resume In-Progress Module</p>
                    <p className="text-xs text-amber-700/80 mb-3">Continue working on Module 2: Intermediate Concepts.</p>
                    <button className="w-full py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors">
                      Resume Learning
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
