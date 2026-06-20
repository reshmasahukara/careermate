"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart,
  Layers,
  Award,
  Zap,
  Users,
  Briefcase,
  Clock,
  BookOpen,
  RefreshCw,
  Plus
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { 
  getUserSkillsAction, 
  analyzeSkillGapAction,
  syncSkillsFromResumeAction,
  getLatestSkillGapAction,
  getLearningRoadmapAction,
  addUserSkillAction,
  removeUserSkillAction
} from "@/app/actions/skills";

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Product Manager"
];

export default function SkillGapPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [skillGap, setSkillGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [jobInsights, setJobInsights] = useState<any>(null);

  const [newSkill, setNewSkill] = useState("");

  const userId = (session?.user as any)?.id || "demo-user-123";

  useEffect(() => {
    if (session?.user) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      const skills = await getUserSkillsAction(userId);
      setUserSkills(skills);

      const latestGap = await getLatestSkillGapAction(userId);
      if (latestGap) {
        setTargetRole(latestGap.targetRole);
        setSkillGap(latestGap);
        const map = await getLearningRoadmapAction(userId, latestGap.targetRole);
        setRoadmap(map);
        fetchJobInsights(latestGap.targetRole);
      }
    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  const handleSyncResume = async () => {
    setIsSyncing(true);
    try {
      const success = await syncSkillsFromResumeAction(userId);
      if (success) {
        const skills = await getUserSkillsAction(userId);
        setUserSkills(skills);
        toast("Successfully extracted skills from your resume", "success");
      } else {
        toast("Could not find a parsed resume. Please upload one first.", "error");
      }
    } catch (error) {
      toast("Failed to sync skills", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      await addUserSkillAction(userId, newSkill.trim(), "Intermediate");
      setNewSkill("");
      const skills = await getUserSkillsAction(userId);
      setUserSkills(skills);
      toast("Skill added manually", "success");
    } catch (e) {
      toast("Failed to add skill", "error");
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeUserSkillAction(userId, skillId);
      const skills = await getUserSkillsAction(userId);
      setUserSkills(skills);
    } catch (e) {
      toast("Failed to remove skill", "error");
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole) return;
    setIsAnalyzing(true);
    try {
      const gap = await analyzeSkillGapAction(userId, targetRole);
      setSkillGap(gap);
      const map = await getLearningRoadmapAction(userId, targetRole);
      setRoadmap(map);
      fetchJobInsights(targetRole);
      toast("Skill Gap Analysis Complete!", "success");
    } catch (e) {
      console.error(e);
      toast("Failed to analyze skill gap", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchJobInsights = async (role: string) => {
    try {
      const res = await fetch(`/api/jobs?search=${encodeURIComponent(role)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        setJobInsights({
          count: data.total > 500 ? "500+" : data.total,
          salary: role.includes("Data") || role.includes("Engineer") ? "$110k - $160k" : "$90k - $140k",
          topCompanies: ["Google", "Amazon", "Microsoft", "Meta"]
        });
      }
    } catch (e) {
      console.error("Job insights error", e);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Skill Gap Analysis</h1>
            <p className="text-[#64748B] text-sm font-semibold mt-1">Discover your missing skills and get a personalized learning path.</p>
          </div>
          <button 
            onClick={handleSyncResume}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync from Resume
          </button>
        </div>

        {/* Configuration Row */}
        <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1 space-y-2">
            <label className="text-sm font-semibold text-[#0F172A]">Target Role</label>
            <div className="relative">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 pl-10 transition-colors appearance-none"
              >
                <option value="" disabled>Select a Target Role...</option>
                {TARGET_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <Target className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!targetRole || isAnalyzing || userSkills.length === 0}
            className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate Analysis"
            )}
          </button>
        </div>

        {/* Current Skills Manager */}
        <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" /> Current Skills Profile
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {userSkills.map(skill => (
              <span key={skill.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                {skill.name}
                <button onClick={() => handleRemoveSkill(skill.skillId)} className="hover:text-rose-500 transition-colors">
                  &times;
                </button>
              </span>
            ))}
            {userSkills.length === 0 && (
              <span className="text-sm text-slate-400 italic">No skills added yet. Sync from your resume or add manually.</span>
            )}
          </div>
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add skill manually (e.g. React)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500"
            />
            <button onClick={handleAddSkill} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!skillGap ? (
          /* Empty State */
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] min-h-[400px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Discover Your Missing Skills</h3>
            <p className="text-[#64748B] text-sm max-w-sm mb-6">
              Upload your resume or add skills manually, then select a target role to generate a personalized learning roadmap.
            </p>
            {userSkills.length === 0 && (
              <Link href="/resume-upload" className="bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Upload Resume First
              </Link>
            )}
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Match Score</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-black text-[#0F172A]">{skillGap.matchScore}%</h3>
                  <TrendingUp className={`w-5 h-5 mb-1.5 ${skillGap.matchScore > 75 ? 'text-emerald-500' : 'text-amber-500'}`} />
                </div>
              </div>
              <div className="bg-white p-5 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Missing Skills</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-black text-[#0F172A]">{skillGap.criticalSkills.length + skillGap.recommendedSkills.length}</h3>
                  <AlertCircle className="w-5 h-5 mb-1.5 text-rose-500" />
                </div>
              </div>
              <div className="bg-white p-5 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Est. Learning Time</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-black text-[#0F172A]">{roadmap.length}</h3>
                  <span className="text-sm font-bold text-slate-500 mb-1">weeks</span>
                </div>
              </div>
              <div className="bg-white p-5 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Job Readiness</p>
                <div className="flex items-end gap-2">
                  <h3 className={`text-xl font-black ${skillGap.jobReadiness === 'Job Ready' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {skillGap.jobReadiness}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Missing Skills Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm p-6">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-500" /> Identified Skill Gaps
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Critical */}
                    <div>
                      <h4 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4" /> Critical Skills (Required)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.criticalSkills.length > 0 ? skillGap.criticalSkills.map((skill: string) => (
                          <span key={skill} className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-slate-500 italic">No critical gaps!</span>}
                      </div>
                    </div>

                    {/* Recommended */}
                    <div>
                      <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4" /> Recommended Skills (Tools & Tech)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.recommendedSkills.length > 0 ? skillGap.recommendedSkills.map((skill: string) => (
                          <span key={skill} className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-slate-500 italic">No recommended gaps!</span>}
                      </div>
                    </div>

                    {/* Optional */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4" /> Optional Skills (Bonus)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.optionalSkills.length > 0 ? skillGap.optionalSkills.map((skill: string) => (
                          <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-slate-500 italic">No optional gaps!</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Roadmap */}
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm p-6">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" /> Personalized Learning Roadmap
                  </h3>
                  
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {roadmap.map((step: any, index: number) => (
                      <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <span className="font-bold text-sm">{step.week}</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Week {step.week}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{step.description}</p>
                          <div className="space-y-1.5">
                            {step.resources.map((res: string, i: number) => (
                              <a key={i} href={res} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                <ArrowRight className="w-3 h-3" /> External Resource {i+1}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {roadmap.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm font-medium">
                      You are fully equipped for this role! No specific roadmap generated.
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar Insights */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-[20px] p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Market Insights
                  </h3>
                  
                  {jobInsights ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">Active Matching Jobs</p>
                        <p className="text-2xl font-black">{jobInsights.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">Average Salary Range</p>
                        <p className="text-lg font-bold text-emerald-300">{jobInsights.salary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-2">Top Hiring Companies</p>
                        <div className="flex flex-wrap gap-2">
                          {jobInsights.topCompanies.map((c: string) => (
                            <span key={c} className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded border border-white/5">{c}</span>
                          ))}
                        </div>
                      </div>
                      <Link href={`/jobs?search=${encodeURIComponent(targetRole)}`} className="block w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-center text-xs font-bold rounded-xl transition-colors">
                        View Open Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-10 bg-white/10 rounded-lg w-1/2"></div>
                      <div className="h-10 bg-white/10 rounded-lg w-3/4"></div>
                      <div className="h-10 bg-white/10 rounded-lg w-full"></div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
