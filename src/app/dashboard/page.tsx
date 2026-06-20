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
import NextStepsPanel from "@/components/dashboard/NextStepsPanel";
import CareerInsightsPreview from "@/components/dashboard/CareerInsightsPreview";

// ─── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#1F2937] rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6 md:p-8 max-w-[1280px] mx-auto bg-[#FAFBFC] min-h-screen">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[120px]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-56" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
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

  // ── Auth loading ─────────────────────────────────────────
  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const d = dashboardData;
  const userName = session?.user?.name?.split(" ")[0] || "there";
  
  // Derived metrics
  const atsScore = d?.ats?.latest;
  const targetRole = d?.careerPath?.targetRole ?? null;
  const missingSkillsCount = d?.ats?.keywordsMissing?.length ?? 0;
  const hasResume = !!d?.stats?.resumes;
  const activeApplications = d?.stats?.atsChecks ?? 0; // Using ATS checks as a proxy for active apps for now
  
  // Job match percentage
  const jobMatchPercentage = atsScore ? `${atsScore}%` : "—";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FAFBFC] text-[#0F172A] pb-12">
        <div className="max-w-[1280px] mx-auto space-y-6 p-6">

          {/* ── HEADER ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-extrabold tracking-tight text-[#111827]">
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
                  className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488] text-white font-semibold px-5 py-2.5 rounded-xl text-[15px] transition-all"
                >
                  <Upload className="w-4 h-4" /> Upload Resume
                </Link>
              ) : (
                <Link
                  href="/ats-checker"
                  className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488] text-white font-semibold px-5 py-2.5 rounded-xl text-[15px] transition-all"
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
              accentColor="#14B8A6"
              isEmpty={!atsScore}
              emptyText="No scan yet"
            />
            <MetricCard
              title="Job Match"
              value={jobMatchPercentage}
              subtitle={targetRole ? `vs. ${targetRole}` : "Set target role"}
              icon={<Target className="w-5 h-5" />}
              href="/ats-checker"
              accentColor="#F59E0B"
              isEmpty={!atsScore}
              emptyText="—"
            />
            <MetricCard
              title="Skill Gaps"
              value={missingSkillsCount}
              subtitle="Keywords to add"
              icon={<AlertCircle className="w-5 h-5" />}
              href="/skill-gap"
              accentColor="#EF4444"
              isEmpty={!atsScore}
              emptyText="—"
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

          {/* ── NEXT STEPS (Full Width) ─────────────────────── */}
          <NextStepsPanel 
            hasResume={hasResume}
            atsScore={atsScore}
            missingSkillsCount={missingSkillsCount}
          />

          {/* ── MAIN GRID (8 / 4 columns) ───────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT — 8 Columns */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#E5E7EB]">
                  <h3 className="text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#14B8A6]" /> Recommended Jobs
                  </h3>
                </div>
                <div className="p-6">
                  <JobRecommendations targetRole={targetRole} />
                </div>
              </div>

              {/* Recent Activity & Skill Gap Snapshot (2 columns within the 8-col area) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#E5E7EB]">
                    <h3 className="text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#14B8A6]" /> Recent Activity
                    </h3>
                  </div>
                  <div className="p-6">
                    <ActivityTimeline items={d?.activityItems ?? []} />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#E5E7EB]">
                    <h3 className="text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#F59E0B]" /> Skill Gap Snapshot
                    </h3>
                  </div>
                  <div className="p-6">
                    <SkillGapPreview
                      missingKeywords={d?.ats?.keywordsMissing ?? []}
                      atsScore={d?.ats?.latest}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT — 4 Columns */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="h-auto">
                <CareerInsightsPreview targetRole={targetRole} />
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#E5E7EB]">
                  <h3 className="text-[18px] font-semibold text-[#111827]">Learning Roadmap</h3>
                </div>
                <div className="p-6">
                  <LearningRoadmap careerPath={d?.careerPath} />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
