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
  ShieldCheck
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
      icon: <FileText className="w-5 h-5 text-[#10B981]" />,
      href: "/resume-analysis"
    },
    {
      title: "ATS Score Checker",
      description: "Instantly benchmark your resume score against standard ATS parser rules.",
      icon: <FileCheck className="w-5 h-5 text-[#10B981]" />,
      href: "/ats-checker"
    },
    {
      title: "Job Recommendations",
      description: "Discover open positions recommended based on your technical skill profiles.",
      icon: <Briefcase className="w-5 h-5 text-[#10B981]" />,
      href: "/jobs"
    },
    {
      title: "AI Interview Preparation",
      description: "Practice mock interview questions with dynamic real-time performance analytics.",
      icon: <Zap className="w-5 h-5 text-[#10B981]" />,
      href: "/contact"
    },
    {
      title: "Skill Gap Analysis",
      description: "Compare your resume skills with target descriptions to map out path targets.",
      icon: <Compass className="w-5 h-5 text-[#10B981]" />,
      href: "/skill-gap"
    },
    {
      title: "Learning Resources",
      description: "Access curated online courses and guidelines to build missing technologies.",
      icon: <BookOpen className="w-5 h-5 text-[#10B981]" />,
      href: "/roadmap"
    }
  ];

  const timelineSteps = [
    {
      title: "Upload Resume",
      desc: "Drag & drop PDF or Word files.",
      icon: <FileText className="w-5 h-5 text-[#1E293B] group-hover:text-[#10B981] transition-colors" />
    },
    {
      title: "AI Analysis",
      desc: "AI scans text for impact verbs.",
      icon: <Zap className="w-5 h-5 text-[#1E293B] group-hover:text-[#10B981] transition-colors" />
    },
    {
      title: "Improve ATS Score",
      desc: "Optimize missing keyword counts.",
      icon: <FileCheck className="w-5 h-5 text-[#1E293B] group-hover:text-[#10B981] transition-colors" />
    },
    {
      title: "Discover Opportunities",
      desc: "Match jobs matching your skills.",
      icon: <Briefcase className="w-5 h-5 text-[#1E293B] group-hover:text-[#10B981] transition-colors" />
    },
    {
      title: "Build Skills & Succeed",
      desc: "Shut gap roadmaps and win roles.",
      icon: <Award className="w-5 h-5 text-[#1E293B] group-hover:text-[#10B981] transition-colors" />
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Test out basic scoring options.",
      features: [
        "1 resume upload limit",
        "Basic ATS optimization score",
        "Limited job recommendations"
      ],
      cta: "Register Account",
      action: "Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      description: "Perfect for active software job hunting.",
      features: [
        "Unlimited resume uploads",
        "Advanced ATS keyword suggestions",
        "Detailed skill gap diagnostics",
        "Advanced filterable job lists"
      ],
      cta: "Upgrade to Pro",
      action: "Pro",
      highlight: true
    },
    {
      name: "Premium",
      price: "$39",
      period: "/mo",
      description: "Accelerate development and leaders targets.",
      features: [
        "Everything in Pro plan",
        "AI career roadmaps & tracking",
        "Mock interview preparation",
        "Priority support response in 2h"
      ],
      cta: "Get Premium",
      action: "Premium",
      highlight: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Custom solutions for universities, career centers, and organizations.",
      features: [
        "Multi-user seat management",
        "University bulk licenses",
        "Custom database API integrations",
        "Dedicated success manager"
      ],
      cta: "Contact Sales",
      action: "Enterprise",
      highlight: false
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
      
      {/* 2. HERO SECTION */}
      <section className="w-full bg-[#FAFBFC] border-b border-[#E5E7EB]/70 relative overflow-hidden pt-[72px]">
        {/* Subtle decorative color blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1E293B]/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#10B981]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column (45% / col-span-5) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-[#E5E7EB] text-[#1E293B] text-xs font-bold uppercase tracking-wider">
              AI-Powered Career Growth Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] lg:leading-[1.05] font-black text-[#0F172A] tracking-tight">
              Build a Smarter Career Path with CareerMate
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
              Optimize your resume, improve ATS performance, discover relevant opportunities, and close skill gaps with AI-driven career guidance.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-btn shadow-sm transition-all text-center cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href="/resume-upload"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-[#E5E7EB] text-slate-700 font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-btn shadow-sm transition-all text-center cursor-pointer"
              >
                Upload Resume
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#10B981]" />
                Free ATS Scan
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#10B981]" />
                Secure Data Handling
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#10B981]" />
                No Credit Card Required
              </span>
            </div>

            {/* Mini Social Proof */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
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
            <div className="premium-card rounded-[24px] bg-white shadow-xl overflow-hidden flex flex-col border border-[#E5E7EB] relative">
              {/* Mock Dashboard Topbar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
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
                  <span className="text-[10px] bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded-full">
                    Live System
                  </span>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="p-6 bg-slate-50/40 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch text-left">
                
                {/* Left widgets */}
                <div className="md:col-span-7 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {/* ATS Score widget */}
                    <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                      <div className="w-14 h-14 rounded-full border-[4px] border-[#10B981] border-t-transparent flex items-center justify-center font-black text-[#0F172A] text-sm shrink-0 mb-1.5 font-sans">
                        92%
                      </div>
                      <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">ATS Score</h4>
                      <p className="text-[9px] text-[#10B981] font-bold">Excellent match</p>
                    </div>

                    {/* Resume Match Widget */}
                    <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                      <div className="w-14 h-14 rounded-full border-[4px] border-[#1E293B] border-t-transparent flex items-center justify-center font-black text-[#0F172A] text-sm shrink-0 mb-1.5 font-sans">
                        88%
                      </div>
                      <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Match Rate</h4>
                      <p className="text-[9px] text-[#1E293B] font-bold">Frontend Engineer</p>
                    </div>
                  </div>

                  {/* Skill Gap Progress Widget */}
                  <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs space-y-3">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Skill Gap Analysis</span>
                      <span className="text-[9px] text-[#1E293B] font-bold uppercase">Target: Stripe role</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>TypeScript</span>
                          <span>90% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full w-[90%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>Next.js Framework</span>
                          <span>95% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full w-[95%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold mb-0.5 text-slate-700">
                          <span>Docker & DevOps</span>
                          <span>60% Yours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full w-[60%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right widgets */}
                <div className="md:col-span-5 space-y-5">
                  {/* Recommended Jobs Widget */}
                  <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs space-y-3 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Recommended Jobs</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
                          <div className="flex justify-between items-start">
                            <h5 className="font-extrabold text-[10px] text-slate-800 leading-tight">Senior React Dev</h5>
                            <span className="bg-slate-100 text-[#1E293B] font-black px-1.5 py-0.5 rounded text-[8px]">92%</span>
                          </div>
                          <p className="text-[8px] text-slate-400 font-semibold font-sans">Stripe • Remote • $140k</p>
                        </div>

                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5">
                          <div className="flex justify-between items-start">
                            <h5 className="font-extrabold text-[10px] text-slate-800 leading-tight">Frontend Engineer</h5>
                            <span className="bg-emerald-50 text-[#10B981] font-black px-1.5 py-0.5 rounded text-[8px]">88%</span>
                          </div>
                          <p className="text-[8px] text-slate-400 font-semibold font-sans">Vercel • Hybrid • $160k</p>
                        </div>
                      </div>
                    </div>

                    {/* Learning Roadmap Widget */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Learning Progress</span>
                      <div className="p-2 bg-teal-50/60 border border-teal-100 rounded-lg">
                        <div className="font-bold text-[9px] text-[#10B981] flex justify-between font-sans">
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

      {/* 3. CORE FEATURES */}
      <section id="features" className="w-full bg-[#FFFFFF] border-b border-[#E5E7EB]/70 scroll-mt-24">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
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
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="premium-card p-5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-[#E5E7EB] flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-[#0F172A] text-xs sm:text-sm tracking-tight leading-snug">{card.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{card.description}</p>
                  </div>
                </div>
                
                <span className="mt-6 text-[10px] font-bold text-[#1E293B] flex items-center gap-1 group cursor-pointer self-start">
                  Open Tool
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HOW CAREERMATE WORKS */}
      <section className="w-full bg-[#F8FAFC] border-b border-[#E5E7EB]/70">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Simple Steps to Career Success
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto">
              A guided journey from resume optimization to career growth.
            </p>
          </div>

          {/* Horizontal timeline responsive with scroll on mobile */}
          <div className="overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            <div className="min-w-[850px] relative">
              {/* Continuous horizontal line crossing exactly through the circles center */}
              <div className="absolute top-[64px] left-[10%] right-[10%] h-[2px] bg-slate-200/70 -z-10" />

              <div className="grid grid-cols-5 gap-6 text-center">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    {/* Step Number Above Icon */}
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#10B981] transition-colors uppercase tracking-widest block mb-3">
                      Step {idx + 1}
                    </span>

                    {/* Circular Icon Container (72px) */}
                    <div className="w-[72px] h-[72px] rounded-full border border-[#E5E7EB] bg-white shadow-xs flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#10B981] group-hover:shadow-md cursor-pointer shrink-0">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>

                    {/* Spacing 24px between icon and title */}
                    <div className="mt-6 space-y-3">
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A] tracking-tight group-hover:text-[#10B981] transition-colors">
                        {step.title}
                      </h4>
                      {/* Spacing 12px between title and description */}
                      <p className="text-[11px] text-slate-400 leading-normal font-semibold max-w-[155px] mx-auto">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PRICING */}
      <section className="w-full bg-[#FFFFFF] border-b border-[#E5E7EB]/70">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
              Pricing Plans
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Choose the Plan That Matches Your Goals
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">
              Start free and upgrade as your career journey evolves.
            </p>
          </div>

          {/* 4 pricing columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {pricingPlans.map((plan) => {
              return (
                <div
                  key={plan.name}
                  className={`premium-card p-6 rounded-card bg-white flex flex-col justify-between ${
                    plan.highlight 
                      ? "border-[#10B981] ring-2 ring-[#10B981]/5 shadow-md shadow-[#10B981]/5 bg-[#10B981]/[0.005]" 
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        plan.highlight ? "bg-[#10B981]/10 text-[#10B981]" : "bg-slate-100 text-slate-500"
                      }`}>
                        {plan.name}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-black text-slate-900 font-sans">{plan.price}</span>
                        {plan.period && (
                          <span className="text-slate-400 font-semibold text-xs ml-1">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs leading-normal font-semibold">{plan.description}</p>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Checklist */}
                    <ul className="space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-relaxed text-left">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/pricing"
                      className={`w-full py-2.5 rounded-btn text-xs font-bold uppercase tracking-wider text-center block transition-all cursor-pointer ${
                        plan.highlight
                          ? "bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm"
                          : "bg-white hover:bg-slate-50 border border-[#E5E7EB] text-slate-700"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="w-full bg-[#F8FAFC] border-b border-[#E5E7EB]/70">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
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
                className="premium-card p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between text-left"
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

      {/* 7. STATISTICS SECTION */}
      <section className="w-full bg-[#F1F5F9] border-b border-[#E5E7EB]/70">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-200/50 border border-[#E5E7EB] px-3 py-1 rounded-full">
              Statistics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Growing Careers Worldwide
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto">
              Empowering professionals globally with quantitative credentials and opportunities.
            </p>
          </div>

          <div className="premium-card py-12 px-6 bg-white rounded-[32px] border border-[#E5E7EB] shadow-md max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
              
              {/* Stat 1 */}
              <div className="py-6 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#1E293B]">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight font-sans">
                    <Counter value={10000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Active Professionals</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="py-6 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#10B981]">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight font-sans">
                    <Counter value={50000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Resumes Optimized</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="py-6 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#1E293B]">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight font-sans">
                    <Counter value={5000} suffix="+" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Opportunities Discovered</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="py-6 md:py-0 flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#10B981]">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight font-sans">
                    <Counter value={95} suffix="%" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Recommendation Accuracy</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="w-full bg-[#FFFFFF]">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px]">
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
                  className="bg-white hover:bg-slate-100 text-[#1E293B] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-btn text-center cursor-pointer shadow-sm transition-all"
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
