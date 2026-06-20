"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, Zap, AlertCircle } from "lucide-react";

interface NextStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  href: string;
  isPrimary?: boolean;
}

interface NextStepsPanelProps {
  hasResume: boolean;
  atsScore?: number;
  missingSkillsCount: number;
}

export default function NextStepsPanel({
  hasResume,
  atsScore,
  missingSkillsCount,
}: NextStepsPanelProps) {
  const getSteps = (): NextStep[] => {
    const steps: NextStep[] = [];

    if (!hasResume) {
      steps.push({
        title: "Upload Your Resume",
        description: "Start your journey by uploading your professional profile.",
        icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
        actionText: "Upload Now",
        href: "/resume-upload",
        isPrimary: true,
      });
      return steps;
    }

    if (!atsScore) {
      steps.push({
        title: "Analyze Resume Match",
        description: "See how well your resume matches target job roles.",
        icon: <Target className="w-5 h-5 text-emerald-400" />,
        actionText: "Run ATS Scan",
        href: "/ats-checker",
        isPrimary: true,
      });
    }

    if (atsScore && missingSkillsCount > 0) {
      steps.push({
        title: "Bridge Skill Gaps",
        description: `Add ${missingSkillsCount} recommended keywords to improve your score.`,
        icon: <Zap className="w-5 h-5 text-amber-400" />,
        actionText: "View Missing Skills",
        href: "/skill-gap",
        isPrimary: true,
      });
    }

    if (atsScore && atsScore > 80) {
      steps.push({
        title: "Ready to Apply",
        description: "Your ATS score is high. Start applying to recommended jobs.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        actionText: "View Jobs",
        href: "/jobs",
        isPrimary: true,
      });
    }

    steps.push({
      title: "Explore Career Insights",
      description: "Review salary guides and market trends for your target role.",
      icon: <Target className="w-5 h-5 text-indigo-400" />,
      actionText: "View Insights",
      href: "/career-insights",
      isPrimary: false,
    });

    return steps.slice(0, 3); // Max 3 steps
  };

  const steps = getSteps();

  if (steps.length === 0) return null;

  return (
    <div className="bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-[16px] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-[18px] font-semibold text-[#F9FAFB]">Next Steps</h3>
        <p className="text-[15px] text-[#9CA3AF] mt-1">Personalized recommendations for your career journey</p>
      </div>
      <div className="p-6 space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#111827] border border-[rgba(255,255,255,0.05)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{step.icon}</div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#F9FAFB]">{step.title}</h4>
                <p className="text-[13px] text-[#9CA3AF] mt-1">{step.description}</p>
              </div>
            </div>
            <Link
              href={step.href}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                step.isPrimary 
                  ? "bg-[#14B8A6] text-white hover:bg-[#0d9488]" 
                  : "bg-[rgba(255,255,255,0.05)] text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              {step.actionText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
