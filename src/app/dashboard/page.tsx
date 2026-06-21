"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Target,
  Briefcase,
  Upload,
  FileSearch,
  Activity,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import MetricCard from "@/components/dashboard/MetricCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import LearningRoadmap from "@/components/dashboard/LearningRoadmap";
import SkillGapPreview from "@/components/dashboard/SkillGapPreview";
import JobRecommendations from "@/components/dashboard/JobRecommendations";
import CareerInsightsPreview from "@/components/dashboard/CareerInsightsPreview";

// ─── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6 md:p-8 max-w-[1280px] mx-auto bg-[#F5F7FA] min-h-screen">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[120px]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-72" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-72" />
        </div>
      </div>
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

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const d = dashboardData;
  const userName = session?.user?.name?.split(" ")[0] || "there";
  
  const atsScore = d?.ats?.latest;
  const targetRole = d?.careerPath?.targetRole ?? null;
  const missingSkillsCount = d?.ats?.keywordsMissing?.length ?? 0;
  const hasResume = !!d?.stats?.resumes;
  const activeApplications = d?.stats?.atsChecks ?? 0;
  
  const jobMatchPercentage = atsScore ? `${atsScore}%` : "—";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] pb-12">
        <div className="max-w-[1280px] mx-auto space-y-6 p-6">

          {/* ── HEADER ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-extrabold tracking-tight text-[#0F172A]">
                Welcome, {userName}
              </h1>
              <p className="text-[15px] text-[#64748B] mt-1">
                {targetRole 
                  ? `Target Role: ${targetRole}` 
                  : "Upload your resume to set your target role."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!hasResume ? (
                <Link
                  href="/resume-upload"
                  className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold px-5 py-2.5 rounded-xl text-[15px] transition-all shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Upload Resume
                </Link>
              ) : (
                <Link
                  href="/ats-checker"
                  className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold px-5 py-2.5 rounded-xl text-[15px] transition-all shadow-sm"
                >
                  <FileSearch className="w-4 h-4" /> Analyze Resume
                </Link>
              )}
            </div>
          </div>

          {/* ── METRIC CARDS ────────────────────────────────── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              title="ATS Score"
              value={atsScore ? `${atsScore}` : "—"}
              subtitle="Latest resume scan"
              icon={<FileSearch className="w-5 h-5" />}
              href="/ats-checker"
              accentColor="#10B981"
              isEmpty={!atsScore}
              emptyText="Upload your resume to unlock ATS insights."
            />
            <MetricCard
              title="Job Match"
              value={jobMatchPercentage}
              subtitle={targetRole ? `vs. ${targetRole}` : "Set target role"}
              icon={<Target className="w-5 h-5" />}
              href="/ats-checker"
              accentColor="#F59E0B"
              isEmpty={!atsScore}
              emptyText="Complete your first skill analysis to view recommendations."
            />
            <MetricCard
              title="Skill Gaps"
              value={missingSkillsCount}
              subtitle="Keywords to add"
              icon={<AlertCircle className="w-5 h-5" />}
              href="/skill-gap"
              accentColor="#EF4444"
              isEmpty={!atsScore}
              emptyText="Complete your first skill analysis to view recommendations."
            />
            <MetricCard
              title="Applications"
              value={activeApplications}
              subtitle="Active tracking"
              icon={<Briefcase className="w-5 h-5" />}
              accentColor="#6366F1"
              isEmpty={false}
            />
          </div>

          {/* ── MAIN GRID: ROW 1 (Recommended Jobs + Career Insights) ───────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h3 className="text-[18px] font-semibold text-[#0F172A] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#10B981]" /> Recommended Jobs
                </h3>
              </div>
              <div className="p-6 flex-1 bg-[#F8FAFC]">
                <JobRecommendations targetRole={targetRole} />
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h3 className="text-[18px] font-semibold text-[#0F172A] flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#6366F1]" /> Career Insights
                </h3>
              </div>
              <div className="p-6 flex-1 bg-[#F8FAFC]">
                <CareerInsightsPreview targetRole={targetRole} />
              </div>
            </div>
          </div>

          {/* ── MAIN GRID: ROW 2 (Recent Activity + Skill Gap Snapshot) ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h3 className="text-[18px] font-semibold text-[#0F172A] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#6366F1]" /> Recent Activity
                </h3>
              </div>
              <div className="p-6 flex-1 bg-[#F8FAFC]">
                <ActivityTimeline items={d?.activityItems ?? []} />
              </div>
            </div>

            <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h3 className="text-[18px] font-semibold text-[#0F172A] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" /> Skill Gap Snapshot
                </h3>
              </div>
              <div className="p-6 flex-1 bg-[#F8FAFC]">
                <SkillGapPreview
                  missingKeywords={d?.ats?.keywordsMissing ?? []}
                  atsScore={d?.ats?.latest}
                />
              </div>
            </div>
          </div>

          {/* ── MAIN GRID: ROW 3 (Learning Roadmap) ───────────────────── */}
          <div className="bg-[#FCFDFE] border border-[#E2E8F0] rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h3 className="text-[18px] font-semibold text-[#0F172A] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#10B981]" /> Learning Roadmap
              </h3>
            </div>
            <div className="p-6 bg-[#F8FAFC]">
              <LearningRoadmap careerPath={d?.careerPath} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
