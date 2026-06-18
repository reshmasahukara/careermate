"use client";

import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 bg-brand-bg py-16 px-4">
      <div className="max-w-3xl mx-auto glass-card p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Terms of Service</h1>
        </div>
        <hr className="border-slate-100" />
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold space-y-4">
          <p>Last updated: June 18, 2026</p>
          <p>
            Welcome to CareerMate! These terms and conditions outline the rules and regulations for the use of CareerMate's Website.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use CareerMate if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wide text-xs">License & Document Parsing</h3>
          <p>
            Unless otherwise stated, CareerMate and/or its licensors own the intellectual property rights for all material on CareerMate. All intellectual property rights are reserved. You may access this from CareerMate for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>
            We process resume uploads as part of our automated ATS scanning services. You must not upload copyrighted text or documents containing malicious scripts.
          </p>
        </div>
      </div>
    </div>
  );
}
