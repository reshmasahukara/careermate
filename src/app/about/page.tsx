"use client";

import React from "react";
import { Users, Award, TrendingUp, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Job Seekers", value: "10,000+" },
    { label: "Resumes Evaluated", value: "50,000+" },
    { label: "Partner Companies", value: "120+" },
    { label: "Successful Hires", value: "3,500+" }
  ];

  const team = [
    {
      name: "Marcus Vance",
      role: "CEO & Co-founder",
      bio: "Former lead recruiter at Google with a passion for building transparent job application pipelines.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
    },
    {
      name: "Jane Sterling",
      role: "CTO & Co-founder",
      bio: "AI Researcher and Software Architect. Former Tech Lead at OpenAI working on GPT text-parsing frameworks.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
    },
    {
      name: "Kenji Sato",
      role: "VP of Product",
      bio: "Product designer specializing in interactive educational timelines. Former Head of UX at Levels.fyi.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
    }
  ];

  return (
    <div className="flex-1 bg-brand-bg py-12 sm:py-16 space-y-20">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Bridging the Gap Between Talent and Opportunity
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          At CareerMate, we believe that job seeking shouldn't be a black box. Our AI-driven algorithms parse formatting structures and compile learning milestones to empower professionals to advance their paths with complete transparency.
        </p>
      </section>

      {/* Stats Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
          {stats.map((st) => (
            <div key={st.label} className="space-y-1.5">
              <div className="text-3xl font-black text-slate-900">{st.value}</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1 */}
        <div className="glass-card p-8 rounded-2xl border border-slate-200 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Empowerment & Ethics</h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            We prioritize data privacy and objective evaluation models. We ensure resumes are scrubbed of bias, highlighting true candidate performance metrics to recruiter screening systems.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-8 rounded-2xl border border-slate-200 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Skills-first Development</h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            By shifting job search focus to direct technology benchmarks, we help candidates pinpoint skill deficiencies and address them with structured curriculum checklists, skipping general pathways.
          </p>
        </div>

      </section>

      {/* Team Bios Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Meet the Builders</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-semibold">
            A cross-functional team of engineers, recruiters, and product strategists focused on career development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="glass-card p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between gap-6">
              <div className="space-y-4 flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{member.name}</h3>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mt-0.5">{member.role}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
