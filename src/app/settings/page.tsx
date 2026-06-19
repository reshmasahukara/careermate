"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Bell, Shield, CreditCard, Trash2, Key, Link as LinkIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/components/Providers";
import { updateProfileAction, getSubscriptionAction, upgradeSubscriptionAction } from "@/app/actions/settings";
import DashboardLayout from "@/components/DashboardLayout";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "billing">("profile");
  
  // Profile Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Notification Preferences States
  const [emailDigest, setEmailDigest] = useState(true);
  const [atsAlerts, setAtsAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Billing States
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      const loadSubscription = async () => {
        const sub = await getSubscriptionAction((session.user as any).id || "demo-user-123");
        setSubscription(sub);
      };
      loadSubscription();
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setIsSavingProfile(true);
    try {
      const userId = (session.user as any).id || "demo-user-123";
      await updateProfileAction(userId, name);
      toast("Profile updated successfully! Refreshing details...", "success");
      router.refresh();
    } catch (err) {
      toast("Failed to update profile.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsSavingSecurity(true);
    setTimeout(() => {
      toast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSavingSecurity(false);
    }, 1000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    setTimeout(() => {
      toast("Notification preferences saved.", "success");
      setIsSavingNotifications(false);
    }, 800);
  };

  const handleUpgradePlan = async (plan: "Free" | "Pro" | "Premium" | "Enterprise") => {
    if (!session?.user) return;
    const userId = (session.user as any).id || "demo-user-123";
    const newSub = await upgradeSubscriptionAction(userId, plan);
    setSubscription(newSub);
    toast(`Successfully shifted subscription to the ${plan} plan!`, "success");
  };

  const handleDeleteAccount = () => {
    if (confirm("WARNING: This will permanently delete your account and all associated resumes. This action cannot be undone. Do you wish to proceed?")) {
      toast("Account deletion simulated successfully.", "info");
      // Simulating sign out
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-[#F8FAFC] py-16 px-4">
        <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] p-8 rounded-[20px] text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A]">Access Denied</h2>
          <p className="text-[#64748B] text-sm font-semibold">Please sign in to manage account settings.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-[12px] font-bold text-xs shadow-sm transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", name: "Edit Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", name: "Security & Login", icon: <Shield className="w-4 h-4" /> },
    { id: "billing", name: "Billing & Plans", icon: <CreditCard className="w-4 h-4" /> },
  ] as const;

  const renderContent = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Settings</h1>
        <p className="text-[#64748B] text-xs font-semibold mt-1">Manage profile parameters, notifications, passwords, and tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Settings Tabs Sidebar */}
        <div className="md:col-span-4 space-y-1 bg-white p-3 border border-[#E2E8F0] rounded-[20px] shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all text-left cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#10B981]/5 text-[#10B981]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Active Panel */}
        <div className="md:col-span-8 bg-white p-8 border border-[#E2E8F0] rounded-[20px] shadow-sm">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">Profile Information</h3>
                <p className="text-[#64748B] text-xs font-semibold mt-0.5">Update your basic login name and contact details.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-3 px-4 text-xs focus:outline-none focus:border-[#10B981] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-100 border border-[#E2E8F0] rounded-[12px] py-3 px-4 text-xs text-[#64748B] cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-450 font-semibold mt-1 block">
                    Email address changes require contacting administrator support.
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]/60">
                <span className="text-[10px] text-[#64748B] font-bold uppercase">
                  ID: {(session.user as any).id || "demo-user-123"}
                </span>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-2.5 rounded-[12px] text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">Notification Preferences</h3>
                <p className="text-[#64748B] text-xs font-semibold mt-0.5">Control how and when you receive career alerts.</p>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#10B981] border-[#E2E8F0] rounded focus:ring-[#10B981]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">Weekly newsletter & career tips</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 block">Weekly summaries of market standards and CV templates.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={atsAlerts}
                    onChange={(e) => setAtsAlerts(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#10B981] border-[#E2E8F0] rounded focus:ring-[#10B981]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">ATS analysis alerts</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 block">Get notified instantly when scoring evaluation runs successfully.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interviewReminders}
                    onChange={(e) => setInterviewReminders(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#10B981] border-[#E2E8F0] rounded focus:ring-[#10B981]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">Interview prep notifications</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 block">Alert notifications for upcoming milestones or study goals.</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E2E8F0]/60">
                <button
                  type="submit"
                  disabled={isSavingNotifications}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-2.5 rounded-[12px] text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingNotifications ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <form onSubmit={handleUpdateSecurity} className="space-y-6">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">Security Settings</h3>
                <p className="text-[#64748B] text-xs font-semibold mt-0.5">Ensure security by updating passwords.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5 font-bold">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-3 px-4 text-xs focus:outline-none focus:border-[#10B981] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5 font-bold">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-3 px-4 text-xs focus:outline-none focus:border-[#10B981] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5 font-bold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] py-3 px-4 text-xs focus:outline-none focus:border-[#10B981] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E2E8F0]/60">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-2.5 rounded-[12px] text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSecurity ? "Processing..." : "Update Password"}
                </button>
              </div>

              {/* Danger Zone */}
              <hr className="border-[#E2E8F0]" />
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <Trash2 className="w-4 h-4" />
                  Danger Zone
                </div>
                <div className="flex justify-between items-start gap-4 p-4 rounded-[12px] border border-rose-100 bg-rose-50/30">
                  <div className="text-xs">
                    <span className="font-bold text-[#0F172A] uppercase tracking-wider block">Delete Account</span>
                    <span className="text-[#64748B] mt-1 block leading-relaxed font-semibold">Permanently purge your account details, uploaded resumes, ATS reports, and active roadmap tracking records.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold px-4 py-2.5 rounded-[12px] text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* BILLING & PLANS TAB */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">Billing & Subscription</h3>
                <p className="text-[#64748B] text-xs font-semibold mt-0.5">Control plan levels, view invoices, and change terms.</p>
              </div>

              {/* Plan status box */}
              <div className="p-5 rounded-[20px] bg-gradient-to-r from-[#10B981]/10 to-[#4F46E5]/10 border border-[#10B981]/20 flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Active Plan</div>
                  <div className="text-xl font-extrabold text-[#0F172A]">{subscription?.plan || "Pro"}</div>
                  {subscription?.currentPeriodEnd && (
                    <p className="text-[10px] text-[#64748B] font-semibold">
                      Renews on: {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold bg-white px-3 py-1.5 rounded-[12px] border border-[#E2E8F0] shadow-sm uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {subscription?.status || "Active"}
                </div>
              </div>

              {/* Plan switches */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Change Subscription Level</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Free", "Pro", "Premium", "Enterprise"].map((plan) => {
                    const isCurrent = (subscription?.plan || "Pro") === plan;
                    return (
                      <div
                        key={plan}
                        className={`p-4 rounded-[12px] border flex justify-between items-center ${
                          isCurrent
                            ? "border-[#10B981] bg-[#10B981]/5"
                            : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <div className="text-xs">
                          <span className="font-bold text-[#0F172A] uppercase tracking-wider block">{plan} Plan</span>
                          <span className="text-[#64748B] font-semibold mt-0.5 block">
                            {plan === "Free" ? "$0" : plan === "Pro" ? "$19/mo" : plan === "Premium" ? "$39/mo" : "Custom"}
                          </span>
                        </div>
                        <button
                          onClick={() => !isCurrent && handleUpgradePlan(plan as any)}
                          disabled={isCurrent}
                          className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-[#10B981] text-white hover:bg-[#059669]"
                          }`}
                        >
                          {isCurrent ? "Current" : "Shift"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );

  if (session) {
    return <DashboardLayout>{renderContent}</DashboardLayout>;
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent}
      </div>
    </div>
  );
}
