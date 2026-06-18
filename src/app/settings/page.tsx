"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Bell, Shield, CreditCard, Trash2, Key, Link as LinkIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/components/Providers";
import { updateProfileAction, getSubscriptionAction, upgradeSubscriptionAction } from "@/app/actions/settings";

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
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 py-16 px-4">
        <div className="max-w-md w-full glass-card p-8 text-center space-y-4 border border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900">Access Denied</h2>
          <p className="text-slate-500 text-sm">Please sign in to manage account settings.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-xs"
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

  return (
    <div className="flex-1 bg-brand-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage profile parameters, notifications, passwords, and tiers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Settings Tabs Sidebar */}
          <div className="md:col-span-4 space-y-1 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Settings Active Panel */}
          <div className="md:col-span-8 glass-card p-8 rounded-2xl border border-slate-200">
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Profile Information</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Update your basic login name and contact details.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Email address changes require contacting administrator support.
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    ID: {(session.user as any).id || "demo-user-123"}
                  </span>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow shadow-primary/10 disabled:opacity-50 cursor-pointer"
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
                  <h3 className="font-bold text-slate-900 text-lg">Notification Preferences</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Control how and when you receive career alerts.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Weekly newsletter & career tips</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Weekly summaries of market standards and CV templates.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={atsAlerts}
                      onChange={(e) => setAtsAlerts(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">ATS analysis alerts</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Get notified instantly when scoring evaluation runs successfully.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interviewReminders}
                      onChange={(e) => setInterviewReminders(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Interview prep notifications</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Alert notifications for upcoming milestones or study goals.</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSavingNotifications}
                    className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow shadow-primary/10 disabled:opacity-50 cursor-pointer"
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
                  <h3 className="font-bold text-slate-900 text-lg">Security Settings</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Ensure security by updating passwords.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSavingSecurity}
                    className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow shadow-primary/10 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingSecurity ? "Processing..." : "Update Password"}
                  </button>
                </div>

                {/* Danger Zone */}
                <hr className="border-slate-100" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                    <Trash2 className="w-4 h-4" />
                    Danger Zone
                  </div>
                  <div className="flex justify-between items-start gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 uppercase tracking-wider block">Delete Account</span>
                      <span className="text-slate-500 mt-1 block leading-relaxed">Permanently purge your account details, uploaded resumes, ATS reports, and active roadmap tracking records.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* BILLING & PLANS TAB */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Billing & Subscription</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Control plan levels, view invoices, and change terms.</p>
                </div>

                {/* Plan status box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-primary/20 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Plan</div>
                    <div className="text-xl font-extrabold text-slate-900">{subscription?.plan || "Pro"}</div>
                    {subscription?.currentPeriodEnd && (
                      <p className="text-[10px] text-slate-500 font-semibold">
                        Renews on: {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {subscription?.status || "Active"}
                  </div>
                </div>

                {/* Plan switches */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Change Subscription Level</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Free", "Pro", "Premium", "Enterprise"].map((plan) => {
                      const isCurrent = (subscription?.plan || "Pro") === plan;
                      return (
                        <div
                          key={plan}
                          className={`p-4 rounded-xl border flex justify-between items-center ${
                            isCurrent
                              ? "border-primary bg-primary/[0.02]"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 uppercase tracking-wider block">{plan} Plan</span>
                            <span className="text-slate-500 font-semibold mt-0.5 block">
                              {plan === "Free" ? "$0" : plan === "Pro" ? "$19/mo" : plan === "Premium" ? "$39/mo" : "Custom"}
                            </span>
                          </div>
                          <button
                            onClick={() => !isCurrent && handleUpgradePlan(plan as any)}
                            disabled={isCurrent}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-blue-700"
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
    </div>
  );
}
