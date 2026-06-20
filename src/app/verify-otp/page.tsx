"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/Providers";
import Logo from "@/components/Logo";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast("Please enter a valid 6-digit code.", "error");
      return;
    }

    const sessionData = sessionStorage.getItem("signup_data");
    if (!sessionData) {
      toast("Registration data lost. Please sign up again.", "error");
      router.push("/signup");
      return;
    }

    const { name, password } = JSON.parse(sessionData);

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast(result.error || "Verification failed.", "error");
        return;
      }

      toast("Email verified successfully! Please sign in.", "success");
      sessionStorage.removeItem("signup_data");
      router.push("/login");
    } catch (err) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    const sessionData = sessionStorage.getItem("signup_data");
    if (!sessionData) return;
    const { name, password } = JSON.parse(sessionData);

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        toast("Failed to resend code.", "error");
        return;
      }

      toast("Code resent successfully.", "success");
      setCountdown(60);
    } catch (err) {
      toast("An error occurred while resending the code.", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center py-16 px-4 bg-[#FAFBFC]">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex justify-center mb-4">
            <Logo className="w-7 h-7" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            We sent a 6-digit verification code to your email.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[20px] shadow-sm space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none text-[#64748B] pl-10 cursor-not-allowed"
                />
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm mt-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#10B981] hover:text-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="w-8 h-8 border-4 border-[#1E293B] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
