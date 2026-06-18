"use client";

import React from "react";
import {
  FileText,
  FileCheck,
  Briefcase,
  Award,
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function HowItWorksPage() {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        {/* HOW CAREERMATE WORKS */}
        <section className="w-full bg-[#F8FAFC] border-b border-[#E5E7EB]/70 flex-grow h-full pt-[40px]">
          <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
            
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
                How It Works
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                How CareerMate Works
              </h2>
            </div>

            {/* Horizontal timeline responsive with scroll on mobile */}
            <div className="overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              <div className="min-w-[850px] relative">
                {/* Continuous horizontal line crossing exactly through the circles center */}
                <div className="absolute top-[64px] left-[10%] right-[10%] h-[2px] bg-slate-200/70 -z-10" />

                <div className="grid grid-cols-5 gap-6 text-center">
                  {timelineSteps.map((step, idx) => (
                    <div key={`step-${step.title}-${idx}`} className="flex flex-col items-center group">
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
      </main>
      <Footer />
    </div>
  );
}
