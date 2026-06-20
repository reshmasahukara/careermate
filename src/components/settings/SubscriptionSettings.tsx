"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Loader2,
  Crown,
  Sparkles,
  Receipt,
  Download,
  XCircle,
  Star,
  Shield,
  FileText,
  Bot,
  Briefcase,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/Providers";
import {
  upgradeSubscriptionAction,
  cancelSubscriptionAction,
} from "@/app/actions/settings";
import { useRouter } from "next/navigation";

// ── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "Free",
    label: "Free",
    price: "₹0",
    period: "/month",
    description: "Get started with the essentials",
    color: "border-slate-200",
    badge: "",
    badgeBg: "",
    icon: <Star className="w-5 h-5 text-slate-500" />,
    features: [
      { label: "1 Resume Upload", included: true },
      { label: "5 ATS Scans / month", included: true },
      { label: "Basic Skill Gap Analysis", included: true },
      { label: "5 Job Applications Tracked", included: true },
      { label: "Community Support", included: true },
      { label: "AI Resume Tailoring", included: false },
      { label: "Unlimited ATS Scans", included: false },
      { label: "Priority Support", included: false },
    ],
    limits: { resumes: 1, ats: 5, jobs: 5 },
  },
  {
    id: "Pro",
    label: "Pro",
    price: "₹999",
    period: "/month",
    description: "For serious job seekers",
    color: "border-emerald-500",
    badge: "Most Popular",
    badgeBg: "bg-emerald-500",
    icon: <Zap className="w-5 h-5 text-emerald-500" />,
    features: [
      { label: "Unlimited Resume Uploads", included: true },
      { label: "Unlimited ATS Scans", included: true },
      { label: "Advanced Skill Gap Analysis", included: true },
      { label: "Unlimited Job Tracking", included: true },
      { label: "AI Resume Tailoring", included: true },
      { label: "Priority Email Support", included: true },
      { label: "Career Roadmap Generation", included: true },
      { label: "Enterprise SLA", included: false },
    ],
    limits: { resumes: Number.POSITIVE_INFINITY, ats: Number.POSITIVE_INFINITY, jobs: Number.POSITIVE_INFINITY },
  },
  {
    id: "Premium",
    label: "Premium",
    price: "₹2,499",
    period: "/month",
    description: "For professionals & teams",
    color: "border-purple-500",
    badge: "Best Value",
    badgeBg: "bg-purple-600",
    icon: <Crown className="w-5 h-5 text-purple-500" />,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "AI Interview Coaching", included: true },
      { label: "1-on-1 Career Mentorship", included: true },
      { label: "Custom Branding on Resume", included: true },
      { label: "Enterprise SLA & Reporting", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "API Access", included: true },
      { label: "White-glove Onboarding", included: true },
    ],
    limits: { resumes: Number.POSITIVE_INFINITY, ats: Number.POSITIVE_INFINITY, jobs: Number.POSITIVE_INFINITY },
  },
];

