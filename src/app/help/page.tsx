"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, BookOpen, FileText, Briefcase, Zap, Compass, ArrowRight, ShieldCheck } from "lucide-react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      articles: [
        { title: "How to upload your first resume", href: "/help/upload-resume" },
        { title: "Understanding your Dashboard", href: "/help/dashboard-guide" },
        { title: "Setting your career goals", href: "/help/career-goals" }
      ]
    },
    {
      title: "ATS Optimization",
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      articles: [
        { title: "How ATS parsing works", href: "/help/ats-parsing" },
        { title: "Improving your keyword match rate", href: "/help/keyword-match" },
        { title: "Common formatting mistakes", href: "/help/formatting-mistakes" }
      ]
    },
    {
      title: "Skill Gap Analysis",
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      articles: [
        { title: "Reading your radar charts", href: "/help/radar-charts" },
        { title: "Adding custom skills", href: "/help/custom-skills" },
        { title: "Industry standards methodology", href: "/help/industry-standards" }
      ]
    },
    {
      title: "Learning Roadmaps",
      icon: <Compass className="w-6 h-6 text-amber-500" />,
      articles: [
        { title: "Tracking milestone progress", href: "/help/milestone-progress" },
        { title: "Generating a custom roadmap", href: "/help/custom-roadmap" },
        { title: "Finding learning resources", href: "/help/learning-resources" }
      ]
    },
    {
      title: "Job Board",
      icon: <Briefcase className="w-6 h-6 text-rose-500" />,
      articles: [
        { title: "Applying directly through CareerMate", href: "/help/apply-directly" },
        { title: "Filtering jobs by experience level", href: "/help/filter-jobs" },
        { title: "Setting up job alerts", href: "/help/job-alerts" }
      ]
    },
    {
      title: "Account & Billing",
      icon: <ShieldCheck className="w-6 h-6 text-slate-500" />,
      articles: [
        { title: "Managing your subscription", href: "/help/subscription" },
        { title: "Upgrading to Pro", href: "/help/upgrade-pro" },
        { title: "Data privacy and security", href: "/help/privacy" }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">How can we help?</h1>
          <p className="text-[#64748B] text-lg">Search our knowledge base or browse categories below to find exactly what you need.</p>
          
          <div className="relative mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pl-14 transition-all"
            />
            <Search className="absolute left-5 top-4 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {categories.map((category, idx) => (
            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  {category.icon}
                </div>
                <h2 className="font-bold text-[#0F172A]">{category.title}</h2>
              </div>
              <ul className="space-y-3">
                {category.articles.map((article, aIdx) => (
                  <li key={aIdx}>
                    <Link href={article.href} className="text-sm font-medium text-slate-600 hover:text-emerald-600 flex items-center gap-2 group">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-6 hover:text-emerald-700">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-[#0F172A] rounded-[20px] p-8 text-center text-white mt-12 shadow-lg">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Our support team is available 24/7 to help you with any issues or questions you might have.</p>
          <a href="mailto:support@careermate.com" className="inline-block bg-white text-[#0F172A] font-bold py-3 px-8 rounded-full text-sm hover:bg-slate-100 transition-colors shadow-sm">
            Contact Support
          </a>
        </div>

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Return to your Career Workspace Overview</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Head back to the main workspace dashboard to view resume match rates, learning milestones, and AI recommendations.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Temporary mock Target icon component since it was not exported from lucide-react in the top import
function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
