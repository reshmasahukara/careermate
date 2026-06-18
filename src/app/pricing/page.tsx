"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Test out basic scoring options.",
    features: [
      "1 resume upload limit",
      "Basic ATS optimization score",
      "Limited job recommendations"
    ],
    cta: "Register Account",
    action: "Free",
    highlight: false
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
      "Advanced filterable job lists"
    ],
    cta: "Upgrade to Pro",
    action: "Pro",
    highlight: true
  },
  {
    name: "Premium",
    price: "$39",
    period: "/mo",
    description: "Accelerate development and leaders targets.",
    features: [
      "Everything in Pro plan",
      "AI career roadmaps & tracking",
      "Mock interview preparation",
      "Priority support response in 2h"
    ],
    cta: "Get Premium",
    action: "Premium",
    highlight: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Custom solutions for universities, career centers, and organizations.",
    features: [
      "Multi-user seat management",
      "University bulk licenses",
      "Custom database API integrations",
      "Dedicated success manager"
    ],
    cta: "Contact Sales",
    action: "Enterprise",
    highlight: false
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    if (planName === "Free") {
      router.push("/dashboard");
      return;
    }

    setIsCheckingOut(planName);

    try {
      const mockPriceId = planName === "Pro" ? "price_1Pro" : "price_1Premium";
      
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: planName, priceId: mockPriceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data);
        alert("Failed to create checkout session. Check console for details.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during checkout.");
    } finally {
      setIsCheckingOut(null);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        {/* PRICING */}
        <section className="w-full bg-[#FFFFFF] border-b border-[#E5E7EB]/70 flex-grow h-full pt-[40px]">
          <div className="max-w-[1280px] px-6 mx-auto w-full py-[96px] md:py-[72px] py-[56px] space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest bg-slate-100 border border-[#E5E7EB] px-3 py-1 rounded-full">
                Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Choose Your Plan
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                Flexible plans for every career stage.
              </p>
            </div>

            {/* 4 pricing columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {pricingPlans.map((plan, index) => {
                return (
                  <div
                    key={`plan-${plan.name}-${index}`}
                    className={`premium-card p-6 rounded-card bg-white flex flex-col justify-between ${
                      plan.highlight 
                        ? "border-[#10B981] ring-2 ring-[#10B981]/5 shadow-md shadow-[#10B981]/5 bg-[#10B981]/[0.005]" 
                        : "border-[#E5E7EB]"
                    }`}
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          plan.highlight ? "bg-[#10B981]/10 text-[#10B981]" : "bg-slate-100 text-slate-500"
                        }`}>
                          {plan.name}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-black text-slate-900 font-sans">{plan.price}</span>
                          {plan.period && (
                            <span className="text-slate-400 font-semibold text-xs ml-1">{plan.period}</span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs leading-normal font-semibold">{plan.description}</p>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Checklist */}
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, index) => (
                          <li key={`feat-${feat}-${index}`} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-relaxed text-left">
                            <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8">
                      <button
                        onClick={() => handleSubscribe(plan.name)}
                        disabled={isCheckingOut === plan.name}
                        className={`w-full py-2.5 rounded-btn text-xs font-bold uppercase tracking-wider text-center block transition-all cursor-pointer ${
                          plan.highlight
                            ? "bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm"
                            : "bg-white hover:bg-slate-50 border border-[#E5E7EB] text-slate-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isCheckingOut === plan.name ? "Processing..." : plan.cta}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
