"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, MapPin, ArrowRight } from "lucide-react";
import { getLearningPathsAction, getCompletedMilestonesAction, toggleMilestoneCompletionAction } from "@/app/actions/pathways";
import { useToast } from "@/components/Providers";

interface LearningPathsProps {
  userId: string;
  targetRole: string;
}

export default function LearningPaths({ userId, targetRole }: LearningPathsProps) {
  const [paths, setPaths] = useState<any[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId && targetRole) {
      loadData();
    }
  }, [userId, targetRole]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const p = await getLearningPathsAction(userId, targetRole);
      setPaths(p);
      
      const comp = await getCompletedMilestonesAction(userId);
      setCompletedMilestones(comp.map((c: any) => c.skillName));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompletion = async (milestoneId: string, title: string) => {
    const isCompleted = completedMilestones.includes(milestoneId);
    const newStatus = !isCompleted;
    
    // Optimistic UI update
    if (newStatus) {
      setCompletedMilestones(prev => [...prev, milestoneId]);
    } else {
      setCompletedMilestones(prev => prev.filter(m => m !== milestoneId));
    }

    try {
      await toggleMilestoneCompletionAction(userId, milestoneId, newStatus);
      if (newStatus) {
        toast(`Completed: ${title}`, "success");
      }
    } catch (e) {
      toast("Failed to update progress", "error");
      // Revert on error
      if (isCompleted) {
        setCompletedMilestones(prev => [...prev, milestoneId]);
      } else {
        setCompletedMilestones(prev => prev.filter(m => m !== milestoneId));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Generating roadmap for {targetRole}...</p>
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-[20px] p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No active roadmap for {targetRole}</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          We generate personalized week-by-week roadmaps based on your skill gaps. Run a Skill Gap Analysis to generate this roadmap.
        </p>
      </div>
    );
  }

  const completedCount = paths.filter(p => completedMilestones.includes(p.id)).length;
  const progressPercent = Math.round((completedCount / paths.length) * 100);

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div>
          <h2 className="text-[22px] font-black text-[#111827] mb-1">{targetRole} Learning Path</h2>
          <p className="text-[14px] font-medium text-[#64748B]">Based on your personalized skill gaps.</p>
        </div>
        <div className="flex items-center gap-8 md:gap-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Duration</p>
            <p className="text-[24px] font-black text-[#111827]">{paths.length} <span className="text-[13px] text-slate-500 font-bold">Weeks</span></p>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Completed</p>
            <p className="text-[24px] font-black text-[#111827]">{completedCount}/{paths.length}</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#14B8A6] transition-all duration-1000 ease-out" strokeDasharray={`${progressPercent}, 100`} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-[13px] font-black text-[#111827]">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {paths.map((step, index) => {
          const isCompleted = completedMilestones.includes(step.id);
          return (
            <div 
              key={step.id} 
              className={`bg-white border rounded-[20px] p-6 shadow-sm transition-all duration-300 relative overflow-hidden group
                ${isCompleted ? 'border-[#14B8A6] bg-[#14B8A6]/5' : 'border-[#E5E7EB] hover:border-[#14B8A6]/50 hover:shadow-md'}
              `}
            >
              {isCompleted && <div className="absolute top-0 right-0 w-1.5 h-full bg-[#14B8A6]" />}
              <div className="flex gap-5">
                <div className="flex flex-col items-center gap-2 mt-1 shrink-0">
                  <button 
                    onClick={() => toggleCompletion(step.id, step.title)}
                    className="focus:outline-none"
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </button>
                  {index !== paths.length - 1 && (
                    <div className={`w-0.5 h-full min-h-[40px] rounded-full ${isCompleted ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                  )}
                </div>
                
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className={`text-[17px] font-bold tracking-tight ${isCompleted ? 'text-[#111827]' : 'text-[#111827]'}`}>{step.title}</h3>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md ${isCompleted ? 'bg-[#14B8A6]/10 text-[#0d9488]' : 'bg-slate-100 text-slate-600'}`}>
                      Week {step.week}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-slate-500 mb-5 leading-relaxed">{step.description}</p>
                  
                  {step.resources && step.resources.length > 0 && (
                    <div className="bg-[#F8FAFC] border border-slate-200 rounded-[16px] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Recommended Resources</p>
                      <div className="space-y-1.5">
                        {step.resources.map((res: string, i: number) => {
                          const getResourceLabel = (url: string) => {
                            const lower = url.toLowerCase();
                            if (lower.includes("coursera.org")) return "Coursera Course";
                            if (lower.includes("udemy.com")) return "Udemy Course";
                            if (lower.includes("geeksforgeeks.org")) return "GeeksforGeeks Guide";
                            if (lower.includes("leetcode.com")) return "LeetCode Practice";
                            if (lower.includes("codechef.com")) return "CodeChef Practice";
                            if (lower.includes("hackerrank.com")) return "HackerRank Practice";
                            if (lower.includes("freecodecamp.org")) return "freeCodeCamp Tutorial";
                            if (lower.includes("developer.mozilla.org")) return "MDN Web Docs";
                            if (lower.includes("explore.skillbuilder.aws")) return "AWS Skill Builder";
                            if (lower.includes("learn.microsoft.com")) return "Microsoft Learn";
                            if (lower.includes("cloudskillsboost.google")) return "Google Cloud Skills Boost";
                            if (lower.includes("huggingface.co")) return "Hugging Face Course";
                            if (lower.includes("platform.openai.com")) return "OpenAI Documentation";
                            if (lower.includes("python.langchain.com")) return "LangChain Documentation";
                            if (lower.includes("tensorflow.org")) return "TensorFlow Documentation";
                            if (lower.includes("pytorch.org")) return "PyTorch Documentation";
                            if (lower.includes("tryhackme.com")) return "TryHackMe Lab";
                            if (lower.includes("hackthebox.com") || lower.includes("hackerthebox.com")) return "Hack The Box Academy";
                            if (lower.includes("academy.hubspot.com")) return "HubSpot Academy";
                            return "Official Resource";
                          };
                          return (
                            <a 
                              key={i} 
                              href={res} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
                            >
                              <ArrowRight className="w-3 h-3" /> {getResourceLabel(res)}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
