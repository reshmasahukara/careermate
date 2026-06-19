"use client";

import React, { useState } from "react";
import { Bell, Mail, Briefcase, FileCheck, Loader2, Save } from "lucide-react";
import { useToast } from "@/components/Providers";
import { updateNotificationsAction } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

interface NotificationSettingsProps {
  user: any;
}

export default function NotificationSettings({ user }: NotificationSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    jobAlerts: user?.jobAlerts ?? true,
    atsAnalysisUpdates: user?.atsAnalysisUpdates ?? true,
    weeklyCareerInsights: user?.weeklyCareerInsights ?? true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await updateNotificationsAction(user.id, preferences);
      toast("Notification preferences saved successfully!", "success");
      router.refresh();
    } catch (err) {
      toast("Failed to update preferences.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const notificationOptions = [
    {
      id: "emailNotifications",
      title: "Email Notifications",
      description: "Receive general platform updates and security alerts.",
      icon: <Mail className="w-5 h-5 text-slate-500" />,
    },
    {
      id: "jobAlerts",
      title: "Job Alerts",
      description: "Get notified when new jobs match your skills and location.",
      icon: <Briefcase className="w-5 h-5 text-slate-500" />,
    },
    {
      id: "atsAnalysisUpdates",
      title: "ATS Analysis Updates",
      description: "Alerts when your resume scanning completes or needs attention.",
      icon: <FileCheck className="w-5 h-5 text-slate-500" />,
    },
    {
      id: "weeklyCareerInsights",
      title: "Weekly Career Insights",
      description: "Receive a weekly digest of your learning progress and market trends.",
      icon: <Bell className="w-5 h-5 text-slate-500" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Notifications</h3>
        <p className="text-[#64748B] text-sm mt-1">Choose what updates you want to receive and how often.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB] shadow-sm">
          {notificationOptions.map((opt) => (
            <div key={opt.id} className="p-4 sm:p-6 flex items-start sm:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="mt-1 sm:mt-0 p-2 bg-slate-50 rounded-lg border border-[#E5E7EB] shrink-0">
                  {opt.icon}
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-sm">{opt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-md">{opt.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(opt.id as keyof typeof preferences)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  preferences[opt.id as keyof typeof preferences] ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences[opt.id as keyof typeof preferences] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
