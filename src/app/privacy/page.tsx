"use client";

import React from "react";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-brand-bg py-16 px-4">
      <div className="max-w-3xl mx-auto glass-card p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Privacy Policy</h1>
        </div>
        <hr className="border-slate-100" />
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold space-y-4">
          <p>Last updated: June 18, 2026</p>
          <p>
            At CareerMate, accessible from http://localhost:3000, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CareerMate and how we use it.
          </p>
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wide text-xs">Information We Collect</h3>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We also parse uploaded resume documents to analyze ATS compatibility and skill gaps.
          </p>
        </div>
      </div>
    </div>
  );
}
