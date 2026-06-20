"use client";

import React, { useState } from "react";
import { User, Shield, Palette, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import SubscriptionSettings from "./SubscriptionSettings";

interface SettingsLayoutProps {
  user: any;
  subscription: any;
  usageStats?: {
    resumeCount: number;
    atsCount: number;
    savedJobCount: number;
  };
  payments?: any[];
}

const TABS = [
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "account", label: "Account", icon: <Shield className="w-4 h-4" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  { id: "subscription", label: "Subscription", icon: <CreditCard className="w-4 h-4" /> },
];

export default function SettingsLayout({ user, subscription, usageStats, payments }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} />;
      case "account":
        return <AccountSettings user={user} />;
      case "appearance":
        return <AppearanceSettings />;
      case "subscription":
        return (
          <SubscriptionSettings
            subscription={subscription}
            user={user}
            usageStats={usageStats}
            payments={payments}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full space-y-6">
      
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-[#64748B] text-xs font-semibold mt-1">Manage your account settings, preferences, and subscriptions.</p>
      </div>

      {/* ── Horizontal Navigation Tabs (Unified Desktop & Mobile) ── */}
      <div className="border-b border-[#E5E7EB] overflow-x-auto no-scrollbar">
        <div className="flex gap-8 pb-px">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold relative whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? "text-[#10B981]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <div className={`transition-colors ${isActive ? "text-[#10B981]" : "text-slate-400"}`}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Settings Panel Container ── */}
      <div className="w-full min-h-[400px]">
        {renderActiveSection()}
      </div>

      {/* ── Recommended Next Step CTA ── */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-4">
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
  );
}
