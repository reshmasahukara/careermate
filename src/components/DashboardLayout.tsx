"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Upload,
  FileCheck,
  Briefcase,
  Award,
  BookOpen,
  Heart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Search,
  User,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // If not logged in, render child directly so it can show its own login fallback screen
  if (!session) {
    return <div className="min-h-screen bg-[#F8FAFC]">{children}</div>;
  }

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Resume", href: "/resume-upload", icon: Upload },
    { name: "ATS Checker", href: "/ats-checker", icon: FileCheck },
    { name: "Job Board", href: "/jobs", icon: Briefcase },
    { name: "Skill Gaps", href: "/skill-gap", icon: Award },
    { name: "Learning Roadmap", href: "/roadmap", icon: BookOpen },
    { name: "Saved Jobs", href: "/jobs?tab=saved", icon: Heart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/resume-upload") return "Resume Upload";
    if (pathname === "/ats-checker") return "ATS Match Checker";
    if (pathname === "/jobs") return "Job Listings";
    if (pathname === "/skill-gap") return "Skill Gap Analysis";
    if (pathname === "/roadmap") return "Learning Roadmap";
    if (pathname === "/settings") return "Account Settings";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex relative">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileSidebar}
            className="fixed inset-0 bg-[#0F172A] z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-[#E2E8F0] z-50 transition-all duration-300 flex flex-col justify-between 
          ${isCollapsed ? "w-[72px]" : "w-[260px]"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Branding Section */}
        <div>
          <div className="h-[72px] border-b border-[#E2E8F0] flex items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2 group shrink-0 overflow-hidden">
              <div className="w-9 h-9 rounded-[10px] bg-[#2563EB] flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                CM
              </div>
              {!isCollapsed && (
                <span className="font-extrabold text-lg tracking-tight text-[#0F172A] transition-opacity duration-200">
                  CareerMate
                </span>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group cursor-pointer
                    ${
                      isActive
                        ? "bg-[#2563EB]/5 text-[#2563EB]"
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#0F172A]"}`} />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Collapse & User Options */}
        <div className="border-t border-[#E2E8F0] p-3.5 space-y-2">
          {/* Quick Help Link */}
          <Link
            href="/about"
            className="flex items-center gap-3 px-3 py-2 rounded-[12px] text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Help & Docs</span>}
          </Link>

          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-2 p-1 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-[10px] bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-xs shrink-0">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0 pr-1">
                  <p className="text-xs font-bold text-[#0F172A] truncate leading-tight">
                    {session?.user?.name || "Alex Morgan"}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate leading-tight mt-0.5">
                    {session?.user?.email || "alex@example.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button in Compact / Expanded View */}
            {(!isCollapsed || isMobileOpen) && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-[12px] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 
          ${isCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"}
        `}
      >
        {/* Global Dashboard Top Navbar */}
        <header className="h-[72px] bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle (Mobile Only) */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            
            {/* Breadcrumb / Title */}
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">{getPageTitle()}</h2>
            </div>
          </div>

          {/* Actions & Profiles */}
          <div className="flex items-center gap-4">
            
            {/* Global Search (Simulated) */}
            <div className="hidden sm:block relative w-64">
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
            </div>

            {/* Notification Bells */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-[12px] bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0]/60 text-[#64748B] hover:text-[#0F172A] transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
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
                      className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-[20px] shadow-lg py-4 px-4 z-40 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
                        <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Recent Alerts</span>
                        <span className="text-[10px] font-bold text-[#2563EB] cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs leading-relaxed">
                          <div className="font-bold text-[#0F172A]">ATS Profile Updated</div>
                          <div className="text-[#64748B] text-[10px] mt-0.5">Your technical keywords list was matched against live roles.</div>
                        </div>
                        <div className="text-xs leading-relaxed">
                          <div className="font-bold text-[#0F172A]">Mock Interview Scheduled</div>
                          <div className="text-[#64748B] text-[10px] mt-0.5">Prepare with standard backend questions from your roadmap.</div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Upgrade CTA */}
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-1 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2 rounded-[12px] shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Upgrade to Pro
            </Link>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
