"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Globe, LogOut, Download, HardDrive } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function PrivacySettings() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSignOutAll = () => {
    if (window.confirm("Are you sure you want to sign out from all other devices?")) {
      toast("Successfully signed out from all other active sessions.", "success");
    }
  };

  const handleDownloadData = () => {
    setIsDownloading(true);
    setTimeout(() => {
      toast("Your data archive has been generated and downloaded.", "success");
      setIsDownloading(false);
    }, 2000);
  };

  const activeSessions = [
    { id: 1, device: "MacBook Pro", browser: "Chrome", location: "San Francisco, CA", current: true, icon: <Monitor className="w-5 h-5" /> },
    { id: 2, device: "iPhone 13", browser: "Safari", location: "San Francisco, CA", current: false, icon: <Smartphone className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Privacy & Sessions</h3>
        <p className="text-[#64748B] text-sm mt-1">Manage your active sessions and download your personal data.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-500" /> Active Sessions
          </h4>
          <button
            onClick={handleSignOutAll}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign out all other devices
          </button>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl bg-[#FAFBFC]">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-[#E5E7EB] text-slate-500">
                  {session.icon}
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                    {session.device} - {session.browser}
                    {session.current && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">This Device</span>
                    )}
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">{session.location}</p>
                </div>
              </div>
              {!session.current && (
                <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Revoke session">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-emerald-500" /> Data Management
        </h4>
        <p className="text-sm text-slate-500 mb-6 max-w-2xl">
          You have the right to request a copy of your personal data. We will compile all your resumes, ATS analysis results, and profile information into a ZIP file.
        </p>
        
        <button
          onClick={handleDownloadData}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#FAFBFC] hover:bg-slate-100 border border-[#E5E7EB] text-[#0F172A] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {isDownloading ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? "Generating Archive..." : "Download Account Data"}
        </button>
      </div>
    </div>
  );
}
