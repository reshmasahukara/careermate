"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FileCheck,
  Briefcase,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Users,
  Star,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Check,
  ShieldCheck,
  Plus,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interactive Count-up Component
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = Math.ceil(value / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const featureCards = [
    {
      title: "Resume Analyzer",
      description: "Get detailed AI feedback on experience formatting, metrics, and word impact.",
      icon: <FileText className="w-5 h-5 text-[#1E40AF]" />,
      href: "/resume-analysis"
    },
    {
      title: "ATS Score Checker",
      description: "Instantly benchmark your resume score against standard ATS parser rules.",
      icon: <FileCheck className="w-5 h-5 text-[#14B8A6]" />,
      href: "/ats-checker"
    },
    {
      title: "Job Recommendations",
      description: "Discover open positions recommended based on your technical skill profiles.",
      icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
      href: "/jobs"
    },
    {
      title: "AI Interview Preparation",
      description: "Practice mock interview questions with dynamic real-time performance analytics.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      href: "/contact"
    },
    {
      title: "Skill Gap Analysis",
      description: "Compare your resume skills with target descriptions to map out path targets.",
      icon: <Compass className="w-5 h-5 text-rose-500" />,
      href: "/skill-gap"
    },
    {
      title: "Learning Resources",
      description: "Access curated online courses and guidelines to build missing technologies.",
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      href: "/roadmap"
    }
  ];

  const timelineSteps = [
    {
      num: "01",
      title: "Upload Resume",
      desc: "Drag & drop PDF/DOCX file.",
      icon: <FileText className="w-5 h-5 text-[#1E40AF]" />
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "AI scans text for impact verbs.",
      icon: <Zap className="w-5 h-5 text-amber-500" />
    },
    {
      num: "03",
      title: "Get ATS Score",
      desc: "Benchmark keyword match score.",
      icon: <FileCheck className="w-5 h-5 text-[#14B8A6]" />
    },
    {
      num: "04",
      title: "Discover Jobs",
      desc: "Instantly find matching roles.",
      icon: <Briefcase className="w-5 h-5 text-indigo-600" />
    },
    {
      num: "05",
      title: "Build Skills & Succeed",
      desc: "Shut gaps & land the job.",
      icon: <Award className="w-5 h-5 text-emerald-600" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Frontend Developer",
      company: "Vercel",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      rating: 5,
      story: "CareerMate's ATS Checker was a game-changer. I optimized my resume with their missing keyword list and landed three interviews in a week!"
    },
    {
      name: "David Chen",
      role: "Data Analyst",
      company: "Stripe",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      story: "The skill gap analyzer mapped out exactly what SQL and dashboard metrics I was missing for Senior roles. The suggested courses filled the gap perfectly."
    },
    {
      name: "Elena Rostova",
      role: "Product Designer",
      company: "Figma",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      rating: 5,
      story: "I loved the clean SaaS design and instant suggestions. Uploading my resume gave me highly detailed critiques of my experience metrics. Highly recommended!"
    }
  ];

  return (
    <div className="w-full bg-white">
      
      {/* SECTION 2: HERO SECTION WITH DASHBOARD PREVIEW */}
      <section className="w-full bg-gradient-to-b from-[#F5F9FF] to-[#FFFFFF] relative overflow-hidden pt-[72px]">
        {/* Decorative blur blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1E40AF]/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#14B8A6]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column (45%) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1E40AF] text-xs font-bold uppercase tracking-wider">
              AI-Powered Career Growth Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[48px] lg:leading-[56px] font-black text-[#0F172A] tracking-tight">
              Build a Smarter Career Path with CareerMate
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
              Optimize your resume, improve ATS performance, discover relevant opportunities, and close skill gaps with AI-driven career guidance.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-btn shadow-sm transition-all text-center cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href="/resume-upload"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-btn shadow-sm transition-all text-center cursor-pointer"
              >
                Upload Resume
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                Free ATS Scan
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                Secure Data Handling
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                No Credit Card Required
              </span>
            </div>

            {/* Mini Social Proof */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="User 1" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" alt="User 2" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="User 3" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80" alt="User 4" />
              </div>
              <p className="text-xs text-slate-500 font-semibold leading-snug">
                <span className="text-[#0F172A] font-bold">10,000+ professionals</span> are growing their careers with CareerMate
              </p>
            </div>
          </div>

          {/* Right Column (55% / col-span-7) */}
          <div className="lg:col-span-7 w-full">
            {/* Dashboard Container Card */}
            <div className="premium-card rounded-[24px] bg-white shadow-xl overflow-hidden flex flex-col border border-[#E2E8F0] relative">
              {/* Mock Dashboard Topbar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-2 font-mono">
                    app.careermate.io/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-emerald-50 text-[#14B8A6] font-bold px-2 py-0.5 rounded-full">
                    Live System
                  </span>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="p-6 bg-slate-50/40 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch text-left">
                
                {/* Left side widgets */}
                <div className="md:col-span-7 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {/* ATS Score widget */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                      <div className="w-14 h-14 rounded-full border-[4px] border-[#14B8A6] border-t-transparent flex items-center justify-center font-black text-[#0F172A] text-sm shrink-0 mb-1.5">
                        92%
                      </div>
                      <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">ATS Score</h4>
                      <p className="text-[9px] text-emerald-600 font-bold">Excellent match</p>
                    </div>

                    {/* Resume Match Widget */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                      <div className="w-14 h-14 rounded-full border-[4px] border-[#1E40AF] border-t-transparent flex items-center justify-center font-black text-[#0F172A] text-sm shrink-0 mb-1.5">
                        88%
                      </div>
                      <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Match Rate</h4>
                      <p className="text-[9px] text-[#1E40AF] font-bold">Frontend Engineer</p>
                    </div>
                  </div>

                  {/* Skill Gap Progress Widget */}
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs space-y-3">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Skill Gap Analysis</span>
                      <span className="text-[9px] text-[#1E40AF] font-bold uppercase">Target: Stripe role</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>TypeScript</span>
                          <span>90% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1E40AF] rounded-full w-[90%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>Next.js Framework</span>
                          <span>95% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1E40AF] rounded-full w-[95%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>Docker & DevOps</span>
                          <span>60% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full w-[60%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side widgets */}
                <div className="md:col-span-5 space-y-5">
                  {/* Recommended Jobs Widget */}
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs space-y-3 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Recommended Jobs</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
                          <div className="flex justify-between items-start">
                            <h5 className="font-extrabold text-[10px] text-slate-800 leading-tight">Senior React Dev</h5>
                            <span className="bg-blue-50 text-[#1E40AF] font-black px-1.5 py-0.5 rounded text-[8px]">92%</span>
                          </div>
                          <p className="text-[8px] text-slate-400 font-semibold">Stripe • Remote • $140k</p>
                        </div>

                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
                          <div className="flex justify-between items-start">
                            <h5 className="font-extrabold text-[10px] text-slate-800 leading-tight">Frontend Engineer</h5>
                            <span className="bg-teal-50 text-[#14B8A6] font-black px-1.5 py-0.5 rounded text-[8px]">88%</span>
                          </div>
                          <p className="text-[8px] text-slate-400 font-semibold">Vercel • Hybrid • $160k</p>
                        </div>
                      </div>
                    </div>

                    {/* Roadmap Milestone status */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Learning Progress</span>
                      <div className="p-2 bg-teal-50/60 border border-teal-100 rounded-lg">
                        <div className="font-bold text-[9px] text-teal-800 flex justify-between">
                          <span>Milestone 3 of 5</span>
                          <span>65% Done</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: STATISTICS BAR */}
      <section className="w-full bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card py-8 px-6 bg-white rounded-[24px] border border-[#E2E8F0] shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
              
              {/* Stat 1 */}
              <div className="py-4 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#1E40AF]">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    <Counter value={10000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Professionals</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="py-4 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-[#14B8A6]">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    <Counter value={50000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Resumes Optimized</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="py-4 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    <Counter value={5000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Opportunities Discovered</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="py-4 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    <Counter value={95} suffix="%" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">Recommendation Accuracy</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE FEATURES GRID */}
      <section id="features" className="w-full bg-[#F8FAFC] border-t border-[#E2E8F0]/40 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Everything You Need to Grow Your Career
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
              Our advanced tool suite is engineered to streamline your job applications and accelerate career outcomes.
            </p>
          </div>

          {/* 6 feature cards in one row on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
            {featureCards.map((card, idx) => (
              <Link
                key={card.title}
                href={card.href}
                className="premium-card p-5 rounded-[20px] bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-[#E2E8F0] flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-[#0F172A] text-xs sm:text-sm tracking-tight leading-snug">{card.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{card.description}</p>
                  </div>
                </div>
                
                <span className="mt-6 text-[10px] font-bold text-[#1E40AF] flex items-center gap-1 group cursor-pointer self-start">
                  Open Tool
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: HOW CAREERMATE WORKS */}
      <section className="w-full bg-white border-t border-[#E2E8F0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Simple Steps to Career Success
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto">
              Follow our logical, step-by-step pipeline to land your next technical role.
            </p>
          </div>

          {/* Horizontal timeline connected by a line */}
          <div className="relative pt-6 max-w-5xl mx-auto">
            {/* Progress line */}
            <div className="absolute top-[38px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch text-center">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-4 text-center">
                  {/* Step bubble */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#E2E8F0] bg-white text-slate-700 mx-auto flex items-center justify-center font-bold text-xs relative shadow-xs shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-[#E2E8F0] flex items-center justify-center">
                      {step.icon}
                    </div>
                    {/* Step badge overlay */}
                    <span className="absolute -top-1 -right-1 bg-[#1E40AF] text-white font-mono text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                  
                  {/* Content details */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A]">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold max-w-[150px] mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="w-full bg-[#F8FAFC] border-t border-[#E2E8F0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Career Journeys Powered by CareerMate
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-sm mx-auto">
              Real success stories from professionals who accelerated their career goals.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.name}
                className="premium-card p-6 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  {/* Star rating */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {/* Review text */}
                  <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed font-semibold">
                    "{test.story}"
                  </p>
                </div>

                {/* Profile info */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#0F172A] leading-tight">{test.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{test.role} • <span className="font-bold text-slate-600">{test.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7: FINAL CALL-TO-ACTION BANNER */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] rounded-[24px] px-8 py-10 sm:px-12 sm:py-14 text-white shadow-xl relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
              {/* Left Column content */}
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Take the Next Step Toward Your Career Goals
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-semibold max-w-2xl">
                  Join thousands of professionals using CareerMate to optimize resumes, discover opportunities, and build future-ready skills.
                </p>
              </div>

              {/* Right Column buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center justify-end gap-3.5 w-full">
                <Link
                  href="/resume-upload"
                  className="bg-white hover:bg-slate-100 text-[#1E40AF] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-btn text-center cursor-pointer shadow-sm transition-all"
                >
                  Upload Resume
                </Link>
                <Link
                  href="/signup"
                  className="bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-btn text-center cursor-pointer shadow-sm transition-all"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
