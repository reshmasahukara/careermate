"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  Users
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getUserSkillsAction } from "@/app/actions/skills";

// Dynamic import for Recharts to avoid SSR issues
import dynamic from 'next/dynamic';
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false });
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

export default function SkillGapPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("technical");

  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      loadUserSkills();
    }
  }, [session]);

  const loadUserSkills = async () => {
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const skills = await getUserSkillsAction(userId);
      setUserSkills(skills);
    } catch (e) {
      console.error("Error loading skills:", e);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole) return;
    setIsAnalyzing(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const data = await import('@/app/actions/skills').then(mod => mod.analyzeSkillGapAction(userId, targetRole));
      setAnalysisData(data);
      setHasAnalyzed(true);
      toast("Analysis complete!", "success");
    } catch (e) {
      console.error(e);
      toast("Failed to analyze skill gap", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMissingSkillsArray = () => {
    return analysisData?.missingSkills || [];
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Skill Gap Analysis</h1>
          <p className="text-[#64748B] text-sm font-semibold mt-1">Compare your current skill set against industry requirements.</p>
        </div>

        {/* Configuration Row */}
        <div className="bg-white p-6 border border-[#E2E8F0] rounded-[20px] shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1 space-y-2">
            <label className="text-sm font-semibold text-[#0F172A]">Target Role</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 pl-10 transition-colors"
              />
              <Target className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!targetRole || isAnalyzing}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
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

        {!hasAnalyzed ? (
          /* Empty State */
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] min-h-[500px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Identify Your Skill Gaps</h3>
            <p className="text-[#64748B] text-sm max-w-sm">
              Select a target role and upload your resume to generate a comprehensive comparison of your current skills versus industry demands.
            </p>
          </div>
        ) : (
          /* Analysis Results */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Content (col 8) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
                
                {/* Tabs */}
                <div className="flex border-b border-[#E2E8F0] overflow-x-auto no-scrollbar bg-slate-50/50">
                  <button 
                    onClick={() => setActiveTab("technical")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "technical" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Zap className="w-4 h-4" /> Technical Skills
                  </button>
                  <button 
                    onClick={() => setActiveTab("soft")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "soft" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Users className="w-4 h-4" /> Soft Skills
                  </button>
                  <button 
                    onClick={() => setActiveTab("certifications")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "certifications" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Award className="w-4 h-4" /> Certifications
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 flex-1 bg-white">
                  {activeTab === "technical" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      
                      {/* Priority Action Indicator */}
                      {getMissingSkillsArray().length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-amber-800 text-sm">Priority Action Recommended</h4>
                            <p className="text-xs text-amber-700 mt-1">
                              You are missing {getMissingSkillsArray().length} critical technical skills required for this role. We strongly recommend adding them to your learning roadmap.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Radar Chart */}
                      <div className="h-[350px] w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisData?.radarData || []}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar name="Your Match" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                            <Radar name="Target Role" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.3} />
                            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Skills Comparison Grid Table */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <PieChart className="w-4 h-4 text-blue-500" /> Comparison Grid
                        </h4>
                        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                          <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                                <th className="p-4">Skill Category / Topic</th>
                                <th className="p-4">Your Proficiency</th>
                                <th className="p-4">Target Requirement</th>
                                <th className="p-4">Gap Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] bg-white font-semibold text-xs">
                              {(analysisData?.radarData || []).map((row: any, i: number) => {
                                const gap = row.B - row.A;
                                return (
                                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-[#0F172A]">{row.subject}</td>
                                    <td className="p-4 text-slate-600">{row.A}</td>
                                    <td className="p-4 text-slate-600">{row.B}</td>
                                    <td className="p-4">
                                      {gap <= 0 ? (
                                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[6px] w-max font-bold">
                                          <CheckCircle2 className="w-3.5 h-3.5" /> Met
                                        </span>
                                      ) : gap < 30 ? (
                                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-[6px] w-max font-bold">
                                          <TrendingUp className="w-3.5 h-3.5" /> Small Gap
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-[6px] w-max font-bold">
                                          <AlertCircle className="w-3.5 h-3.5" /> High Priority
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === "soft" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Soft Skills Analysis</h3>
                      <p className="text-sm text-slate-500 mb-6">Compare your behavioral and communication skills.</p>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl gap-4">
                          <div>
                            <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Cross-functional Communication
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Demonstrated frequently in your resume achievements.</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-100 text-emerald-700 rounded-[6px]">
                            Strength
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-rose-100 bg-rose-50/30 rounded-xl gap-4">
                          <div>
                            <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                              Mentorship & Leadership
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Missing indicators. Expected for Senior+ roles.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-rose-100 text-rose-700 rounded-[6px]">
                              Gap Found
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "certifications" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Certifications Checklist</h3>
                      <p className="text-sm text-slate-500 mb-6">Industry recognized credentials that boost your match rate for {targetRole}.</p>
                      
                      <div className="space-y-4">
                        <div className="p-5 border border-[#E2E8F0] rounded-xl flex items-start gap-4 hover:border-blue-200 transition-colors">
                          <div className="w-6 h-6 rounded-md border-2 border-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">AWS Certified Solutions Architect – Associate</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Highly requested for Cloud/DevOps requirements in modern software stacks.</p>
                          </div>
                        </div>
                        <div className="p-5 border border-[#E2E8F0] rounded-xl flex items-start gap-4 hover:border-blue-200 transition-colors">
                          <div className="w-6 h-6 rounded-md border-2 border-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Certified Kubernetes Administrator (CKA)</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Validates skills in setting up, maintaining and troubleshooting Kubernetes clusters.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Sidebar (col 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Action Plan
                </h3>
                <p className="text-sm text-slate-600">Based on your gaps, we recommend the following learning roadmap updates.</p>
                
                <div className="space-y-3 pt-2">
                  {getMissingSkillsArray().map((skill: any, i: number) => (
                    <div key={i} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm">
                      <p className="font-bold text-slate-800 mb-1">Add {skill.name} Basics</p>
                      <p className="text-xs text-slate-500 mb-3">Priority: {skill.importance}</p>
                      <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition-colors">
                        Add to Roadmap
                      </button>
                    </div>
                  ))}
                  {getMissingSkillsArray().length === 0 && (
                    <div className="text-xs text-slate-500 italic">No critical actions required. Your profile matches well!</div>
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
