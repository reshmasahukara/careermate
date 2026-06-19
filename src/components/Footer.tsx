"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { useToast } from "./Providers";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "@/components/Logo";

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

  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/">
              <Logo className="w-6 h-6" lightWordmark={true} />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accelerate your career with AI-powered resume parsing, ATS optimizations, and personalized roadmaps.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="text-slate-500 hover:text-white transition-colors cursor-default"
                aria-label="GitHub"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </button>
              <button
                type="button"
                className="text-slate-500 hover:text-white transition-colors cursor-default"
                aria-label="LinkedIn"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </button>
              <button
                type="button"
                className="text-slate-500 hover:text-white transition-colors cursor-default"
                aria-label="Twitter"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Resources</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/ats-checker" className="hover:text-white transition-colors">ATS Optimizer</Link></li>
              <li><Link href="/resume-analysis" className="hover:text-white transition-colors">Resume Audit</Link></li>
              <li><Link href="/skill-gap" className="hover:text-white transition-colors">Skill Gap Guide</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition-colors">Learning Paths</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Support</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Newsletter</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Subscribe to stay updated with the latest features.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-primary font-semibold"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CareerMate. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-800">•</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
