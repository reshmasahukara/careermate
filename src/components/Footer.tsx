"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { useToast } from "./Providers";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAppRoute = [
    "/dashboard",
    "/resume-upload",
    "/ats-checker",
    "/jobs",
    "/skill-gap",
    "/roadmap",
    "/settings"
  ].some(route => pathname === route || pathname.startsWith(route + "/"));

  if (session && isAppRoute) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast(`Thank you! We've registered ${email}.`, "success");
    setEmail("");
  };

  const columns = [
    {
      title: "Product",
      links: [
        { name: "ATS Optimizer", href: "/ats-checker" },
        { name: "Resume Audit", href: "/resume-analysis" },
        { name: "Job Discovery", href: "/jobs" },
        { name: "Pricing Plans", href: "/pricing" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Support", href: "/contact" },
        { name: "Careers", href: "/about" },
        { name: "Partnerships", href: "/about" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Skill Gap Guide", href: "/skill-gap" },
        { name: "Learning Paths", href: "/roadmap" },
        { name: "Job Market Trends", href: "/jobs" },
        { name: "Help Center", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Data Security", href: "/privacy" },
        { name: "GDPR Compliance", href: "/privacy" }
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Logo / Brand Info (col 4) */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                CM
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                CareerMate
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
              Accelerate your career with AI-powered resume parsing, ATS optimizations, skill analysis, and personalized roadmaps.
            </p>
          </div>

          {/* Directory Links columns (col 8) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3.5">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {col.title}
                </h3>
                <ul className="space-y-2 text-xs font-semibold">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} CareerMate. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
