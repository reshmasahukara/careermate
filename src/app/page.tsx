"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  BookOpen,
  Check,
  ShieldCheck,
  Target
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
  const { data: session } = useSession();
  const router = useRouter();


  const featureCards = [
    {
      title: "Resume Analyzer",
      description: "Improve your resume with AI-powered feedback.",
      icon: <FileText className="w-5 h-5 text-[#10B981]" />,
      href: "/resume-analysis"
    },
    {
      title: "ATS Score Checker",
      description: "Check resume compatibility with ATS systems.",
      icon: <FileCheck className="w-5 h-5 text-[#10B981]" />,
      href: "/ats-checker"
    },
    {
      title: "Job Recommendations",
      description: "Discover jobs that match your skills.",
      icon: <Briefcase className="w-5 h-5 text-[#10B981]" />,
      href: "/jobs"
    },
    {
      title: "AI Interview Preparation",
      description: "Practice smarter with AI interview guidance.",
      icon: <Zap className="w-5 h-5 text-[#10B981]" />,
      href: "/contact"
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify skills needed for your target role.",
      icon: <Compass className="w-5 h-5 text-[#10B981]" />,
      href: "/skill-gap"
    },
    {
      title: "Learning Resources",
      description: "Access curated learning paths and resources.",
      icon: <BookOpen className="w-5 h-5 text-[#10B981]" />,
      href: "/roadmap"
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
      <section id="hero" className="w-full bg-[#FAFBFC] border-b border-[#E5E7EB]/70 relative overflow-hidden pt-[72px]">
        {/* Subtle decorative color blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1E293B]/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#10B981]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] flex flex-col items-center relative z-10">
          
          {/* Centered Content */}
          <div className="space-y-6 text-center flex flex-col items-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-[#E5E7EB] text-[#1E293B] text-xs font-bold uppercase tracking-wider">
              AI-Powered Career Growth Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] lg:leading-[1.05] font-black text-[#0F172A] tracking-tight">
              Build a Smarter Career Path with CareerMate
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold max-w-2xl mx-auto">
              Optimize your resume, improve ATS performance, discover relevant opportunities, and close skill gaps with AI-driven career guidance.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
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

            {/* Trust Row Removed */}

            {/* Mini Social Proof Removed */}
          </div>

        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="w-full bg-[#F1F5F9] border-b border-[#E5E7EB]/70 scroll-mt-24">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Everything You Need to Grow
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
              Powerful tools for career success.
            </p>
          </div>

          {/* 6 feature cards in one row on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 items-stretch">
            {featureCards.map((card, index) => (
              <Link
                key={`feature-${card.title}-${index}`}
                href={card.href}
                className="premium-card p-5 rounded-[20px] bg-[#FCFDFE] border border-[#E5EAF1] shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between text-left"
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



      {/* 6. TESTIMONIALS */}
      <section className="w-full bg-[#F8FAFC] border-b border-[#E5E7EB]/70">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Career Success Stories
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-sm mx-auto">
              See how users achieved their goals.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <div
                key={`testimonial-${test.name}-${index}`}
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
                  <Image
                    src={test.image}
                    alt={test.name}
                    width={36}
                    height={36}
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

    {/* Section removed per requirements to avoid fake numbers */}



      {/* 10. CONTACT */}
      <section id="contact" className="w-full bg-[#FFFFFF] scroll-mt-24">
        <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-8 text-center">
          <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
            Contact
          </span>

          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-2xl mx-auto">
            Have questions about your career roadmap or need help with your account? Our support team is here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

    </div>
  );
}
