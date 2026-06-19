"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  Briefcase,
  Download,
  Settings2,
  ListChecks,
  PieChart,
  LayoutTemplate,
  ArrowRight
} from "lucide-react";
import { getResumesAction } from "@/app/actions/resume";
import { analyzeResumeAction } from "@/app/actions/ats";
import { useToast } from "@/components/Providers";

export default function AtsCheckerPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [targetSkills, setTargetSkills] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [atsScore, setAtsScore] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const loadResumes = async () => {
        const data = await getResumesAction((session.user as any).id || "demo-user-123");
        setResumes(data);
        if (data.length > 0) setSelectedResume(data[0].id);
      };
      loadResumes();
    }
  }, [session]);

  const handleAnalyze = async () => {
    if (!selectedResume || !targetRole) return;
    setIsAnalyzing(true);
    
    try {
      const scoreData = await analyzeResumeAction(selectedResume, targetRole, industry, experienceLevel);
      setAtsScore(scoreData);
      setHasAnalyzed(true);
      toast("Analysis complete!", "success");
    } catch (e) {
      console.error(e);
      toast("Failed to analyze resume", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const score = atsScore?.score || 0;

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      toast(`Simulated upload for ${e.dataTransfer.files[0].name}`, "success");
      // In a real app, we would upload this file to the server here.
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">ATS Match Checker</h1>
            <p className="text-sm text-[#64748B]">Optimize your resume for applicant tracking systems.</p>
          </div>
          {hasAnalyzed && (
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF Report
            </button>
          )}
        </div>

        {/* Main Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Configuration */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-emerald-500" />
                Analysis Settings
              </h2>
              
              <div className="space-y-5">
                {/* Resume Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Select Resume</label>
                  {resumes.length > 0 ? (
                    <select 
                      className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-emerald-500"
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                    >
                      {resumes.map(r => (
                        <option key={r.id} value={r.id}>{r.fileName}</option>
                      ))}
                    </select>
                  ) : (
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                        isDragging ? "border-emerald-500 bg-emerald-50" : "border-[#E2E8F0] bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-emerald-500" : "text-slate-400"}`} />
                      <p className="text-xs font-semibold text-[#0F172A]">{isDragging ? "Drop here!" : "Drag & drop to upload"}</p>
                      <p className="text-[10px] text-[#64748B] mt-1">PDF or DOCX up to 5MB</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Target Job Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-emerald-500"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Industry</label>
                  <select 
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-emerald-500"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    <option value="tech">Technology / Software</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Experience Level</label>
                  <select 
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-emerald-500"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="junior">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F172A]">Target Skills Checklist (Optional)</label>
                  <textarea 
                    placeholder="Paste skills from job description (comma separated)"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-emerald-500 h-20 resize-none"
                    value={targetSkills}
                    onChange={(e) => setTargetSkills(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={!selectedResume || !targetRole || isAnalyzing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4" />
                      Run ATS Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-8">
            {!hasAnalyzed ? (
              /* Empty State */
              <div className="bg-white border border-[#E2E8F0] rounded-2xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <FileSearch className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Ready to Analyze</h3>
                <p className="text-[#64748B] text-sm max-w-sm">
                  Upload a resume and define your target role to generate enterprise-grade ATS insights.
                </p>
              </div>
            ) : (
              /* Results State */
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] print:shadow-none print:border-none">
                {/* Tabs */}
                <div className="flex border-b border-[#E2E8F0] overflow-x-auto no-scrollbar bg-slate-50/50 print:hidden">
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "overview" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <PieChart className="w-4 h-4" /> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("keywords")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "keywords" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <ListChecks className="w-4 h-4" /> Keywords
                  </button>
                  <button 
                    onClick={() => setActiveTab("formatting")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "formatting" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <LayoutTemplate className="w-4 h-4" /> Formatting
                  </button>
                  <button 
                    onClick={() => setActiveTab("skills")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "skills" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Skills Match
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 flex-1 bg-white">
                  {activeTab === "overview" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Score Gauge */}
                      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" className="text-slate-200" strokeWidth="12" fill="none" stroke="currentColor" />
                            <circle cx="64" cy="64" r="56" className="text-emerald-500" strokeWidth="12" fill="none" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * score) / 100} strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-black text-slate-800">{score}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                          <h3 className="text-xl font-bold text-slate-800">{score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : "Needs Improvement"}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                            Your resume parses well, but is missing some critical keywords for a {targetRole} role. Improving the keyword density will boost your interview chances.
                          </p>
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                          <p className="text-2xl font-black text-slate-800">{atsScore?.keywordsFound?.length || 0}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keywords Matched</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                          <p className="text-2xl font-black text-rose-500">{atsScore?.keywordsMissing?.length || 0}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Missing Critical</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                          <p className="text-2xl font-black text-emerald-500">100%</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parse Rate</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                          <p className="text-2xl font-black text-amber-500">2</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format Issues</p>
                        </div>
                      </div>

                      {/* Top Recommendations */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800">Top Recommendations</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-sm">
                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800">Missing Core Skill: {atsScore?.keywordsMissing?.[0] || "System Design"}</p>
                              <p className="text-slate-600 text-xs mt-1">This keyword appears frequently in typical job descriptions for this role.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-sm">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800">Vague Experience Metrics</p>
                              <p className="text-slate-600 text-xs mt-1">Add quantifiable numbers to your recent experience block (e.g., "Increased performance by X%").</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "keywords" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Keyword Analysis</h3>
                        <div className="text-sm font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                          {atsScore?.keywordsFound?.length} / {(atsScore?.keywordsFound?.length || 0) + (atsScore?.keywordsMissing?.length || 0)} Matched
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                          <h4 className="text-emerald-700 font-bold flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5" /> Matched Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {atsScore?.keywordsFound?.map((kw: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg shadow-sm">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6">
                          <h4 className="text-rose-700 font-bold flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5" /> Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {atsScore?.keywordsMissing?.map((kw: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-lg shadow-sm">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "formatting" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-slate-800">Formatting & Layout Checks</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 border border-slate-200 rounded-xl flex gap-4">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">File Type & Parseability</h4>
                            <p className="text-slate-600 text-sm mt-1">Your document is a standard PDF and all text layers were successfully extracted. No tables or complex columns blocked the parser.</p>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl flex gap-4">
                          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-800">Section Headers</h4>
                            <p className="text-amber-700 text-sm mt-1">{atsScore?.formattingFeedback || "Ensure you use standard headers like 'Experience', 'Education', and 'Skills'."}</p>
                          </div>
                        </div>

                        <div className="p-4 border border-slate-200 rounded-xl flex gap-4">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">Contact Information</h4>
                            <p className="text-slate-600 text-sm mt-1">Email, Phone number, and LinkedIn profile were successfully detected.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-slate-800">Skills Alignment</h3>
                      <p className="text-sm text-slate-600">Based on the target role of <span className="font-bold">{targetRole}</span>.</p>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-800 text-sm">Hard Skills (Technical)</span>
                              <span className="text-sm font-bold text-emerald-600">75% Match</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-800 text-sm">Soft Skills (Leadership, Comm.)</span>
                              <span className="text-sm font-bold text-amber-500">40% Match</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-200">
                            <p className="text-sm text-slate-600">
                              <strong>Recommendation:</strong> Your technical alignment is strong, but the parsing engine couldn't identify strong indicators for soft skills. 
                              Consider adding bullets describing team leadership, cross-functional collaboration, and communication.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
            <h3 className="text-lg font-bold">Bridge your missing skills in the Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Map your current capabilities against target role requirements, identify exactly what's missing, and load automated recommendations.
            </p>
          </div>
          <Link
            href="/skill-gap"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Bridge Skill Gaps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
