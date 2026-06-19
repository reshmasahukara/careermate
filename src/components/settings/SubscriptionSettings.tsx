"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle2, Zap, ArrowUpRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/Providers";
import { upgradeSubscriptionAction } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

interface SubscriptionSettingsProps {
  subscription: any;
  user: any;
}

export default function SubscriptionSettings({ subscription, user }: SubscriptionSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentPlan = subscription?.plan || "Free";

  const handleUpgrade = async (plan: "Pro" | "Premium") => {
    if (!user?.id) return;
    setIsUpgrading(true);
    try {
      await upgradeSubscriptionAction(user.id, plan);
      toast(`Successfully upgraded to the ${plan} plan!`, "success");
      router.refresh();
    } catch (err) {
      toast("Failed to upgrade subscription.", "error");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Subscription & Billing</h3>
        <p className="text-[#64748B] text-sm mt-1">Manage your CareerMate plan and billing history.</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] rounded-2xl p-1 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap className="w-32 h-32 text-white" />
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-[14px] p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">Current Plan</span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
                {currentPlan}
                {currentPlan !== "Free" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </h4>
              <p className="text-slate-400 text-sm mt-2 max-w-md">
                {currentPlan === "Free" 
                  ? "You are currently on the free tier. Upgrade to unlock advanced ATS tracking and unlimited AI interview sessions."
                  : "You have full access to all premium CareerMate features, including advanced AI resume tailoring."}
              </p>
            </div>
            
            {currentPlan === "Free" ? (
              <button
                onClick={() => handleUpgrade("Pro")}
                disabled={isUpgrading}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm w-full sm:w-auto shrink-0 disabled:opacity-50"
              >
                {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                {isUpgrading ? "Upgrading..." : "Upgrade to Pro"}
              </button>
            ) : (
              <button
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto shrink-0 border border-white/10"
              >
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-emerald-500" /> Payment Methods
        </h4>
        <div className="p-4 border border-[#E5E7EB] border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-[#FAFBFC]">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-[#0F172A]">No payment methods added</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Add a card to seamlessly upgrade your plan in the future.</p>
          <button className="text-xs font-bold text-[#0F172A] bg-white border border-[#E5E7EB] hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors shadow-sm">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