// ── Usage bar component ───────────────────────────────────────────────────────
function UsageBar({
  label,
  used,
  max,
  icon,
}: {
  label: string;
  used: number;
  max: number;
  icon: React.ReactNode;
}) {
  const isUnlimited = !isFinite(max);
  const pct = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
  const nearLimit = !isUnlimited && pct >= 80;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          {icon}
          {label}
        </span>
        <span className={`font-bold ${nearLimit ? "text-amber-400" : "text-white"}`}>
          {used} / {isUnlimited ? <span className="font-bold text-white">∞</span> : max}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              nearLimit ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    Active: { cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", label: "Active" },
    Cancelled: { cls: "bg-red-500/20 text-red-400 border border-red-500/30", label: "Cancelled" },
    Expired: { cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30", label: "Expired" },
  };
  const s = map[status] ?? map["Active"];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface SubscriptionSettingsProps {
  subscription: any;
  user: any;
  usageStats?: { resumeCount: number; atsCount: number; savedJobCount: number };
  payments?: any[];
}

export default function SubscriptionSettings({
  subscription,
  user,
  usageStats,
  payments = [],
}: SubscriptionSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentPlan = subscription?.plan ?? "Free";
  const currentStatus = subscription?.status ?? "Active";
  const activePlan = PLANS.find((p) => p.id === currentPlan) ?? PLANS[0];

  const renewalDate = subscription?.renewalDate ?? subscription?.currentPeriodEnd;
  const formattedRenewal = renewalDate
    ? new Date(renewalDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const usageResumes = usageStats?.resumeCount ?? 0;
  const usageAts = usageStats?.atsCount ?? 0;
  const usageJobs = usageStats?.savedJobCount ?? 0;

  const maxResumes = activePlan.limits.resumes;
  const maxAts = activePlan.limits.ats;
  const maxJobs = activePlan.limits.jobs;

  const handleUpgrade = async (plan: "Pro" | "Premium") => {
    if (!user?.id) return;
    setUpgrading(plan);
    try {
      await upgradeSubscriptionAction(user.id, plan);
      toast(`Successfully upgraded to ${plan}! 🎉`, "success");
      router.refresh();
    } catch {
      toast("Failed to upgrade subscription.", "error");
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    if (!user?.id) return;
    setCancelling(true);
    try {
      await cancelSubscriptionAction(user.id);
      toast("Subscription cancelled successfully.", "success");
      router.refresh();
    } catch {
      toast("Failed to cancel subscription.", "error");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Page header ── */}
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Subscription &amp; Billing</h3>
        <p className="text-[#64748B] text-sm mt-1">
          Manage your CareerMate plan, usage, and billing history.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          1. CURRENT PLAN CARD
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] rounded-2xl overflow-hidden shadow-lg relative">
        {/* Decorative glow */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 space-y-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                {activePlan.icon}
              </div>
              <div>
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                  Current Plan
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h4 className="text-2xl font-extrabold text-white">{currentPlan}</h4>
                  <StatusBadge status={currentStatus} />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {currentPlan === "Free" && (
                <button
                  onClick={() => handleUpgrade("Pro")}
                  disabled={!!upgrading}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
                >
                  {upgrading === "Pro" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                  Upgrade to Pro
                </button>
              )}
              {currentPlan === "Pro" && currentStatus === "Active" && (
                <>
                  <button
                    onClick={() => handleUpgrade("Premium")}
                    disabled={!!upgrading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
                  >
                    {upgrading === "Premium" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Crown className="w-4 h-4" />
                    )}
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 font-bold px-4 py-2 rounded-xl text-sm transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
              {currentPlan === "Premium" && currentStatus === "Active" && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 font-bold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Subscription
                </button>
              )}
              {currentStatus === "Cancelled" && (
                <button
                  onClick={() => handleUpgrade("Pro")}
                  disabled={!!upgrading}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
                >
                  {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Reactivate Plan
                </button>
              )}
            </div>
          </div>

          {/* Renewal info */}
          {formattedRenewal && currentStatus === "Active" && (
            <p className="text-slate-400 text-xs">
              {currentPlan === "Free"
                ? "No renewal required"
                : `Renews on ${formattedRenewal}`}
            </p>
          )}

          {/* Usage bars */}
          <div className="border-t border-white/10 pt-5 space-y-3">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Usage Summary</p>
            <UsageBar
              label="Resume Uploads"
              used={usageResumes}
              max={maxResumes}
              icon={<FileText className="w-3.5 h-3.5" />}
            />
            <UsageBar
              label="ATS Scans"
              used={usageAts}
              max={maxAts}
              icon={<Bot className="w-3.5 h-3.5" />}
            />
            <UsageBar
              label="Jobs Tracked"
              used={usageJobs}
              max={maxJobs}
              icon={<Briefcase className="w-3.5 h-3.5" />}
            />
          </div>
        </div>
      </div>

      {/* Cancel confirmation */}
      {showCancelConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-red-700 text-sm">Cancel your subscription?</p>
              <p className="text-red-600/80 text-xs mt-0.5">
                You will lose access to all premium features at the end of your billing period.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
            >
              Keep Plan
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
            >
              {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
              Yes, Cancel
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. AVAILABLE PLANS GRID
      ═══════════════════════════════════════════════════════════ */}
      <div>
        <h4 className="font-bold text-[#0F172A] text-base mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Available Plans
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isActive = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all ${
                  isActive
                    ? `${plan.color} shadow-md`
                    : "border-[#E5E7EB] hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.badgeBg} text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`}
                  >
                    {plan.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Current
                  </span>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-2">
                  {plan.icon}
                  <span className="font-extrabold text-[#0F172A]">{plan.label}</span>
                </div>

                {/* Price */}
                <div>
                  <span className="text-3xl font-extrabold text-[#0F172A]">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                  <p className="text-slate-500 text-xs mt-1">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      {f.included ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <span className={f.included ? "text-[#0F172A]" : "text-slate-400"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isActive ? (
                  <div className="text-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl">
                    ✓ Your current plan
                  </div>
                ) : plan.id === "Free" ? (
                  <div className="text-center text-xs text-slate-400 py-2">Free forever</div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id as "Pro" | "Premium")}
                    disabled={!!upgrading || currentStatus === "Cancelled"}
                    className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-2.5 rounded-xl transition-all disabled:opacity-50 ${
                      plan.id === "Premium"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {upgrading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                    {upgrading === plan.id ? "Upgrading..." : `Get ${plan.label}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. FEATURE COMPARISON TABLE
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bold text-[#0F172A] text-sm">Plan Comparison</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider w-1/2">Feature</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Free</th>
                <th className="px-4 py-3 font-bold text-emerald-600 uppercase tracking-wider">Pro</th>
                <th className="px-4 py-3 font-bold text-purple-600 uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Resume Uploads", free: "1", pro: "Unlimited", premium: "Unlimited" },
                { label: "ATS Scans / month", free: "5", pro: "Unlimited", premium: "Unlimited" },
                { label: "Job Applications Tracked", free: "5", pro: "Unlimited", premium: "Unlimited" },
                { label: "Skill Gap Analysis", free: "Basic", pro: "Advanced", premium: "Advanced" },
                { label: "AI Resume Tailoring", free: false, pro: true, premium: true },
                { label: "Career Roadmap", free: false, pro: true, premium: true },
                { label: "AI Interview Coaching", free: false, pro: false, premium: true },
                { label: "Priority Support", free: false, pro: true, premium: true },
                { label: "Dedicated Account Manager", free: false, pro: false, premium: true },
                { label: "API Access", free: false, pro: false, premium: true },
              ].map((row, i) => (
                <tr key={i} className={`border-t border-[#F1F5F9] ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                  <td className="px-6 py-3 font-medium text-[#0F172A]">{row.label}</td>
                  {[row.free, row.pro, row.premium].map((val, j) => (
                    <td key={j} className="px-4 py-3 text-center">
                      {val === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : val === false ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <span className={`font-semibold ${j === 1 ? "text-emerald-600" : j === 2 ? "text-purple-600" : "text-slate-600"}`}>
                          {val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          4. PAYMENT HISTORY
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-[#0F172A] text-sm">Payment History</h4>
          </div>
          {payments.length > 0 && (
            <span className="text-xs text-slate-400">{payments.length} invoice{payments.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="px-6 py-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">No payment records yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Upgrade to Pro or Premium to see your invoices here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {payments.map((payment: any) => {
              const statusMap: Record<string, string> = {
                Paid: "bg-emerald-100 text-emerald-700",
                Pending: "bg-amber-100 text-amber-700",
                Failed: "bg-red-100 text-red-700",
              };
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">
                        {payment.plan} Plan
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {payment.invoiceId} ·{" "}
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#0F172A]">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        statusMap[payment.status] ?? statusMap["Paid"]
                      }`}
                    >
                      {payment.status}
                    </span>
                    {payment.invoiceUrl ? (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300">No PDF</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
