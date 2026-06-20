"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { Target, Compass, Book, Award, CheckSquare, Sparkles, BookOpen } from "lucide-react";
import LearningPaths from "@/components/career-pathways/LearningPaths";
import LearningResources from "@/components/career-pathways/LearningResources";
import SearchableRoleDropdown from "@/components/career-pathways/SearchableRoleDropdown";
import { getUserActivePathAction, saveUserPathAction } from "@/app/actions/pathways";
import { CAREER_PATHS_DATA } from "@/lib/constants/careerPathsData";
import { useToast } from "@/components/Providers";

export default function CareerPathwaysPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "demo-user-123";
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"paths" | "resources">("paths");
  const [targetRole, setTargetRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      loadActivePath();
    }
  }, [userId]);

  const loadActivePath = async () => {
    setIsLoading(true);
    try {
      const activePath = await getUserActivePathAction(userId);
      if (activePath && activePath.targetRole) {
        setTargetRole(activePath.targetRole);
      } else {
        setTargetRole(""); // Empty state triggers selection prompt
      }
    } catch (error) {
      console.error("Failed to load active career path", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (newRole: string) => {
    if (isSaving) return;
    setIsSaving(true);
    toast(`Generating roadmap for ${newRole}...`, "info");
    try {
      const res = await saveUserPathAction(userId, newRole);
      if (res && res.success) {
        setTargetRole(newRole);
        toast(`Success! Saved ${newRole} as your target career.`, "success");
      } else {
        toast("Failed to save career path selection.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("Error saving selection.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Get metadata from CAREER_PATHS_DATA for the selected role
  const activePathDetails = targetRole ? CAREER_PATHS_DATA[targetRole] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Career Pathways</h1>
            <p className="text-[#64748B] text-sm font-semibold mt-1">Bridge the gap between your skills and your target career.</p>
          </div>
          
          {/* Grouped Searchable Selector */}
          <div className="w-full md:w-[320px] shrink-0">
            <SearchableRoleDropdown 
              selectedValue={targetRole} 
              onSelect={handleRoleSelect} 
              disabled={isSaving}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm font-bold">Loading pathways data...</p>
          </div>
        ) : !targetRole ? (
          /* Empty State: Prompt User to Select a Career Path */
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] min-h-[420px] flex flex-col items-center justify-center p-8 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-2xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -z-10" />
            
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100/50 shadow-inner">
              <Compass className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-3">
              Generate Your Roadmap
            </h3>
            <p className="text-[#64748B] text-sm max-w-md mb-8 font-semibold leading-relaxed">
              Select a career path to generate your personalized roadmap and learning resources.
            </p>
            
            {/* Call to action inside empty state */}
            <div className="w-full max-w-[340px]">
              <SearchableRoleDropdown 
                selectedValue={targetRole} 
                onSelect={handleRoleSelect} 
                disabled={isSaving}
              />
            </div>
          </div>
        ) : (
          /* Main Content with Selection Details */
          <div className="space-y-6">
            
            {/* Selected Role Meta Details Banner */}
            {activePathDetails && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Meta Attributes */}
                <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#14B8A6]" />
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-md">
                        {activePathDetails.category}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md 
                        ${activePathDetails.difficulty === "Beginner" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                          activePathDetails.difficulty === "Intermediate" ? "bg-blue-50 text-blue-700 border border-blue-100" : 
                          "bg-purple-50 text-purple-700 border border-purple-100"}`}
                      >
                        {activePathDetails.difficulty} Level
                      </span>
                    </div>
                    <h2 className="text-[28px] font-extrabold text-[#111827] tracking-tight">{activePathDetails.role}</h2>
                  </div>
                  
                  <div className="flex items-center sm:border-l sm:border-slate-100 sm:pl-8">
                    <div className="text-left sm:text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Est. Duration</p>
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-4xl font-black text-[#14B8A6]">{activePathDetails.durationWeeks}</p>
                        <span className="text-[15px] text-slate-500 font-semibold">Weeks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prerequisites Card */}
                <div className="h-full flex flex-col bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#14B8A6]" /> Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {activePathDetails.prerequisites.map((p, i) => (
                      <li key={i} className="text-[14px] font-medium text-slate-600 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] mt-2 shrink-0" />
                        <span className="leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Projects Card */}
                <div className="h-full flex flex-col bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-blue-500" /> Hands-on Projects
                  </h3>
                  <div className="space-y-4">
                    {activePathDetails.projects.map((proj, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[14px] font-bold text-[#111827]">{proj.title}</p>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Card */}
                <div className="h-full flex flex-col bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" /> Certifications
                  </h3>
                  <ul className="space-y-3">
                    {activePathDetails.certifications.map((cert, i) => (
                      <li key={i} className="text-[14px] font-medium text-slate-600 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        <span className="leading-snug">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Tabs Container */}
            <div className="bg-slate-50 border border-[#E5E7EB] rounded-[16px] p-1.5 shadow-sm flex items-center gap-1 w-full mt-8 mb-6">
              <button
                onClick={() => setActiveTab("paths")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer ${
                  activeTab === "paths" 
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                <Target className="w-4 h-4" /> Learning Paths
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer ${
                  activeTab === "resources" 
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                <Book className="w-4 h-4" /> Learning Resources
              </button>
            </div>

            {/* Dynamic Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "paths" ? (
                <LearningPaths userId={userId} targetRole={targetRole} />
              ) : (
                <LearningResources userId={userId} targetRole={targetRole} />
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
