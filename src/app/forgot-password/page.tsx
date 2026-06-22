"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, Lock, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/Providers";
import Logo from "@/components/Logo";

type Step = "EMAIL" | "OTP" | "RESET";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State for step 1
  const [email, setEmail] = useState("");
  
  // State for step 2
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes for UI logic
  const [resendCooldown, setResendCooldown] = useState(60); // 60s cooldown
  
  // State for step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Timers
  useEffect(() => {
    if (step === "OTP") {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to send verification code.");
      } else {
        toast("Verification code sent to your email.", "success");
        setStep("OTP");
        setCountdown(600);
        setResendCooldown(60);
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit verification code.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || "Invalid verification code.");
      } else {
        toast("OTP verified successfully.", "success");
        setStep("RESET");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/resend-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to resend verification code.");
      } else {
        toast("A new verification code has been sent.", "success");
        setCountdown(600);
        setResendCooldown(60);
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to reset password.");
      } else {
        toast(data.message || "Password updated successfully.", "success");
        router.push("/login");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Password Strength logic
  const getPasswordStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  };
  const strengthScore = getPasswordStrength();
  
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center py-16 px-4 bg-[#FAFBFC]">
      <div className="w-full max-w-[480px] space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex justify-center mb-4">
            <Logo className="w-7 h-7" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            {step === "EMAIL" && "Enter your registered email address to receive a verification code."}
            {step === "OTP" && "Enter the 6-digit verification code sent to your email."}
            {step === "RESET" && "Create a strong new password for your account."}
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[20px] shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-[12px] text-xs flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {step === "EMAIL" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isLoading ? "Sending..." : "Verify Email"}
              </button>
            </form>
          )}

          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full bg-gray-50 border border-[#E5E7EB] text-gray-500 rounded-[12px] py-3 px-4 text-sm focus:outline-none pl-10 cursor-not-allowed"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                    6-Digit OTP
                  </label>
                  <span className="text-xs text-[#64748B] font-medium">Expires in: {formatTime(countdown)}</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-center text-lg tracking-[0.5em] focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || countdown === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCooldown > 0}
                  className="text-xs font-semibold text-[#10B981] hover:text-[#059669] transition-colors disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "RESET" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full ${
                            strengthScore >= level
                              ? strengthScore <= 2
                                ? "bg-rose-500"
                                : strengthScore === 3
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Must contain 8+ chars, uppercase, lowercase, number, and special character.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || strengthScore < 5}
                className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm mt-4"
              >
                {isLoading ? "Updating..." : "Change Password"}
              </button>
            </form>
          )}

          {/* Back to login link */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
