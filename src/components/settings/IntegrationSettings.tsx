"use client";

import React from "react";
import { Link2, Globe, Calendar, CheckCircle2 } from "lucide-react";

export default function IntegrationSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Integrations</h3>
        <p className="text-[#64748B] text-sm mt-1">Connect third-party apps to sync your data automatically.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Google Connection */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Google Account</h4>
              <p className="text-xs text-slate-500 mt-0.5">Connected for single sign-on (SSO) and resume sync.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
            <button className="text-xs font-bold text-slate-500 hover:text-[#0F172A] bg-[#FAFBFC] border border-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
              Manage
            </button>
          </div>
        </div>

        {/* LinkedIn Placeholder */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-[#0A66C2]" />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">LinkedIn</h4>
              <p className="text-xs text-slate-500 mt-0.5">Import your professional experience and skills directly.</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F172A] bg-white border border-[#E5E7EB] hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Link2 className="w-3.5 h-3.5" /> Connect
          </button>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Calendar Sync</h4>
              <p className="text-xs text-slate-500 mt-0.5">Sync interview reminders and learning roadmap milestones.</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F172A] bg-white border border-[#E5E7EB] hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Link2 className="w-3.5 h-3.5" /> Connect
          </button>
        </div>
      </div>
    </div>
  );
}
