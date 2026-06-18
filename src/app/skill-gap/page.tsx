"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession as useAuthSession } from "next-auth/react";
import {
  Compass,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/components/Providers";
import {
  getUserSkillsAction,
  addUserSkillAction,
  removeUserSkillAction,
  generateRoadmapAction
} from "@/app/actions/skills";

// Recharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function SkillGapPage() {
  const { data: session } = useAuthSession();
  const router = useRouter();
  const { toast } = useToast();

  const [skills, setSkills] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");

  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadSkills();
    }
  }, [session]);

  const loadSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const userSkills = await getUserSkillsAction(userId);
      setSkills(userSkills);
    } catch (e) {
      console.error("Error loading skills:", e);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (!session?.user) {
      toast("Please log in to add skills.", "warning");
      return;
    }

    const userId = (session.user as any).id || "demo-user-123";
    try {
      await addUserSkillAction(userId, newSkillName.trim(), newSkillLevel);
      toast(`Added skill ${newSkillName}!`, "success");
      setNewSkillName("");
      loadSkills();
    } catch (err) {
      toast("Failed to add skill.", "error");
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!session?.user) return;
    const userId = (session.user as any).id || "demo-user-123";
    try {
      const success = await removeUserSkillAction(userId, skillId);
      if (success) {
        setSkills(skills.filter((s) => s.skillId !== skillId));
        toast("Skill removed.", "info");
      }
    } catch (err) {
      toast("Error removing skill.", "error");
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!session?.user) {
      toast("Please log in to generate a roadmap.", "warning");
      return;
    }

    setIsGenerating(true);
    const userId = (session.user as any).id || "demo-user-123";
    try {
      await generateRoadmapAction(userId, targetRole);
      toast("Career learning roadmap created successfully!", "success");
      router.push("/roadmap");
    } catch (err) {
      toast("Failed to generate career path roadmap.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Target skills expectation matrix
  const getExpectedSkillsForRole = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("front") || roleLower.includes("react")) {
      return [
        { name: "React", required: 95 },
        { name: "Next.js", required: 90 },
        { name: "TypeScript", required: 85 },
        { name: "Tailwind CSS", required: 85 },
        { name: "Framer Motion", required: 70 },
        { name: "Git", required: 80 },
      ];
    } else if (roleLower.includes("back") || roleLower.includes("node") || roleLower.includes("full")) {
      return [
        { name: "Node.js", required: 90 },
        { name: "Prisma", required: 85 },
        { name: "PostgreSQL", required: 85 },
        { name: "TypeScript", required: 80 },
        { name: "Docker", required: 75 },
        { name: "Git", required: 80 },
      ];
    } else {
      return [
        { name: "UI/UX Design", required: 95 },
        { name: "Framer Motion", required: 80 },
        { name: "React", required: 70 },
        { name: "Figma", required: 95 },
        { name: "Git", required: 60 },
      ];
    }
  };

  const expectedList = getExpectedSkillsForRole(targetRole);

  // Map user proficiencies to numbers
  const levelToNum = (lvl: string) => {
    if (!lvl) return 0;
    if (lvl.toLowerCase() === "expert") return 95;
    if (lvl.toLowerCase() === "intermediate") return 65;
    return 35; // Beginner
  };

  // Compile Recharts comparison data
  const comparisonData = expectedList.map((expected) => {
    const userHas = skills.find((s) => s.name.toLowerCase() === expected.name.toLowerCase());
    return {
      name: expected.name,
      Required: expected.required,
      Yours: userHas ? levelToNum(userHas.proficiency) : 0,
    };
  });

  // Calculate gaps
  const skillGaps = expectedList
    .map((expected) => {
      const userHas = skills.find((s) => s.name.toLowerCase() === expected.name.toLowerCase());
      const userVal = userHas ? levelToNum(userHas.proficiency) : 0;
      const gap = Math.max(expected.required - userVal, 0);
      return {
        name: expected.name,
        gap,
        userLevel: userHas?.proficiency || "Not Listed",
      };
    })
    .filter((g) => g.gap > 0);

  return (
    <div className="flex-1 bg-brand-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Skill Gap Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">Benchmark your skill proficiencies against target market expectations.</p>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Target selection */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-slate-950 text-sm uppercase tracking-wider">Select Focus Role</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Benchmarks adjust according to the selected role expectations.</p>
              </div>

              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary font-semibold text-slate-700"
              >
                <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI Product Designer">AI Product Designer</option>
              </select>
            </div>

            {/* Manage profile skills */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-slate-950 text-sm uppercase tracking-wider">Add Profile Skill</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Append tools or coding parameters to your profile catalog.</p>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-3">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Figma, SQL"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary font-semibold text-slate-700 focus:bg-white transition-colors"
                />

                <div className="flex gap-2">
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs focus:outline-none font-semibold text-slate-700 flex-1"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Expert">Expert Level</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-700 text-white font-bold px-4 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    Add
                  </button>
                </div>
              </form>

              <hr className="border-slate-100 my-2" />

              {/* Skills listed */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Active Skills</span>
                {isLoadingSkills ? (
                  <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
                ) : skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        className="bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-1.5 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                      >
                        {s.name}
                        <span className="text-[9px] text-slate-400 uppercase">({s.proficiency.charAt(0)})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s.skillId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">No skills listed yet. Add one above.</div>
                )}
              </div>
            </div>

          </div>

          {/* Chart & Analysis Column (col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual comparison bar chart */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Expectations Benchmark</h3>
                <p className="text-slate-500 text-xs">Comparing required proficiencies against your parameters.</p>
              </div>

              <div className="h-64 w-full mt-6">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="Required" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Yours" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-slate-50 rounded-xl" />
                )}
              </div>
            </div>

            {/* Gap diagnostic list */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Identified Gaps</h3>
                <p className="text-slate-500 text-xs">Technologies to learn to match target requirements.</p>
              </div>

              {skillGaps.length > 0 ? (
                <div className="space-y-3.5">
                  {skillGaps.map((gap) => (
                    <div key={gap.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{gap.name}</span>
                        <span className="text-rose-500 font-extrabold text-[10px] uppercase bg-rose-50 px-2 py-0.5 rounded-full">
                          Gap: {gap.gap}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Your Level: {gap.userLevel}</span>
                        <span className="text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                          View Roadmap Recommendations
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Generate roadmap trigger */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleGenerateRoadmap}
                      disabled={isGenerating}
                      className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Plus className="w-4.5 h-4.5 animate-spin" />
                          Mapping milestones...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4.5 h-4.5" />
                          Generate Career Roadmap
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>**Congratulations!** Your active profile profile matches 100% of target role requirements.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
