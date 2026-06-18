"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  FileText,
  FileCheck,
  Briefcase,
  Compass,
  Award,
  BookOpen,
  Calendar,
  Bell,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CheckCircle,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { useToast } from "@/components/Providers";
import {
  getResumesAction,
  getAtsScoresAction,
  deleteResumeAction
} from "@/app/actions/resume";
import { getUserSkillsAction } from "@/app/actions/skills";
import { getSavedJobsAction } from "@/app/actions/jobs";
import { getNotificationsAction, getSubscriptionAction } from "@/app/actions/settings";
import DashboardLayout from "@/components/DashboardLayout";

// Recharts dynamically imported to prevent server-side hydration errors
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [resumes, setResumes] = useState<any[]>([]);
  const [atsScores, setAtsScores] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Auto-login demo helper
  const handleEnterDemo = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: "alex@example.com",
      password: "password123",
    });
    if (res?.ok) {
      toast("Welcome to Demo Mode! Active records initialized.", "success");
      router.refresh();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      const userId = (session.user as any).id || "demo-user-123";
      
      const loadAllData = async () => {
        setIsLoadingData(true);
        try {
          const fetchedResumes = await getResumesAction(userId);
          const fetchedScores = await getAtsScoresAction(userId);
          const fetchedSkills = await getUserSkillsAction(userId);
          const fetchedJobs = await getSavedJobsAction(userId);
          const fetchedNotifications = await getNotificationsAction(userId);
          const fetchedSub = await getSubscriptionAction(userId);

          setResumes(fetchedResumes);
          setAtsScores(fetchedScores);
          setSkills(fetchedSkills);
          setSavedJobs(fetchedJobs);
          setNotifications(fetchedNotifications);
          setSubscription(fetchedSub);
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setIsLoadingData(false);
        }
      };

      loadAllData();
    }
  }, [session]);

  const handleDeleteResume = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      const success = await deleteResumeAction(id);
      if (success) {
        setResumes(resumes.filter((r) => r.id !== id));
        toast("Resume deleted successfully.", "success");
      } else {
        toast("Failed to delete resume.", "error");
      }
    }
  };

  // Safe checks for logged out users
  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC] py-16">
        <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] p-8 rounded-[20px] shadow-sm text-center space-y-6">
          <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-7 h-7 text-[#2563EB]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Sign in to Access Dashboard</h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Manage your resumes, check target ATS scores, save open roles, and track your custom learning roadmap milestones.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3 rounded-[12px] shadow-sm transition-all text-sm block"
            >
              Sign In to Your Account
            </Link>
            <button
              onClick={handleEnterDemo}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 rounded-[12px] shadow-sm transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Explore Demo Sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculations for Widgets
  const profileCompletion = Math.min(
    25 + // Authenticated
    (resumes.length > 0 ? 25 : 0) + // Has Resume
    (skills.length > 0 ? 25 : 0) + // Has Skills
    (savedJobs.length > 0 || atsScores.length > 0 ? 25 : 0), // Interactive action
    100
  );

  // Prepare Recharts Data
  const chartData = atsScores
    .map((s) => ({
      date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: s.score,
    }))
    .reverse();

  // Mapped suggestions based on missing skills
  const suggestedCourses = [
    { title: "Next.js Advanced Caching & Rendering", provider: "Vercel", duration: "4h", difficulty: "Advanced" },
    { title: "TypeScript Generics & APIs Design", provider: "Frontend Masters", duration: "8h", difficulty: "Intermediate" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Welcome Banner Card */}
        <div className="bg-gradient-to-r from-[#2563EB]/5 to-[#4F46E5]/5 border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              Welcome back, {session.user?.name || "Alex"}
              <span className="text-xs bg-[#2563EB]/10 text-[#2563EB] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {subscription?.plan || "Pro"} Member
              </span>
            </h1>
            <p className="text-[#64748B] text-xs mt-1">
              Benchmark scores, track applications, and advance learning roadmaps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/resume-upload"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-4 py-2.5 rounded-[12px] text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Upload Resume
            </Link>
            <Link
              href="/settings"
              className="bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold px-4 py-2.5 rounded-[12px] text-xs border border-[#E2E8F0] shadow-sm transition-colors"
            >
              Profile Settings
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Row 1: Profile Completion & Recharts ATS History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Completion */}
              <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Profile Strength</h2>
                    <span className="text-xs font-extrabold text-[#2563EB]">{profileCompletion}% Complete</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#F8FAFC] border border-[#E2E8F0]/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-full transition-all duration-1000"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed font-semibold">
                    Improve matching odds by adding details. Uploading a resume and mapping skills increases ranking visibility.
                  </p>
                </div>
                
                <div className="pt-4 mt-4 border-t border-[#E2E8F0]/60 flex justify-between items-center text-xs">
                  <span className="text-[#64748B] font-semibold uppercase">Next Steps</span>
                  <Link href="/skill-gap" className="text-[#2563EB] hover:text-[#1D4ED8] font-bold flex items-center gap-0.5">
                    Add Skills
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* ATS Score History Chart */}
              <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 h-full">
                <div>
                  <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-2">ATS Match Trend</h2>
                  <p className="text-[#64748B] text-xs">Score tracking across consecutive uploads.</p>
                </div>

                <div className="h-32 w-full mt-4">
                  {isMounted && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                        <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} domain={[50, 100]} />
                        <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#2563EB"
                          strokeWidth={2.5}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-[#F8FAFC] rounded-[12px] border border-dashed border-[#E2E8F0] text-[#64748B] text-xs font-semibold">
                      No scoring history. Upload a resume to start tracking.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Uploaded Resumes */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-[#0F172A] text-base">Your Resumes</h2>
                  <p className="text-[#64748B] text-xs">Manage uploaded copies and target positions.</p>
                </div>
                <Link
                  href="/resume-upload"
                  className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </Link>
              </div>

              {isLoadingData ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-14 bg-[#F8FAFC] border border-[#E2E8F0]/60 animate-pulse rounded-[12px]" />
                  ))}
                </div>
              ) : resumes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">File Name</th>
                        <th className="pb-3">Version</th>
                        <th className="pb-3">Uploaded</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8FAFC] font-semibold text-xs">
                      {resumes.map((res) => (
                        <tr key={res.id} className="text-[#0F172A]">
                          <td className="py-4 flex items-center gap-2">
                            <FileText className="w-4.5 h-4.5 text-[#2563EB]" />
                            <a
                              href={res.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors truncate max-w-[200px]"
                            >
                              {res.fileName}
                            </a>
                          </td>
                          <td className="py-4 text-[#64748B]">v{res.version}</td>
                          <td className="py-4 text-[#64748B]">
                            {new Date(res.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <Link
                                href={`/ats-checker?resumeId=${res.id}`}
                                className="bg-[#2563EB]/5 hover:bg-[#2563EB]/10 text-[#2563EB] px-3 py-1.5 rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Test ATS
                              </Link>
                              <button
                                onClick={() => handleDeleteResume(res.id)}
                                className="text-[#64748B] hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Delete Resume"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-[#F8FAFC] rounded-[20px] border border-dashed border-[#E2E8F0] flex flex-col items-center gap-3">
                  <FileText className="w-10 h-10 text-[#64748B]" />
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm">No resumes uploaded yet</h3>
                    <p className="text-[#64748B] text-xs mt-1">Upload a PDF or DOCX file to benchmark ATS parameters.</p>
                  </div>
                  <Link
                    href="/resume-upload"
                    className="bg-[#2563EB] text-white text-xs font-bold px-4 py-2.5 rounded-[12px] mt-2 cursor-pointer shadow-sm hover:bg-[#1D4ED8]"
                  >
                    Upload Now
                  </Link>
                </div>
              )}
            </div>

            {/* Row 3: Saved Jobs */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-[#0F172A] text-base">Bookmarked Jobs</h2>
                  <p className="text-[#64748B] text-xs">Roles you have saved to follow up on.</p>
                </div>
                <Link
                  href="/jobs"
                  className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs flex items-center gap-0.5"
                >
                  Search Jobs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoadingData ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#F8FAFC] border border-[#E2E8F0]/60 animate-pulse rounded-[12px]" />
                  ))}
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-[12px] border border-[#E2E8F0] bg-white flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-[#0F172A]">{job.title}</h3>
                            <p className="text-xs text-[#64748B] font-semibold">{job.company} • {job.location}</p>
                          </div>
                          {job.isRemote && (
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-semibold">Salary: {job.salary}</div>
                      </div>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-[#F8FAFC] hover:bg-[#F8FAFC]/80 text-[#0F172A] text-center py-2 rounded-[8px] text-xs font-bold border border-[#E2E8F0] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Apply Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#F8FAFC] rounded-[20px] border border-dashed border-[#E2E8F0] flex flex-col items-center gap-2 text-xs">
                  <Briefcase className="w-8 h-8 text-[#64748B]" />
                  <span className="font-bold text-[#64748B]">No bookmarked jobs.</span>
                  <Link href="/jobs" className="text-[#2563EB] font-bold mt-1">Browse open roles</Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interview Reminders / Alerts */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                Interviews & Alerts
              </h2>
              
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-850 rounded-[12px] space-y-1">
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Mock Interview Prep</span>
                    <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-850 px-1.5 py-0.5 rounded">Pending</span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-90 text-amber-900 font-semibold">
                    Prepare with standard questions on the learning roadmap.
                  </p>
                </div>
                
                <div className="p-3.5 bg-blue-50 border border-blue-100 text-blue-850 rounded-[12px] space-y-1">
                  <div className="text-xs font-bold">Resume version 1 ready</div>
                  <p className="text-[10px] leading-relaxed opacity-90 text-blue-900 font-semibold">
                    Calculated ATS profile score is active. Make key improvements to hit 85+.
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Gap */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Your Skills
                </h2>
                <Link href="/skill-gap" className="text-xs text-[#2563EB] font-bold hover:underline">
                  Analyze Gaps
                </Link>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] px-2.5 py-1 text-xs font-bold text-[#0F172A] flex items-center gap-1"
                    >
                      {skill.name}
                      <span className="text-[9px] text-[#64748B] font-normal uppercase">({skill.proficiency})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#64748B] font-semibold">
                  No skills listed. Click "Analyze Gaps" to enter your details.
                </div>
              )}
            </div>

            {/* Recommended Learning */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Target Learning
              </h2>

              <div className="space-y-3.5">
                {suggestedCourses.map((course, idx) => (
                  <div key={idx} className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-[12px]">
                    <h3 className="font-bold text-[#0F172A] text-xs hover:text-[#2563EB] transition-colors leading-relaxed">
                      {course.title}
                    </h3>
                    <div className="flex justify-between items-center text-[9px] text-[#64748B] font-bold uppercase tracking-wider">
                      <span>{course.provider} • {course.duration}</span>
                      <span className="text-indigo-600">{course.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/roadmap"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-center py-2.5 rounded-[12px] text-xs font-bold mt-4 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Go to Roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recent activity log */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
              <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#2563EB]" />
                Recent Alerts
              </h2>

              {isLoadingData ? (
                <div className="h-10 bg-[#F8FAFC] animate-pulse rounded-lg" />
              ) : notifications.length > 0 ? (
                <div className="space-y-3.5">
                  {notifications.slice(0, 3).map((not) => (
                    <div key={not.id} className="text-xs leading-relaxed flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                      <div>
                        <div className="font-bold text-[#0F172A]">{not.title}</div>
                        <div className="text-[#64748B] text-[10px] mt-0.5">{not.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#64748B] font-semibold">No recent activity.</div>
              )}
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
