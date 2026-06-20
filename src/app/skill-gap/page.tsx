"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Award,
  Zap,
  Briefcase,
  BookOpen,
  UploadCloud,
  FileText,
  X
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { 
  getLatestSkillGapAction
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

  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [skillGap, setSkillGap] = useState<any>(null);
  const [jobInsights, setJobInsights] = useState<any>(null);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = (session?.user as any)?.id || "demo-user-123";

  useEffect(() => {
    if (session?.user) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      const latestGap = await getLatestSkillGapAction(userId);
      if (latestGap) {
        setTargetRole(latestGap.targetRole);
        setSkillGap(latestGap);
        fetchJobInsights(latestGap.targetRole);
      }
    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".pdf") && !selectedFile.name.endsWith(".docx")) {
      toast("Please upload a PDF or DOCX file.", "error");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast("File must be less than 5MB.", "error");
      return;
    }
    setFile(selectedFile);
  };
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    const finalRole = targetRole === "Custom" ? customRole : targetRole;
    if (!finalRole || !file) {
      toast("Please upload a resume and select a target role.", "error");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetRole", finalRole);

      const response = await fetch("/api/skill-gap/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSkillGap(data.gap);
      fetchJobInsights(finalRole);
      
      toast("Skill Gap Analysis Complete!", "success");
    } catch (e: any) {
      console.error(e);
      toast(e.message || "Failed to analyze skill gap", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchJobInsights = async (role: string) => {
    try {
      const res = await fetch(`/api/jobs?search=${encodeURIComponent(role)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        const jobs = data.jobs || [];
        
        // Calculate dynamic salary range from database matching jobs
        const jobsWithSalary = jobs.filter((j: any) => j.salaryMin || j.salaryMax);
        let salaryText = "";
        if (jobsWithSalary.length > 0) {
          const avgMin = Math.round(jobsWithSalary.reduce((sum: number, j: any) => sum + (j.salaryMin || 0), 0) / jobsWithSalary.length);
          const avgMax = Math.round(jobsWithSalary.reduce((sum: number, j: any) => sum + (j.salaryMax || 0), 0) / jobsWithSalary.length);
          salaryText = `$${Math.round(avgMin / 1000)}k - $${Math.round(avgMax / 1000)}k`;
        } else {
          let base = 80000;
          if (role.toLowerCase().includes("senior") || role.toLowerCase().includes("lead") || role.toLowerCase().includes("architect")) base = 120000;
          else if (role.toLowerCase().includes("data") || role.toLowerCase().includes("engineer") || role.toLowerCase().includes("ai")) base = 100000;
          salaryText = `$${Math.round(base * 0.8 / 1000)}k - $${Math.round(base * 1.2 / 1000)}k`;
        }

        // Extract top companies dynamically from database matching jobs
        const companies: string[] = Array.from(new Set(jobs.map((j: any) => j.company) as string[])).slice(0, 4);
        if (companies.length === 0) {
          companies.push("Vercel", "Stripe", "OpenAI");
        }

        setJobInsights({
          count: data.total > 0 ? data.total : 0,
          salary: salaryText,
          topCompanies: companies
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
            <p className="text-[#64748B] text-sm font-semibold mt-1">Discover missing skills and create a personalized learning plan.</p>
          </div>
        </div>

        {/* Configurations Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Step 1: Upload */}
          <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-500" /> 1. Upload Resume
            </h3>
            
            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${isDragging ? "text-emerald-500" : "text-slate-400"}`} />
                <p className="text-sm font-bold text-slate-700 mb-1">Drag & Drop your resume here</p>
                <p className="text-xs font-semibold text-slate-500">Supports PDF & DOCX (Max 5MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded border border-emerald-200 bg-emerald-50 transition-colors">
                    Replace
                  </button>
                  <button onClick={handleRemoveFile} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Target Role */}
          <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-500" /> 2. Select Target Role
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      if (e.target.value !== "Custom") setCustomRole("");
                    }}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 pl-10 transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a Target Role...</option>
                    {TARGET_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                    <option value="Custom">Other (Custom Role)</option>
                  </select>
                  <Target className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                </div>
                
                {targetRole === "Custom" && (
                  <input 
                    type="text"
                    placeholder="Enter specific role (e.g. Cloud Architect)"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={(!targetRole || (targetRole === "Custom" && !customRole)) || !file || isAnalyzing}
              className="w-full px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mt-4"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Skills...
                </>
              ) : (
                "Analyze Skills"
              )}
            </button>
          </div>
        </div>

        {!skillGap ? (
          /* Empty State */
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] min-h-[350px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No skill analysis available</h3>
            <p className="text-[#64748B] text-sm max-w-sm mb-6">
              Complete an ATS analysis to identify missing skills.
            </p>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            


            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Link href={`/jobs?search=${encodeURIComponent(skillGap.targetRole)}`} className="block w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-center text-xs font-bold rounded-xl transition-colors">
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
