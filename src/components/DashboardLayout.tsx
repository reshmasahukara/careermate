"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Upload,
  Sparkles,
  FileSearch,
  FileCheck,
  Briefcase,
  Award,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  MessageSquare,
  TrendingUp,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { getNotificationsAction, markNotificationsAsReadAction } from "@/app/actions/settings";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Mobile Drawer collapsible states
  const [dbGroupOpen, setDbGroupOpen] = useState(true);
  const [rhGroupOpen, setRhGroupOpen] = useState(true);

  // Close mobile drawer on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if ((session?.user as any)?.id) {
      loadNotifications();
    }
  }, [(session?.user as any)?.id]);

  const loadNotifications = async () => {
    if (!session?.user) return;
    const userId = (session?.user as any).id || "demo-user-123";
    try {
      const notifs = await getNotificationsAction(userId);
      setNotifications(notifs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    if (!session?.user) return;
    const userId = (session?.user as any).id || "demo-user-123";
    try {
      await markNotificationsAsReadAction(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // If not logged in, render child directly so it can show its own login fallback screen
  if (!session) {
    return <div className="min-h-screen bg-[#F7F8FA]">{children}</div>;
  }

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/resume-upload") return "Resume Analyzer";
    if (pathname === "/resume-builder") return "Resume Builder";
    if (pathname === "/resume-analysis") return "Resume Analyzer";
    if (pathname === "/ats-checker") return "ATS Checker";
    if (pathname === "/jobs") return "Job Board";
    if (pathname === "/skill-gap") return "Skill Gap Analysis";
    if (pathname === "/roadmap") return "Learning Roadmap";
    if (pathname === "/career-insights") return "Career Insights";
    if (pathname === "/settings") return "Settings";
    return "Workspace";
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0F172A] flex relative">
      
      {/* ── Desktop Sidebar Navigation ── */}
      <Sidebar
        session={session}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* ── Mobile/Tablet Slide-out Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-[#0F172A] z-40 lg:hidden"
            />
            {/* Drawer Container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 bg-white border-r border-[#E5E7EB] z-50 w-[280px] flex flex-col justify-between lg:hidden"
            >
              <div>
                {/* Header inside drawer */}
                <div className="h-[76px] border-b border-[#E5E7EB] flex items-center justify-between px-4">
                  <div className="flex items-center gap-1.5">
                    <Link href="/" className="p-1.5 rounded-lg hover:bg-[#F2F5F9] text-[#64748B] hover:text-[#0F172A]" title="Back to Home">
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                      <Logo className="w-7 h-7" hideWordmark={false} />
                    </Link>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[#F2F5F9] text-[#64748B] hover:text-[#0F172A]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scroller inside drawer */}
                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar">
                  
                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${
                      pathname === "/dashboard" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Resume Hub Collapsible Group */}
                  <div>
                    <button
                      onClick={() => setRhGroupOpen(!rhGroupOpen)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group ${
                        pathname === "/resume-upload" || pathname === "/resume-builder" || pathname === "/resume-analysis" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="w-4.5 h-4.5" />
                        <span>Resume Hub</span>
                      </div>
                      {rhGroupOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {rhGroupOpen && (
                      <div className="mt-1 pl-10 space-y-1">
                        <Link href="/resume-analysis" className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold ${pathname === "/resume-analysis" ? "text-[#10B981] bg-[#10B981]/10" : "text-[#64748B]"}`}><FileSearch className="w-3.5 h-3.5" /> Resume Analyzer</Link>
                        <Link href="/resume-builder" className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold ${pathname === "/resume-builder" ? "text-[#10B981] bg-[#10B981]/10" : "text-[#64748B]"}`}><Sparkles className="w-3.5 h-3.5" /> Resume Builder</Link>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-[#E5E7EB] my-2" />

                  {/* Rest of the links */}
                  <Link href="/ats-checker" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/ats-checker" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <FileCheck className="w-4.5 h-4.5" /> <span>ATS Checker</span>
                  </Link>
                  <Link href="/jobs" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/jobs" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <Briefcase className="w-4.5 h-4.5" /> <span>Job Board</span>
                  </Link>
                  <Link href="/skill-gap" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/skill-gap" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <Award className="w-4.5 h-4.5" /> <span>Skill Gap Analysis</span>
                  </Link>
                  <Link href="/roadmap" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/roadmap" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <BookOpen className="w-4.5 h-4.5" /> <span>Learning Roadmap</span>
                  </Link>
                  <Link href="/career-insights" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/career-insights" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <TrendingUp className="w-4.5 h-4.5" /> <span>Career Insights</span>
                  </Link>

                   <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${pathname === "/settings" ? "bg-[#10B981]/5 text-[#10B981]" : "text-[#64748B]"}`}>
                    <Settings className="w-4.5 h-4.5" /> <span>Settings</span>
                  </Link>

                </nav>
              </div>

              {/* Drawer User Card */}
              <div className="border-t border-[#E5E7EB] p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-xs">
                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate leading-none">{session?.user?.name || "Alex Morgan"}</p>
                    <p className="text-[10px] text-[#64748B] truncate mt-1 leading-none">{session?.user?.email || "alex@example.com"}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 rounded-lg hover:bg-white text-rose-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Workspace Frame ── */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 pb-16 lg:pb-0
          ${isCollapsed ? "lg:pl-[76px]" : "lg:pl-[270px]"}
        `}
      >
        {/* Global Dashboard Top Navbar */}
        <header className="h-[76px] bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle (Mobile Only) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#F7F8FA] text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            
            {/* Breadcrumb / Title */}
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">{getPageTitle()}</h2>
            </div>
          </div>

          {/* Actions & Profiles */}
          <div className="flex items-center gap-4">
            
            {/* Global Search (Preserved) */}
            <div className="hidden sm:block relative w-64">
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[12px] py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-[#10B981] focus:bg-white transition-all text-[#0F172A]"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
            </div>

            {/* Notification Bells */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-[12px] bg-[#F7F8FA] hover:bg-[#F2F5F9] border border-[#E5E7EB]/60 text-[#64748B] hover:text-[#0F172A] transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />}
              </button>

              {/* Notification Overlay Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-[20px] shadow-lg py-4 px-4 z-40 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]/60">
                        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Recent Alerts</span>
                        {unreadCount > 0 && (
                          <span 
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-[#10B981] cursor-pointer hover:underline"
                          >
                            Mark all read
                          </span>
                        )}
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="text-xs text-slate-400 italic text-center py-4">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`text-xs leading-relaxed p-2 rounded-lg ${n.isRead ? 'opacity-60' : 'bg-slate-50'}`}>
                              <div className="font-bold text-[#0F172A]">{n.title}</div>
                              <div className="text-[#64748B] text-[10px] mt-0.5">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Upgrade CTA */}
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-[#10B981] to-[#6366F1] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-[12px] shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Upgrade to Pro
            </Link>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile/Tablet Bottom Navigation Bar ── */}
      <MobileNavigation toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />

    </div>
  );
}
