"use client";

import React from "react";
import Link from "next/link";
import { MapPin, DollarSign, ArrowRight, Briefcase } from "lucide-react";

// Mock job data — in real app connect to /jobs endpoint
const MOCK_JOBS = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Google",
    location: "Hyderabad, India",
    salary: "₹20L – ₹35L",
    match: 87,
    type: "Full-time",
  },
  {
    id: "2",
    title: "React Engineer",
    company: "Swiggy",
    location: "Bangalore, India",
    salary: "₹18L – ₹28L",
    match: 82,
    type: "Full-time",
  },
  {
    id: "3",
    title: "Software Engineer II",
    company: "Razorpay",
    location: "Remote",
    salary: "₹22L – ₹40L",
    match: 75,
    type: "Remote",
  },
];

interface JobRecommendationsProps {
  targetRole?: string | null;
}

export default function JobRecommendations({ targetRole }: JobRecommendationsProps) {
  return (
    <div className="space-y-3">
      {MOCK_JOBS.map((job) => (
        <Link
          key={job.id}
          href="/jobs"
          className="group block p-3.5 bg-[#F7F8FA] hover:bg-white border border-[#E5E7EB] hover:border-emerald-200 hover:shadow-sm rounded-xl transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 shadow-sm">
                <Briefcase className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate group-hover:text-emerald-700 transition-colors">
                  {job.title}
                </p>
                <p className="text-xs text-[#64748B] truncate">{job.company}</p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {job.match}% match
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-[#64748B] font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {job.salary}
            </span>
          </div>
        </Link>
      ))}

      <Link
        href="/jobs"
        className="w-full flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 py-2.5 rounded-xl transition-all"
      >
        View All Jobs <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
