"use client";

import React, { useState } from "react";
import { User, Shield, Lock, Palette, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import AppearanceSettings from "./AppearanceSettings";
import SubscriptionSettings from "./SubscriptionSettings";

interface SettingsLayoutProps {
  user: any;
  subscription: any;
}

const TABS = [
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "account", label: "Account", icon: <Shield className="w-4 h-4" /> },
  { id: "privacy", label: "Privacy & Security", icon: <Lock className="w-4 h-4" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { id: "subscription", label: "Subscription", icon: <CreditCard className="w-4 h-4" /> },
];

export default function SettingsLayout({ user, subscription }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} />;
      case "account":
        return <AccountSettings user={user} />;
      case "privacy":
        return <PrivacySettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "subscription":
        return <SubscriptionSettings subscription={subscription} user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-[#64748B] text-sm mt-2">Manage your account settings, preferences, and subscriptions.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Tabs */}
        <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24">
          <nav className="flex flex-col space-y-1 bg-white p-3 border border-[#E5E7EB] rounded-2xl shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                }`}
              >
                <div className={`${activeTab === tab.id ? "text-emerald-600" : "text-slate-400"}`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0 pb-20 space-y-8">
          {renderActiveSection()}

          {/* ── NEXT STEP CTA SECTION ── */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
            <div className="space-y-1.5">
              <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recommended Next Step
              </span>
              <h3 className="text-lg font-bold">Check your updated Profile Completion Index</h3>
              <p className="text-xs text-slate-400 max-w-xl font-medium">
                Verify how your profile updates have impacted your overall career readiness index metrics on the dashboard.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
