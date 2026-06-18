"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  BookOpen
} from "lucide-react";

// Interactive Count-up Component for Trust Metrics
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(value / (duration / 16)); // ~60fps
    
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

  const featureCards = [
    {
      title: "Calculate ATS Score",
      description: "Instantly check your resume score against industry-standard ATS algorithms and target job descriptions.",
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      href: "/ats-checker",
      color: "border-primary/20 hover:border-primary",
    },
    {
      title: "Analyze Resume",
      description: "Get detailed, section-by-section AI feedback on your resume experience, impact formatting, and style.",
      icon: <FileText className="w-6 h-6 text-secondary" />,
      href: "/resume-analysis",
      color: "border-secondary/20 hover:border-secondary",
    },
    {
      title: "Discover Jobs",
      description: "Find curated positions matched directly to your current skill profile with direct apply paths.",
      icon: <Briefcase className="w-6 h-6 text-accent" />,
      href: "/jobs",
      color: "border-accent/20 hover:border-accent",
    },
    {
      title: "Identify Skill Gaps",
      description: "Compare your skills with job requirements, mapping a personalized path to close the gap.",
      icon: <Compass className="w-6 h-6 text-emerald-500" />,
      href: "/skill-gap",
      color: "border-emerald-500/20 hover:border-emerald-500",
    },
  ];

  const steps = [
    {
      title: "Upload Your Resume",
      description: "Drag and drop your PDF/DOCX resume. CareerMate's intelligent parser processes and indexes your information in seconds.",
      illustration: (
        <div className="w-full h-40 bg-blue-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-dashed border-primary/30">
          <FileText className="w-16 h-16 text-primary animate-bounce" />
        </div>
      ),
    },
    {
      title: "Analyze ATS Score",
      description: "Compare your resume against your target role. Our engine calculates match percentage and identifies missing keywords.",
      illustration: (
        <div className="w-full h-40 bg-indigo-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-secondary/20 p-4">
          <div className="w-20 h-20 rounded-full border-4 border-secondary border-t-transparent flex items-center justify-center text-secondary font-bold text-lg animate-spin">
            85%
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">ATS Score Parsing...</span>
        </div>
      ),
    },
    {
      title: "Identify Skill Gaps",
      description: "Our AI checks what technologies or skills are missing from your resume and outlines exactly what you need to study.",
      illustration: (
        <div className="w-full h-40 bg-cyan-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-accent/20 p-4">
          <div className="space-y-2 w-full max-w-xs">
            <div className="flex justify-between text-xs font-semibold">
              <span>Next.js Mastery</span>
              <span className="text-accent">40% Gap</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Discover Jobs & Paths",
      description: "Instantly unlock matched job search listings and receive a structured learning roadmap loaded with recommended courses.",
      illustration: (
        <div className="w-full h-40 bg-emerald-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-emerald-500/20 p-4">
          <div className="flex flex-col gap-2 items-center text-center">
            <BookOpen className="w-10 h-10 text-emerald-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Personalized Roadmap Unlocked</span>
            <span className="text-xs text-slate-500">4 Milestone Courses Available</span>
          </div>
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Frontend Developer at Vercel",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      rating: 5,
      story: "CareerMate's ATS Checker was a game-changer. I optimized my resume with their missing keyword list and landed three interviews in a week, eventually joining Vercel!"
    },
    {
      name: "David Chen",
      role: "Data Analyst at Stripe",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      story: "The skill gap analyzer mapped out exactly what SQL and dashboard metrics I was missing for Senior roles. The suggested Udemy courses filled the gap perfectly."
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
      answer: "An Applicant Tracking System (ATS) is software employers use to screen resume files based on keyword match and formatting. CareerMate uses simulated ATS parsing algorithms to evaluate your resume against specified roles, highlighting match scores, missing keywords, and layout flags."
    },
    {
      question: "Which document formats do you support?",
      answer: "We support PDF and DOCX uploads, which are the standard formats accepted by company portals. For best results, we recommend uploading standard, single-column PDF formatting."
    },
    {
      question: "Is my personal data secure?",
      answer: "Yes, data security and privacy are our top priorities. All uploaded resumes are stored securely in Cloudinary/PostgreSQL and are never sold or shared. You can delete your account and files at any time through Settings."
    },
    {
      question: "Does the free tier allow job matching?",
      answer: "Absolutely! The Free plan gives you 1 resume upload, a basic ATS score, and access to job listings. Upgrading to Pro unlocks unlimited uploads, advanced keyword suggestions, skill gap charts, and detailed learning roadmaps."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Abstract Background Accent */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-primary/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Optimization
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-900"
          >
            Accelerate Your Career with{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CareerMate
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume, optimize your ATS score, discover relevant jobs, and identify skill gaps with AI-powered career guidance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all-ease cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/resume-upload"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all-ease cursor-pointer"
            >
              Upload Resume
            </Link>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-12 border-t border-slate-100 dark:border-slate-800"
          >
            <div className="space-y-1">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                <Counter value={10000} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">Users</p>
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                <Counter value={50000} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">Resumes Optimized</p>
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                <Counter value={5000} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">Jobs Listed</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE FEATURE CARDS */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Powered by Intelligent AI
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Select one of our core assessment modules below to immediately parse and enhance your professional value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`glass-card p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${card.color}`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                  {card.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
              </div>
              <Link
                href={card.href}
                className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary group cursor-pointer"
              >
                Analyze Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. HOW CAREERMATE WORKS SECTION */}
      <section className="bg-slate-50 dark:bg-slate-950 py-20 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              How CareerMate Works
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Accelerate your workflow in 4 simple steps. Click on the steps below to see the interactive workspace preview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Timeline Controls */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step, idx) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all-ease flex gap-4 cursor-pointer ${
                    activeStep === idx
                      ? "bg-white dark:bg-slate-800 border-primary shadow-sm"
                      : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeStep === idx ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Illustration Display */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md min-h-[300px] flex items-center justify-center">
              <div className="w-full space-y-6">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Interactive Live Preview</span>
                  <span>Step {activeStep + 1} / 4</span>
                </div>
                {steps[activeStep].illustration}
                <div className="text-xs text-center text-slate-500">
                  Click through the list on the left to see each phase of CareerMate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Success Stories
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            See how job seekers accelerated their career journeys using our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.name}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                  "{test.story}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={test.image}
                  alt={test.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{test.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Flexible Plans for Every Stage
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Choose a plan that fits your growth targets. Clear pricing, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Free */}
          <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Free</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">$0</div>
              <p className="text-slate-500 text-xs mt-2">Test out our parsing features.</p>
              <ul className="space-y-2 text-xs text-slate-600 mt-6">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  1 resume upload
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Basic ATS optimization score
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Limited job search recommendations
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center py-2.5 rounded-xl text-xs font-bold mt-8 transition-colors cursor-pointer"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Card 2: Pro */}
          <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between border-primary relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-[9px] font-extrabold uppercase px-2 py-1 rounded-full tracking-widest shadow-sm">
              Popular
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest">Pro</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">$19<span className="text-xs text-slate-500">/mo</span></div>
              <p className="text-slate-500 text-xs mt-2">Best value for job hunting.</p>
              <ul className="space-y-2 text-xs text-slate-600 mt-6">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Unlimited resume uploads
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Advanced ATS keyword suggestions
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Detailed skill gap diagnostics
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Advanced filterable job lists
                </li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="w-full bg-primary hover:bg-blue-700 text-white text-center py-2.5 rounded-xl text-xs font-bold mt-8 transition-colors shadow shadow-primary/20 cursor-pointer"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Card 3: Premium */}
          <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between border-slate-200">
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-widest">Premium</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">$39<span className="text-xs text-slate-500">/mo</span></div>
              <p className="text-slate-500 text-xs mt-2">Accelerate skills development.</p>
              <ul className="space-y-2 text-xs text-slate-600 mt-6">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Everything in Pro plan
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  AI career roadmaps & tracking
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Mock interview preparation
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Priority expert support
                </li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-center py-2.5 rounded-xl text-xs font-bold mt-8 transition-colors cursor-pointer"
            >
              Get Premium
            </Link>
          </div>

          {/* Card 4: Enterprise */}
          <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between border-slate-200">
            <div>
              <div className="text-xs font-bold text-accent uppercase tracking-widest">Enterprise</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">Custom</div>
              <p className="text-slate-500 text-xs mt-2">For universities & organizations.</p>
              <ul className="space-y-2 text-xs text-slate-600 mt-6">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Multi-user seat management
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  University bulk licenses
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Custom database API integrations
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  Dedicated success manager
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center py-2.5 rounded-xl text-xs font-bold mt-8 transition-colors cursor-pointer"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Got questions about our services? Find quick answers right here.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 font-bold text-slate-800 text-left focus:outline-none cursor-pointer"
              >
                <span className="flex items-center gap-2.5 text-sm sm:text-base">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm border-t border-slate-50 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-primary to-secondary p-8 sm:p-12 text-center text-white shadow-xl shadow-primary/10">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/10 blur-2xl rounded-full" />
          
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-slate-100/80 text-sm sm:text-base leading-relaxed">
              Optimize your resume, benchmark your skills, discover tech jobs, and receive tailored roadmaps to kickstart your target career route.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-primary font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto text-sm font-semibold border border-white/30 hover:border-white/60 hover:bg-white/10 px-8 py-3.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
