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
  Calendar,
  Lock
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
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
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const featureCards = [
    {
      title: "Calculate ATS Score",
      description: "Instantly benchmark your resume score against standard ATS parser algorithms.",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      href: "/ats-checker"
    },
    {
      title: "Analyze Resume",
      description: "Get detailed AI feedback on experience formatting, metrics, and word impact.",
      icon: <FileText className="w-5 h-5 text-secondary" />,
      href: "/resume-analysis"
    },
    {
      title: "Discover Jobs",
      description: "Search open positions recommended based on your technical skill profiles.",
      icon: <Briefcase className="w-5 h-5 text-accent" />,
      href: "/jobs"
    },
    {
      title: "Identify Skill Gaps",
      description: "Compare your resume skills with target descriptions to map out path targets.",
      icon: <Compass className="w-5 h-5 text-emerald-500" />,
      href: "/skill-gap"
    }
  ];

  const steps = [
    { num: "01", title: "Upload Resume", desc: "Drag & drop PDF/DOCX." },
    { num: "02", title: "Analyze ATS Score", desc: "Scan target matching keywords." },
    { num: "03", title: "Identify Skill Gaps", desc: "Check missing technologies." },
    { num: "04", title: "Discover Jobs", desc: "Unlock matches & roadmaps." }
  ];

  const featuresList = [
    {
      title: "AI Resume Analysis",
      desc: "Our model screens your experience blocks, highlighting weak action verbs and recommending metric achievements.",
      preview: (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-brand-border">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Experience Impact</span>
            <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full uppercase">Action required</span>
          </div>
          <div className="p-4 bg-slate-50 border border-brand-border rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-800">"Responsible for React code"</span>
              <span className="text-slate-400 font-medium">Weak verb</span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
              👉 Replace with: <span className="text-slate-900 font-bold">"Engineered high-performance React modules improving load speeds by 40%."</span>
            </p>
          </div>
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
            <div className="flex justify-between text-xs font-semibold text-emerald-800">
              <span>"Led frontend restructuring"</span>
              <span className="text-emerald-600 font-medium">Strong verb</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              Perfect formatting with quantified results.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "ATS Optimization",
      desc: "Benchmark matching percentages against specific job specs, scanning for missing skills and structure flags.",
      preview: (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Keyword Match</span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">85% MATCH</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Found (12)</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">Next.js</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">Prisma</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">PostgreSQL</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100">React</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Missing (2)</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-rose-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-rose-100">TypeScript</span>
                <span className="bg-rose-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-rose-100">GraphQL</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Job Matching",
      desc: "Skip generic job listings. Get recommended roles matching the technologies extracted from your resume.",
      preview: (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recommended Positions</span>
          </div>
          <div className="p-3 bg-slate-50 border border-brand-border rounded-xl flex justify-between items-center gap-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800">Senior Full-Stack Engineer</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Vercel • Remote • $140k - $170k</p>
            </div>
            <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">92% Match</span>
          </div>
          <div className="p-3 bg-slate-50 border border-brand-border rounded-xl flex justify-between items-center gap-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800">Software Engineer (Frontend)</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Stripe • San Francisco • $130k - $160k</p>
            </div>
            <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">85% Match</span>
          </div>
        </div>
      )
    },
    {
      title: "Skill Gap Analysis",
      desc: "Visualize your technical profile against market targets using analytical double-axis graphs.",
      preview: (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gap Diagnostic</span>
            <span className="text-xs font-bold text-rose-500">Critical missing skills</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Docker & DevOps</span>
                <span className="text-rose-500 font-bold">60% Gap</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-[40%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>TypeScript</span>
                <span className="text-rose-500 font-bold">30% Gap</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Learning Roadmaps",
      desc: "Unlock custom timeline roadmaps loaded with recommended online courses to shut down skill gaps.",
      preview: (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Suggested Milestones</span>
          </div>
          <div className="flex gap-3 items-start p-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">Week 1: TypeScript Fundamentals</span>
              <span className="text-[10px] text-slate-400 font-semibold">Udemy Course • 4.8 Rating • 6 Hours</span>
            </div>
          </div>
          <div className="flex gap-3 items-start p-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
            <div className="text-xs">
              <span className="font-bold text-slate-600 block">Week 2: Docker Containers & Deployments</span>
              <span className="text-[10px] text-slate-400 font-semibold">Coursera Course • 4.7 Rating • 8 Hours</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Career Progress Tracking",
      desc: "Record historical scans, follow applications bookmark status, and track weekly checklist targets.",
      preview: (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dashboard Alert</span>
          </div>
          <div className="p-4 bg-blue-50/50 border border-blue-100 text-slate-800 rounded-xl text-xs space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              Interview Prep Target
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              You've successfully closed 2 skill gaps this week! Your scheduled resume mock review begins in 24 hours.
            </p>
          </div>
        </div>
      )
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
      role: "Frontend Developer at Vercel",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      rating: 5,
      story: "CareerMate's ATS Checker was a game-changer. I optimized my resume with their missing keyword list and landed three interviews in a week!"
    },
    {
      name: "David Chen",
      role: "Data Analyst at Stripe",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      story: "The skill gap analyzer mapped out exactly what SQL and dashboard metrics I was missing for Senior roles. The suggested courses filled the gap perfectly."
    },
    {
      name: "Elena Rostova",
      role: "Product Designer at Figma",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      rating: 5,
      story: "I loved the clean SaaS design and instant suggestions. Uploading my resume gave me highly detailed critiques of my experience metrics. Highly recommended!"
    }
  ];

  const faqs = [
    {
      question: "What is an ATS, and how does CareerMate score my resume?",
      answer: "An Applicant Tracking System (ATS) is software employers use to screen resume files based on keyword match. CareerMate uses simulated ATS parsing algorithms to evaluate your resume against specified roles, highlighting match scores, missing keywords, and layout flags."
    },
    {
      question: "Which document formats do you support?",
      answer: "We support PDF and DOCX uploads, which are the standard formats accepted by company portals. For best results, we recommend uploading standard, single-column PDF formatting."
    },
    {
      question: "Is my personal data secure?",
      answer: "Yes, data security and privacy are our top priorities. All uploaded resumes are stored securely in Cloudinary/PostgreSQL and are never sold or shared. You can delete your account and files at any time through Settings."
    }
  ];

  // Mock Mini Chart Data for Hero Preview
  const previewChartData = [
    { name: "v1", score: 62 },
    { name: "v2", score: 74 },
    { name: "v3", score: 85 },
    { name: "v4", score: 92 },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[72px]">
      
      {/* 2. HERO SECTION */}
      <section className="section-padding flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-brand-border text-slate-700 text-xs font-semibold">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Trusted by 10,000+ professionals
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[56px] md:leading-[64px] font-bold text-brand-text tracking-tight max-w-3xl">
          Build a Smarter Career Path with CareerMate
        </h1>

        <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl mx-auto font-medium">
          Upload your resume, optimize your ATS score, discover relevant jobs, and identify skill gaps with AI-powered career guidance.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-primary hover:bg-blue-800 text-white font-bold text-sm px-8 py-3.5 rounded-btn shadow-sm transition-colors text-center cursor-pointer"
          >
            Get Started
          </Link>
          <Link
            href="/resume-upload"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-brand-border text-slate-700 font-bold text-sm px-8 py-3.5 rounded-btn shadow-sm transition-colors text-center cursor-pointer"
          >
            Upload Resume
          </Link>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 pt-6 text-xs font-semibold text-brand-muted">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            Free ATS scan
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            Secure data handling
          </span>
        </div>
      </section>

      {/* 3. FEATURE CARDS */}
      <section className="section-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-brand-border">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="premium-card p-6 rounded-card bg-brand-surface flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-brand-border flex items-center justify-center text-primary">
                {card.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{card.description}</p>
            </div>
            <span className="mt-6 text-xs font-bold text-primary flex items-center gap-1 group cursor-pointer self-start">
              Open Module
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </section>

      {/* 4. HOW CAREERMATE WORKS SECTION */}
      <section className="section-padding space-y-12 border-t border-brand-border">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
            How CareerMate Works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto">
            A precise, logical flow designed to help candidates optimize CV matching. Click each step to preview.
          </p>
        </div>

        {/* Symmetrical horizontal steps connected by progress line */}
        <div className="relative pt-6 max-w-4xl mx-auto">
          {/* Progress bar line */}
          <div className="absolute top-[38px] left-[12%] right-[12%] h-[2px] bg-slate-200 -z-10">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-stretch text-center">
            {steps.map((step, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveStep(idx)}
                className="group flex flex-col items-center space-y-4 text-center cursor-pointer focus:outline-none"
              >
                <div className={`w-10 h-10 rounded-full border-2 mx-auto flex items-center justify-center font-bold text-xs relative shadow-sm transition-all duration-300 ${
                  activeStep >= idx 
                    ? "bg-primary border-primary text-white scale-110" 
                    : "bg-white border-brand-border text-slate-400"
                }`}>
                  {step.num}
                </div>
                <div className="space-y-1.5">
                  <h4 className={`font-bold text-sm transition-colors duration-300 ${
                    activeStep === idx ? "text-primary font-extrabold" : "text-slate-900"
                  }`}>{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-normal font-semibold max-w-[180px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <div className="mt-8 max-w-2xl mx-auto premium-card p-6 rounded-card bg-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {activeStep === 0 && <FileText className="w-6 h-6" />}
            {activeStep === 1 && <FileCheck className="w-6 h-6" />}
            {activeStep === 2 && <Compass className="w-6 h-6" />}
            {activeStep === 3 && <Briefcase className="w-6 h-6" />}
          </div>
          <div className="space-y-2 text-left flex-1">
            <h4 className="font-bold text-base text-slate-900">
              {activeStep === 0 && "Step 1: Upload Your Profile Resume"}
              {activeStep === 1 && "Step 2: Interactive ATS Scoring Analysis"}
              {activeStep === 2 && "Step 3: Analyze & Close Skill Gaps"}
              {activeStep === 3 && "Step 4: Unlock Jobs & Custom Roadmaps"}
            </h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {activeStep === 0 && "Simply upload your PDF or Word resume. Our secure parsing engine extracts work experience, educational history, credentials, and listed skills without selling your data."}
              {activeStep === 1 && "We run your resume content through modern ATS parser rules to benchmark scores. We identify missing keywords, readability flags, and formatting suggestions to improve match rate."}
              {activeStep === 2 && "Compare your parsed credentials directly against standard market requirements. Get a transparent visualization of exact technical tools, frameworks, and workflows you lack."}
              {activeStep === 3 && "Receive curated job listings based on your skill matching percentage. Access structured week-by-week learning courses to upgrade skills and transition profiles smoothly."}
            </p>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES SECTION */}
      <section id="features" className="section-padding grid grid-cols-1 lg:grid-cols-12 gap-12 items-center scroll-mt-24 border-t border-brand-border">
        
        {/* Left column - descriptions (col 6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
              Enterprise features built for growth
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">
              Select an item below to see the corresponding module display previews.
            </p>
          </div>

          <div className="space-y-3">
            {featuresList.map((feature, i) => {
              const isActive = activeFeature === i;
              return (
                <button
                  key={feature.title}
                  onClick={() => setActiveFeature(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex gap-3.5 items-start cursor-pointer ${
                    isActive
                      ? "bg-white border-primary shadow-sm"
                      : "bg-transparent border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-slate-500 font-semibold leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column - product preview mockups with browser terminal wrap */}
        <div className="lg:col-span-6 bg-white border border-brand-border rounded-card shadow-sm overflow-hidden flex flex-col min-h-[360px]">
          <div className="bg-slate-50/80 px-4 py-3 border-b border-brand-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              careermate_console.tsx
            </span>
            <div className="w-10" />
          </div>
          
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center bg-white">
            <div className="w-full space-y-4">
              {featuresList[activeFeature].preview}
            </div>
          </div>
        </div>
      </section>

      {/* 6. DASHBOARD PREVIEW SECTION */}
      <section className="section-padding bg-slate-50/50 border-y border-brand-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
              Platform Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
              Career Insights Dashboard
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
              Real-time career optimization metrics, recommendations, and roadmap tracking at your fingertips.
            </p>
          </div>

          {/* High-Fidelity Mockup Container */}
          <div className="premium-card rounded-card bg-white shadow-md overflow-hidden flex flex-col border border-brand-border max-w-5xl mx-auto">
            
            {/* Mock Dashboard Topbar Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-2">
                  app.careermate.io/dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-6 bg-slate-200/60 rounded-full animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="p-6 sm:p-8 bg-slate-50/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column widgets (col-8) */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Score cards & Match Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* ATS Score widget */}
                  <div className="p-5 bg-white border border-brand-border rounded-xl flex items-center gap-5 shadow-sm">
                    <div className="w-16 h-16 rounded-full border-[5px] border-emerald-500 border-t-transparent flex items-center justify-center font-black text-slate-800 text-base shadow-sm shrink-0">
                      92%
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">ATS Score</h4>
                      <p className="text-xs text-emerald-600 font-bold">Excellent match strength</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">Ready for enterprise review gates</p>
                    </div>
                  </div>

                  {/* Resume Match Score Widget */}
                  <div className="p-5 bg-white border border-brand-border rounded-xl flex items-center gap-5 shadow-sm">
                    <div className="w-16 h-16 rounded-full border-[5px] border-primary border-t-transparent flex items-center justify-center font-black text-slate-800 text-base shadow-sm shrink-0">
                      88%
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Role Match Score</h4>
                      <p className="text-xs text-primary font-bold">Senior Frontend Engineer</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-normal">Matched with target Stripe vacancy</p>
                    </div>
                  </div>

                </div>

                {/* Skill Gap Progress Widget */}
                <div className="p-5 bg-white border border-brand-border rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skill Gap Progress</span>
                    <span className="text-[10px] text-primary font-bold uppercase">Stripe Target profile</span>
                  </div>
                  
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>TypeScript</span>
                        <span>90% Yours / 100% Target</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[90%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>Next.js Framework</span>
                        <span>95% Yours / 90% Target</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[95%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>Docker Containers</span>
                        <span>60% Yours / 80% Target</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[60%]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column widgets (col-4) */}
              <div className="md:col-span-4 space-y-6">
                
                {/* Recommended Jobs Widget */}
                <div className="p-5 bg-white border border-brand-border rounded-xl shadow-sm space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Jobs</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-slate-50 border border-brand-border rounded-lg space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-[11px] text-slate-800">Senior React Dev</h5>
                          <span className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">92%</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold">Stripe • Remote • $140k</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-brand-border rounded-lg space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-[11px] text-slate-800">Full-Stack Architect</h5>
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">88%</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold">Vercel • San Francisco • $160k</p>
                      </div>
                    </div>
                  </div>

                  {/* Learning Roadmap Progress Widget */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roadmap Status</span>
                    <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg text-slate-800 space-y-1.5">
                      <div className="font-extrabold text-[10px] text-teal-800 flex justify-between">
                        <span>Milestone 3 of 5</span>
                        <span>65% Done</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium">Currently: Deploying Docker containers to AWS ECS</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section className="section-padding space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
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
                className={`premium-card p-6 rounded-card bg-brand-surface flex flex-col justify-between ${
                  plan.highlight 
                    ? "border-primary ring-2 ring-primary/5 shadow-md shadow-primary/5 bg-primary/[0.005]" 
                    : "border-brand-border"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      plan.highlight ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                    }`}>
                      {plan.name}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-black text-slate-900">{plan.price}</span>
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
                      <li key={feat} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
                        ? "bg-primary hover:bg-blue-800 text-white shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="section-padding space-y-12 border-t border-brand-border">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
            Career Journeys Powered by CareerMate
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-sm mx-auto">
            Benchmark comparisons and keyword checks that drove candidate wins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.name}
              className="premium-card p-6 rounded-card bg-brand-surface flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed font-semibold">
                  "{test.story}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                <img
                  src={test.image}
                  alt={test.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{test.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="section-padding max-w-[800px] mx-auto space-y-12 border-t border-brand-border">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold">
            Common answers regarding matching algorithms and formatting parameters.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-brand-border rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-4.5 font-bold text-slate-800 text-left focus:outline-none cursor-pointer"
              >
                <span className="flex items-center gap-2.5 text-xs sm:text-sm uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1.5 text-slate-500 text-xs sm:text-sm border-t border-slate-100 leading-relaxed font-semibold bg-slate-50/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 10. STATISTICS SECTION */}
      <section className="section-padding border-t border-brand-border space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
            Growing Careers Worldwide
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto">
            Empowering professionals globally with quantitative credentials and opportunities.
          </p>
        </div>

        <div className="premium-card py-10 bg-white rounded-card">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
            <div className="py-4 md:py-0 space-y-1.5">
              <div className="text-3xl sm:text-4xl font-black text-brand-text">
                <Counter value={10000} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-muted">Active Professionals</p>
            </div>
            <div className="py-4 md:py-0 space-y-1.5">
              <div className="text-3xl sm:text-4xl font-black text-brand-text">
                <Counter value={50000} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-muted">Resumes Optimized</p>
            </div>
            <div className="py-4 md:py-0 space-y-1.5">
              <div className="text-3xl sm:text-4xl font-black text-brand-text">
                <Counter value={5000} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-muted">Opportunities Discovered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="section-padding border-t border-brand-border">
        <div className="max-w-[960px] mx-auto bg-white border border-brand-border rounded-[32px] p-8 sm:p-12 text-center shadow-lg relative overflow-hidden bg-gradient-to-tr from-slate-50 to-blue-50/30">
          <div className="relative space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Take the Next Step Toward Your Career Goals
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Join thousands of professionals using CareerMate to optimize resumes, discover opportunities, and build future-ready skills.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3.5">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-primary hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-btn transition-colors text-xs uppercase tracking-wider text-center cursor-pointer shadow-sm"
              >
                Get Started
              </Link>
              <Link
                href="/resume-upload"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-brand-border font-bold px-8 py-3.5 rounded-btn transition-colors text-xs uppercase tracking-wider text-center cursor-pointer shadow-sm"
              >
                Upload Resume
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
