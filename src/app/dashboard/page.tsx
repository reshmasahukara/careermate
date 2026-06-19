"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileText,
  Target,
  Briefcase,
  Zap,
  Activity,
  BarChart2,
  FileSearch,
  LayoutDashboard,
  Upload,
  ArrowRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import MetricCard from "@/components/dashboard/MetricCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import ATSChart from "@/components/dashboard/ATSChart";
import ResumeInsights from "@/components/dashboard/ResumeInsights";
import ProfileCompletion from "@/components/dashboard/ProfileCompletion";
import ActionCenter from "@/components/dashboard/ActionCenter";
import LearningRoadmap from "@/components/dashboard/LearningRoadmap";
import SkillGapPreview from "@/components/dashboard/SkillGapPreview";
import JobRecommendations from "@/components/dashboard/JobRecommendations";

// ─── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6 md:p-8 max-w-[1200px] mx-auto">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-56" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

// ─── Section card wrapper ──────────────────────────────────────────────────
function SectionCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
        <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2 uppercase tracking-wider">
          <span className="text-emerald-500">{icon}</span> {title}
        </h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!session?.user) return;
    const userId = (session.user as any).id || "demo-user-123";
    setIsLoading(true);
    try {
      const data = await getDashboardDataAction(userId);
      setDashboardData(data);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Auth loading ─────────────────────────────────────────
  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  // ── Unauthenticated ──────────────────────────────────────
  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex-1 min-h-screen flex items-center justify-center px-4 bg-[#F7F8FA] py-16">
          <div className="w-full max-w-md bg-white border border-[#E5E7EB] p-10 rounded-2xl shadow-sm text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-7 h-7 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#111827]">Sign in to continue</h2>
            <p className="text-sm text-[#64748B]">
              Access your personalized career intelligence workspace.
            </p>
            <Link
              href="/login"
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl text-sm block shadow-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const d = dashboardData;
  const userName = session.user?.name?.split(" ")[0] || "there";
  const lastLogin = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  // Derived metrics
  const atsScore = d?.ats?.latest;
  const atsHighest = d?.ats?.highest;
  const resumeMatchRate = atsScore ? `${atsScore}%` : "—";
  const jobsApplied = d?.stats?.atsChecks ?? 0;
  const careerReadiness = d?.careerReadiness ?? 0;
  const targetRole = d?.careerPath?.targetRole ?? null;
  const missingSkillsCount = d?.ats?.keywordsMissing?.length ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">

          {/* ── HEADER ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-[#64748B] text-sm mt-1">
                {missingSkillsCount > 0
                  ? `You're ${missingSkillsCount} skills away from your target role.`
                  : targetRole
                  ? `Tracking toward: ${targetRole}`
                  : "Upload your resume to unlock personalized insights."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:block">
                {lastLogin}
              </span>
              {!d?.stats?.resumes && (
                <Link
                  href="/resume-upload"
                  className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-all shrink-0"
                >
                  <Upload className="w-4 h-4" /> Upload Resume
                </Link>
              )}
            </div>
          </div>

          {/* ── METRIC CARDS ────────────────────────────────── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="ATS Score"
              value={atsScore ? `${atsScore}/100` : "—"}
              subtitle={atsScore ? "Resume vs. job description" : "No scan yet"}
              trend={atsScore ? { value: 5, label: "this month" } : undefined}
              icon={<FileSearch className="w-5 h-5" />}
              href="/ats-checker"
              accentColor="#10B981"
              isEmpty={!atsScore}
              emptyText="Run an ATS scan"
            />
            <MetricCard
              title="Resume Match"
              value={resumeMatchRate}
              subtitle={targetRole ? `vs. ${targetRole}` : "Set a target role"}
              icon={<Target className="w-5 h-5" />}
              href="/ats-checker"
              accentColor="#6366F1"
              isEmpty={!atsScore}
              emptyText="No data yet"
            />
            <MetricCard
              title="Jobs Applied"
              value={jobsApplied}
              subtitle="Applications this month"
              trend={jobsApplied > 0 ? { value: jobsApplied, label: "total" } : undefined}
              icon={<Briefcase className="w-5 h-5" />}
              href="/jobs"
              accentColor="#F59E0B"
              isEmpty={jobsApplied === 0}
              emptyText="No applications yet"
            />
            <MetricCard
              title="Career Readiness"
              value={`${careerReadiness}%`}
              subtitle="Profile, skills, resume & activity"
              trend={careerReadiness > 0 ? { value: careerReadiness, label: "overall" } : undefined}
              icon={<Zap className="w-5 h-5" />}
              href="/settings"
              accentColor="#EF4444"
              isEmpty={careerReadiness === 0}
              emptyText="Complete your profile"
            />
          </div>

          {/* ── MAIN GRID ────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

            {/* LEFT — 70% */}
            <div className="lg:col-span-7 space-y-6">

              {/* Section 1: Activity Timeline */}
              <SectionCard
                title="Recent Activity"
                icon={<Activity className="w-4 h-4" />}
                action={
                  d?.activityItems?.length > 0 ? (
                    <Link href="/resume-upload" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                      + Add Resume
                    </Link>
                  ) : null
                }
              >
                <ActivityTimeline items={d?.activityItems ?? []} />
              </SectionCard>

              {/* Section 2: ATS Performance Trend */}
              <SectionCard
                title="ATS Performance Trend"
                icon={<BarChart2 className="w-4 h-4" />}
                action={
                  <Link href="/ats-checker" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    Run Scan
                  </Link>
                }
              >
                <ATSChart
                  history={d?.ats?.history ?? []}
                  currentScore={d?.ats?.latest}
                  highestScore={d?.ats?.highest}
                />
              </SectionCard>

              {/* Section 3: Resume Insights */}
              <SectionCard
                title="Resume Insights"
                icon={<FileText className="w-4 h-4" />}
              >
                <ResumeInsights
                  latestResume={d?.latestResume}
                  ats={{
                    keywordsFound: d?.ats?.keywordsFound ?? [],
                    keywordsMissing: d?.ats?.keywordsMissing ?? [],
                    latestTargetRole: d?.ats?.latestTargetRole,
                  }}
                />
              </SectionCard>

            </div>

            {/* RIGHT — 30% */}
            <div className="lg:col-span-3 space-y-6">

              {/* Profile Completion */}
              <SectionCard
                title="Profile Completion"
                icon={<Target className="w-4 h-4" />}
              >
                <ProfileCompletion
                  progress={d?.progress ?? 20}
                  stats={d?.stats ?? { resumes: 0, skills: 0, paths: 0, atsChecks: 0 }}
                />
              </SectionCard>

              {/* Smart Action Center */}
              <SectionCard
                title="Action Center"
                icon={<Zap className="w-4 h-4" />}
              >
                <ActionCenter actions={d?.pendingActions ?? []} />
              </SectionCard>

              {/* Learning Roadmap */}
              <SectionCard
                title="Learning Roadmap"
                icon={<Activity className="w-4 h-4" />}
              >
                <LearningRoadmap careerPath={d?.careerPath} />
              </SectionCard>

              {/* Skill Gap Preview */}
              <SectionCard
                title="Skill Gap Preview"
                icon={<BarChart2 className="w-4 h-4" />}
              >
                <SkillGapPreview
                  missingKeywords={d?.ats?.keywordsMissing ?? []}
                  atsScore={d?.ats?.latest}
                />
              </SectionCard>

              {/* Job Recommendations */}
              <SectionCard
                title="Job Recommendations"
                icon={<Briefcase className="w-4 h-4" />}
              >
                <JobRecommendations targetRole={targetRole} />
              </SectionCard>

            </div>
          </div>

          {/* ── NEXT STEP CAREER INTENT CTA ── */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
            <div className="space-y-1.5">
              <span className="inline-block bg-[#10B981] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recommended Next Step
              </span>
              <h3 className="text-lg font-bold">
                {!d?.stats?.resumes
                  ? "Build or Upload your resume copy"
                  : !atsScore
                  ? "Analyze your resume with ATS Match Checker"
                  : "Review salary guides and market trends"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl font-medium">
                {!d?.stats?.resumes
                  ? "To begin your optimized career journey, start by uploading or drafting your professional profile resume."
                  : !atsScore
                  ? "Benchmark your resume keywords and formatting layout against high-yield job role requirements."
                  : "Understand industry salary benchmarks and fast-growing keywords for your target role."}
              </p>
            </div>
            <Link
              href={
                !d?.stats?.resumes
                  ? "/resume-upload"
                  : !atsScore
                  ? "/ats-checker"
                  : "/career-insights"
              }
              className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
            >
              {!d?.stats?.resumes
                ? "Get Started"
                : !atsScore
                ? "Scan Resume"
                : "Explore Insights"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
    </DashboardLayout>
  );
}
