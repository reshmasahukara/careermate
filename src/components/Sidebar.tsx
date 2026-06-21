"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  ChevronDown,
  ChevronUp,
  LogOut,
  TrendingUp,
  ArrowLeft,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

interface SidebarProps {
  session: any;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ session, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [resumeHubOpen, setResumeHubOpen] = useState(true);

  // Helper to verify if route is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const resumeHubItems = [
    { name: "Resume Analyzer", href: "/resume-analysis", icon: FileSearch },
    { name: "Resume Builder", href: "/resume-builder", icon: Sparkles }
  ];

  const mainNavItems = [
    { name: "ATS Checker", href: "/ats-checker", icon: FileCheck },
    { name: "Job Board", href: "/jobs", icon: Briefcase },
    { name: "Skill Gap Analysis", href: "/skill-gap", icon: Award },
    { name: "Career Pathways", href: "/career-pathways", icon: BookOpen }
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 bg-white border-r border-[#E5E7EB] z-50 transition-all duration-300 flex flex-col justify-between hidden lg:flex
        ${isCollapsed ? "w-[76px]" : "w-[270px]"}
      `}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-[76px] border-b border-[#E5E7EB] flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Link href="/" className="p-1.5 rounded-lg hover:bg-[#F2F5F9] text-[#64748B] hover:text-[#0F172A] cursor-pointer" title="Back to Home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 group shrink-0 overflow-hidden">
              <Logo className="w-7 h-7" hideWordmark={isCollapsed} />
            </Link>
          </div>

          {/* Collapse Sidebar Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[#F2F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer hidden lg:block"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)] no-scrollbar">
          
          {/* Dashboard Direct Link */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group cursor-pointer
              ${
                pathname === "/dashboard"
                  ? "bg-[#10B981]/5 text-[#10B981]"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F7F8FA]"
              }
            `}
          >
            <LayoutDashboard className={`w-4.5 h-4.5 shrink-0 ${pathname === "/dashboard" ? "text-[#10B981]" : "text-[#64748B] group-hover:text-[#0F172A]"}`} />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </Link>

          {/* Resume Hub Group */}
          <div>
            <button
              onClick={() => !isCollapsed && setResumeHubOpen(!resumeHubOpen)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group cursor-pointer ${
                isActive("/resume-upload") || isActive("/resume-builder") || isActive("/resume-analysis")
                  ? "bg-[#10B981]/5 text-[#10B981]"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F7F8FA]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Upload className={`w-4.5 h-4.5 shrink-0 ${isActive("/resume-upload") || isActive("/resume-builder") || isActive("/resume-analysis") ? "text-[#10B981]" : "text-[#64748B] group-hover:text-[#0F172A]"}`} />
                {!isCollapsed && <span className="truncate">Resume Hub</span>}
              </div>
              {!isCollapsed && (
                resumeHubOpen ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />
              )}
            </button>

            {/* Resume Hub Submenu */}
            <AnimatePresence initial={false}>
              {resumeHubOpen && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-1 pl-10 space-y-1"
                >
                  {resumeHubItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    const SubIcon = subItem.icon;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold transition-all ${
                          isSubActive
                            ? "bg-[#10B981]/10 text-[#10B981]"
                            : "text-[#64748B] hover:bg-[#F7F8FA] hover:text-[#0F172A]"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        {subItem.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Spacer Line */}
          <div className="h-px bg-[#E5E7EB] my-2" />

          {/* Main Navigation Sections */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group cursor-pointer
                  ${
                    active
                      ? "bg-[#10B981]/5 text-[#10B981]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F7F8FA]"
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-[#10B981]" : "text-[#64748B] group-hover:text-[#0F172A]"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}

          {/* Spacer Line */}
          <div className="h-px bg-[#E5E7EB] my-2" />

          {/* Settings */}
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all group cursor-pointer
                  ${
                    active
                      ? "bg-[#10B981]/5 text-[#10B981]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F7F8FA]"
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-[#10B981]" : "text-[#64748B] group-hover:text-[#0F172A]"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}

        </nav>
      </div>

      {/* Footer Area with User Options */}
      <div className="border-t border-[#E5E7EB] p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2 p-1.5 bg-[#F7F8FA] rounded-[16px] border border-[#E5E7EB]/50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-bold text-xs shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            {!isCollapsed && (
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

          {!isCollapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
