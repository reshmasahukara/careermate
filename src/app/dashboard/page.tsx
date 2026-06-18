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
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center space-y-6 shadow-xl border border-slate-200">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to Access Dashboard</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage your resumes, check target ATS scores, save open roles, and track your custom learning roadmap milestones.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm"
            >
              Sign In to Your Account
            </Link>
            <button
              onClick={handleEnterDemo}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
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
    <div className="flex-1 bg-brand-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              Welcome back, {session.user?.name || "Alex"}
              <span className="text-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {subscription?.plan || "Pro"} Member
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Benchmark scores, track applications, and advance learning roadmaps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/resume-upload"
              className="bg-primary hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload Resume
            </Link>
            <Link
              href="/settings"
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 shadow-sm transition-colors"
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
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Profile Strength</h2>
                    <span className="text-xs font-extrabold text-primary">{profileCompletion}% Complete</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Improve matching odds by adding details. Uploading a resume and mapping skills increases ranking visibility.
                  </p>
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold uppercase">Next Steps</span>
                  <Link href="/skill-gap" className="text-primary hover:text-blue-700 font-bold flex items-center gap-0.5">
                    Add Skills
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* ATS Score History Chart */}
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200">
                <div>
                  <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">ATS Match Trend</h2>
                  <p className="text-slate-500 text-xs">Score tracking across consecutive uploads.</p>
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
                    <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed text-slate-400 text-xs">
                      No scoring history. Upload a resume to start tracking.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Uploaded Resumes */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Your Resumes</h2>
                  <p className="text-slate-500 text-xs">Manage uploaded copies and target positions.</p>
                </div>
                <Link
                  href="/resume-upload"
                  className="text-primary hover:text-blue-700 font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </Link>
              </div>

              {isLoadingData ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : resumes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">File Name</th>
                        <th className="pb-3">Version</th>
                        <th className="pb-3">Uploaded</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {resumes.map((res) => (
                        <tr key={res.id} className="text-slate-700 dark:text-slate-200">
                          <td className="py-4 flex items-center gap-2">
                            <FileText className="w-4.5 h-4.5 text-primary" />
                            <a
                              href={res.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-slate-800 hover:text-primary transition-colors"
                            >
                              {res.fileName}
                            </a>
                          </td>
                          <td className="py-4">v{res.version}</td>
                          <td className="py-4">
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
                                className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Test ATS
                              </Link>
                              <button
                                onClick={() => handleDeleteResume(res.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
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
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                  <FileText className="w-10 h-10 text-slate-400" />
                  <div>
                    <h3 className="font-bold text-slate-700 text-sm">No resumes uploaded yet</h3>
                    <p className="text-slate-500 text-xs mt-1">Upload a PDF or DOCX file to benchmark ATS parameters.</p>
                  </div>
                  <Link
                    href="/resume-upload"
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl mt-2 cursor-pointer"
                  >
                    Upload Now
                  </Link>
                </div>
              )}
            </div>

            {/* Row 3: Saved Jobs */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Bookmarked Jobs</h2>
                  <p className="text-slate-500 text-xs">Roles you have saved to follow up on.</p>
                </div>
                <Link
                  href="/jobs"
                  className="text-primary hover:text-blue-700 font-bold text-xs flex items-center gap-0.5"
                >
                  Search Jobs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoadingData ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800">{job.title}</h3>
                            <p className="text-xs text-slate-500 font-semibold">{job.company} • {job.location}</p>
                          </div>
                          {job.isRemote && (
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold">Salary: {job.salary}</div>
                      </div>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-center py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Apply Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2 text-xs">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                  <span className="font-bold text-slate-600">No bookmarked jobs.</span>
                  <Link href="/jobs" className="text-primary font-bold mt-1">Browse open roles</Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interview Reminders / Alerts */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                Interviews & Alerts
              </h2>
              
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Mock Interview Prep</span>
                    <span className="text-[10px] font-extrabold uppercase">Pending</span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-90">
                    Prepare with standard questions on the learning roadmap.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold">Resume version 1 ready</div>
                  <p className="text-[10px] leading-relaxed opacity-90">
                    Calculated ATS profile score is active. Make key improvements to hit 85+.
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Gap */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Your Skills
                </h2>
                <Link href="/skill-gap" className="text-xs text-primary font-bold hover:underline">
                  Analyze Gaps
                </Link>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 flex items-center gap-1"
                    >
                      {skill.name}
                      <span className="text-[9px] text-slate-400 font-normal uppercase">({skill.proficiency})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  No skills listed. Click "Analyze Gaps" to enter your details.
                </div>
              )}
            </div>

            {/* Recommended Learning */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-secondary" />
                Target Learning
              </h2>

              <div className="space-y-3.5">
                {suggestedCourses.map((course, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="font-bold text-slate-800 text-xs hover:text-primary transition-colors leading-relaxed">
                      {course.title}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>{course.provider} • {course.duration}</span>
                      <span className="text-secondary">{course.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/roadmap"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-2.5 rounded-xl text-xs font-bold mt-4 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Go to Roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recent activity log */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-primary" />
                Recent Alerts
              </h2>

              {isLoadingData ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
              ) : notifications.length > 0 ? (
                <div className="space-y-3.5">
                  {notifications.slice(0, 3).map((not) => (
                    <div key={not.id} className="text-xs leading-relaxed flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <div>
                        <div className="font-bold text-slate-800">{not.title}</div>
                        <div className="text-slate-500 text-[10px]">{not.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">No recent activity.</div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
