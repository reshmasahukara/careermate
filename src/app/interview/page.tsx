"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Sparkles,
  MessageSquare,
  Mic,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/components/Providers";

export default function InterviewPrepPage() {
  const { toast } = useToast();

  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [difficulty, setDifficulty] = useState("Senior");
  const [questionType, setQuestionType] = useState<"technical" | "behavioral">("behavioral");
  
  // Game/Mock State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    text: "Tell me about a time when you had to optimize a slow-loading web application. What metrics did you trace, and what was the outcome?",
    type: "behavioral",
    category: "Performance / Architecture"
  });
  
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleGenerateQuestion = () => {
    setIsGenerating(true);
    setEvaluation(null);
    setUserAnswer("");
    
    setTimeout(() => {
      setIsGenerating(false);
      const mockQuestions = questionType === "behavioral" ? [
        {
          text: "Describe a situation where you had a strong disagreement with a product designer regarding a technical limitation. How did you resolve it?",
          type: "behavioral",
          category: "Conflict Resolution"
        },
        {
          text: "Tell me about a project that failed or missed its deadline. What did you learn, and what steps did you take to prevent it in the future?",
          type: "behavioral",
          category: "Ownership & Reflection"
        }
      ] : [
        {
          text: "Explain the difference between hydration and server component rendering in Next.js. When would you force client rendering?",
          type: "technical",
          category: "Next.js Core"
        },
        {
          text: "How do you optimize CSS loading in a large tailwind bundle to keep critical rendering paths clear?",
          type: "technical",
          category: "CSS Optimization"
        }
      ];

      const idx = Math.floor(Math.random() * mockQuestions.length);
      setCurrentQuestion(mockQuestions[idx]);
      toast("New AI question generated!", "success");
    }, 800);
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) {
      toast("Please enter your answer before evaluating.", "warning");
      return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      
      const mockEval = {
        score: 85,
        strengths: [
          "Directly addresses the performance issue (hydration lag, bundle sizes).",
          "Used strong technical verbs and mentioned tools like Lighthouse and Web Vitals."
        ],
        weaknesses: [
          "Lacks specific metric percentages. Try to mention exactly how much loading times dropped.",
          "Could detail the team collaboration aspect more clearly under the STAR resolution stage."
        ],
        suggestedPhrasing: "Instead of saying 'I made the pages load much quicker,' try 'I decoupled heavy UI chunks, reducing JavaScript execution time by 35% and upgrading the Largest Contentful Paint (LCP) score from red to green.'"
      };

      setEvaluation(mockEval);
      toast("AI Evaluation complete!", "success");
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Interview Preparation</h1>
          <p className="text-sm text-[#64748B]">Practice interview rounds with interactive AI evaluation and instant scoring feedback.</p>
        </div>

        {/* Configurations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main practice workspace (col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Setup card */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">AI Question Generator Settings</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Question Category</label>
                  <div className="flex bg-slate-50 p-1 border border-[#E5E7EB] rounded-xl">
                    <button
                      onClick={() => setQuestionType("behavioral")}
                      className={`flex-1 py-1 text-center text-[10px] font-extrabold uppercase rounded-lg cursor-pointer ${
                        questionType === "behavioral" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Behavioral
                    </button>
                    <button
                      onClick={() => setQuestionType("technical")}
                      className={`flex-1 py-1 text-center text-[10px] font-extrabold uppercase rounded-lg cursor-pointer ${
                        questionType === "technical" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Technical
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Experience Level</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Junior">Junior / Entry Level</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Lead">Lead / Staff Architect</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateQuestion}
                disabled={isGenerating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isGenerating ? "Generating Question..." : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    Generate AI Question
                  </>
                )}
              </button>
            </div>

            {/* Question Workspace */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-6">
              
              {/* Question card header */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                    {currentQuestion.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{currentQuestion.category} Question</h3>
                </div>
                <button
                  onClick={handleGenerateQuestion}
                  className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Next Question"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text */}
              <p className="text-sm text-[#0F172A] font-bold leading-relaxed">
                "{currentQuestion.text}"
              </p>

              {/* Response block */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Your Response</label>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer">
                    <Mic className="w-4 h-4 text-emerald-500" /> Simulate Voice Input
                  </button>
                </div>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Structure your answer using the STAR method (Situation, Task, Action, Result) for behavioral questions, or explain technical logic step-by-step."
                  className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white h-32 resize-none"
                />
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isEvaluating ? "Evaluating Response..." : (
                  <>
                    <MessageSquare className="w-4 h-4 text-[#10B981]" />
                    Evaluate Response
                  </>
                )}
              </button>

            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-5 animate-in fade-in duration-300">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <span className="text-xl font-black">{evaluation.score}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wide opacity-85">/100</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">AI Response Rating: Excellent Match</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Your answer features strong metrics and direct task descriptions. Adding clear numbers and removing filler language will elevate your score.
                    </p>
                  </div>
                </div>

                {/* Bullet details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-xl space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </span>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {evaluation.strengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/20 border border-rose-100 p-4 rounded-xl space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Improvements
                    </span>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {evaluation.weaknesses.map((weak: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Phrasing Suggestion */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F172A] block">
                    Suggested Rephrasing for Better Impact
                  </span>
                  <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                    {evaluation.suggestedPhrasing}
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Guidelines Sidebar (col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5 text-emerald-500" />
                STAR Framework Tips
              </h3>
              
              <div className="space-y-3.5 text-xs text-[#64748B] font-semibold leading-relaxed">
                <div className="space-y-1">
                  <p className="font-extrabold text-[#0F172A]">S - Situation</p>
                  <p>Detail the context, core problem, or technical limits you faced.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[#0F172A]">T - Task</p>
                  <p>Describe your specific responsibility or milestone objective.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[#0F172A]">A - Action</p>
                  <p>Explain the exact engineering steps, code logic, or architectural choices you implemented.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[#0F172A]">R - Result</p>
                  <p>Deliver the outcome. Use exact numbers and percentages (e.g. 'boosted speeds by 25%').</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-emerald-500" />
                Technical Quick Guide
              </h3>
              <ul className="space-y-2 text-xs text-[#64748B] font-semibold list-disc list-inside">
                <li>Be precise with system constraints.</li>
                <li>Explain algorithmic trade-offs (Time/Space complexity).</li>
                <li>Describe edge case handling explicitly.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Review Salary & In-Demand Skills</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Understand industry trends, salary insights, and target roles' core skills within the Career Insights intelligence dashboard.
            </p>
          </div>
          <a
            href="/career-insights"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Explore Career Insights
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
