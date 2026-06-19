"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Upload,
  UserCircle,
  FileText,
  CheckCircle2,
  Activity,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const userId = (session.user as any).id || "demo-user-123";
      
      const loadData = async () => {
        setIsLoadingData(true);
        try {
          const data = await getDashboardDataAction(userId);
          setDashboardData(data);
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setIsLoadingData(false);
        }
      };

      loadData();
    }
  }, [session]);

  // Safe checks for logged out users
  if (status === "loading" || isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-[#F8FAFC]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Loading workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex-1 min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] py-16">
          <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] p-8 rounded-[20px] shadow-sm text-center space-y-6">
            <div className="w-14 h-14 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-7 h-7 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Sign in to Access Dashboard</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Manage your resumes, check target ATS scores, save open roles, and track your custom learning roadmap milestones.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-[12px] shadow-sm transition-all text-sm block"
              >
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasData = dashboardData?.progress > 25; // Simple check if they've done anything

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {hasData ? "Workspace Overview" : "Welcome to CareerMate"}
            </h1>
            <p className="text-[#64748B] font-medium text-sm">
              {hasData 
                ? "Here is what's happening with your career journey today." 
                : "Upload your first resume to unlock personalized insights."}
            </p>
          </div>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">No career insights yet</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto mb-8">
              We need a bit more information to build your personalized career roadmap, identify skill gaps, and check ATS compatibility.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/resume-upload"
                className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] font-bold py-3 px-6 rounded-xl transition-all"
              >
                <UserCircle className="w-4 h-4" />
                Complete Profile
              </Link>
            </div>
          </div>
        ) : (
          /* Populated State */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-emerald-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData?.recentResumes?.length > 0 ? (
                  dashboardData.recentResumes.map((resume: any, i: number) => (
                    <div key={`resume-${resume.id}-${i}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#E2E8F0]/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{resume.fileName}</p>
                          <p className="text-xs text-[#64748B]">Uploaded {new Date(resume.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link href={`/ats-checker?resumeId=${resume.id}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        Check ATS <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Profile & Pending Actions */}
            <div className="space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4">Profile Completion</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-[#64748B]">Progress</span>
                    <span className="text-emerald-600">{dashboardData?.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${dashboardData?.progress}%` }} />
                  </div>
                </div>
                <Link href="/settings" className="block w-full text-center py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                  Complete Profile
                </Link>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4">Pending Actions</h3>
                <ul className="space-y-3">
                  {dashboardData?.pendingActions?.length > 0 ? (
                    dashboardData.pendingActions.map((action: any, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                        <div>
                          <Link href={action.href} className="text-sm font-semibold text-emerald-600 hover:underline">
                            {action.title}
                          </Link>
                          <p className="text-xs text-[#64748B]">{action.desc}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">All caught up!</li>
                  )}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
