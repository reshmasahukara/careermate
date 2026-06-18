"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, Star, Zap, HelpCircle, ChevronDown, Check } from "lucide-react";
import { useToast } from "@/components/Providers";
import { getSubscriptionAction, upgradeSubscriptionAction } from "@/app/actions/settings";
import Link from "next/link";

export default function PricingPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [activePlan, setActivePlan] = useState("Pro");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadActiveSubscription();
    }
  }, [session]);

  const loadActiveSubscription = async () => {
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const sub = await getSubscriptionAction(userId);
      if (sub) {
        setActivePlan(sub.plan);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgrade = async (plan: "Free" | "Pro" | "Premium" | "Enterprise") => {
    if (!session?.user) {
      toast("Please sign in to upgrade subscription plans.", "warning");
      return;
    }

    const userId = (session.user as any).id || "demo-user-123";
    try {
      await upgradeSubscriptionAction(userId, plan);
      setActivePlan(plan);
      toast(`Successfully shifted subscription plan to ${plan}!`, "success");
    } catch (err) {
      toast("Error upgrading subscription.", "error");
    }
  };

  const pricingCards = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Test out our basic parsing features.",
      features: [
        "1 resume upload limit",
        "Basic ATS optimization score",
        "Limited job recommendations",
        "Community help resources"
      ],
      buttonText: "Register Account",
      badge: "Sandbox",
      actionPlan: "Free",
      color: "border-slate-200"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      description: "Perfect for active software job hunting.",
      features: [
        "Unlimited resume uploads",
        "Advanced ATS keyword suggestions",
        "Detailed skill gap diagnostics",
        "Advanced filterable job lists",
        "Email support response in 24h"
      ],
      buttonText: "Upgrade to Pro",
      badge: "Most Popular",
      actionPlan: "Pro",
      color: "border-primary shadow-lg shadow-primary/5 relative scale-[1.02] z-10"
    },
    {
      name: "Premium",
      price: "$39",
      period: "/mo",
      description: "Accelerate development and leaders target.",
      features: [
        "Everything in Pro plan",
        "AI career roadmaps & tracking",
        "Mock interview preparation",
        "Priority support response in 2h",
        "Exclusive career masterclasses"
      ],
      buttonText: "Get Premium",
      badge: "Deep Study",
      actionPlan: "Premium",
      color: "border-slate-200"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For universities, coding camps, & groups.",
      features: [
        "Multi-user seat management",
        "University bulk licenses",
        "Custom database API integrations",
        "Dedicated success manager",
        "Monthly analytical reports"
      ],
      buttonText: "Contact Sales",
      badge: "Scale Growth",
      actionPlan: "Enterprise",
      color: "border-slate-200"
    }
  ] as const;

  const faqs = [
    {
      question: "Can I cancel my monthly subscription anytime?",
      answer: "Yes, you can cancel, upgrade, or downgrade your plan at any time through your Profile settings. Once cancelled, your Pro/Premium features will remain active until the end of your billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We support all major credit cards, Apple Pay, Google Pay, and PayPal processing securely via Stripe integration."
    },
    {
      question: "Do you offer university or coding boot camp discounts?",
      answer: "Yes! Our Enterprise plan includes custom packages for academic institutions. Contact our team to request a custom bulk quote."
    }
  ];

  return (
    <div className="flex-1 bg-brand-bg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Flexible Pricing Built for Every Career Goal
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Benchmarking scores and building learning paths should be accessible. Choose the subscription level that matches your growth velocity.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingCards.map((card) => {
            const isCurrent = activePlan === card.actionPlan;
            const isPro = card.name === "Pro";

            return (
              <div
                key={card.name}
                className={`glass-card p-8 rounded-2xl border flex flex-col justify-between ${card.color} ${
                  isPro ? "bg-white" : ""
                }`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      isPro ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{card.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-black text-slate-900">{card.price}</span>
                      {card.period && (
                        <span className="text-slate-400 font-semibold text-xs ml-1">{card.period}</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs leading-normal">{card.description}</p>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Feature Checklists */}
                  <ul className="space-y-3">
                    {card.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  {session ? (
                    <button
                      onClick={() => handleUpgrade(card.actionPlan as any)}
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : isPro
                          ? "bg-primary hover:bg-blue-700 text-white shadow-md shadow-primary/15"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {isCurrent ? "Active Plan" : card.buttonText}
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all cursor-pointer ${
                        isPro
                          ? "bg-primary hover:bg-blue-700 text-white shadow-md"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {card.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-extrabold text-center text-slate-900">Pricing Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 font-bold text-slate-800 text-left cursor-pointer"
                >
                  <span className="text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm border-t border-slate-50 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
