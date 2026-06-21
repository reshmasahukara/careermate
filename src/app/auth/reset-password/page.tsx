"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/Providers";
import { Loader2, ArrowLeft, Check, X, Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError("No reset token provided. Please request a new link.");
        setIsValidatingToken(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/validate-reset-token?token=${token}`);
        const data = await res.json();
        
        if (!res.ok || !data.valid) {
          setTokenError(data.error || "Invalid or expired token.");
        }
      } catch (err) {
        setTokenError("Failed to validate token.");
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Strict Password Rules validation
  const rules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);
  const passwordMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast("Please meet all password requirements.", "error");
      return;
    }
    if (!passwordMatch) {
      toast("Passwords do not match.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      toast("Password updated successfully. Please sign in again.", "success");
      router.push("/login");
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F172A]" />
        <p className="text-sm font-bold text-slate-500">Validating your secure token...</p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
          <ShieldAlert className="h-6 w-6 text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A]">Link Expired or Invalid</h3>
        <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
          {tokenError}
        </p>
        <div className="mt-6">
          <Link href="/auth/forgot-password" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0F172A] hover:bg-slate-800 transition-all">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-bold text-[#0F172A] mb-2">New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#0F172A] focus:border-[#0F172A] sm:text-sm font-medium transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <p className="text-xs font-bold text-slate-700">Password requirements:</p>
        <ul className="text-xs space-y-1.5">
          <li className={`flex items-center gap-2 ${rules.length ? "text-emerald-600 font-bold" : "text-slate-500 font-medium"}`}>
            {rules.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} At least 8 characters
          </li>
          <li className={`flex items-center gap-2 ${rules.uppercase ? "text-emerald-600 font-bold" : "text-slate-500 font-medium"}`}>
            {rules.uppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} One uppercase letter
          </li>
          <li className={`flex items-center gap-2 ${rules.number ? "text-emerald-600 font-bold" : "text-slate-500 font-medium"}`}>
            {rules.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} One number
          </li>
          <li className={`flex items-center gap-2 ${rules.special ? "text-emerald-600 font-bold" : "text-slate-500 font-medium"}`}>
            {rules.special ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} One special character
          </li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#0F172A] mb-2">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="appearance-none block w-full px-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#0F172A] focus:border-[#0F172A] sm:text-sm font-medium transition-colors"
          placeholder="••••••••"
        />
        {confirmPassword.length > 0 && (
          <p className={`text-xs font-bold mt-2 ${passwordMatch ? "text-emerald-600" : "text-rose-500"}`}>
            {passwordMatch ? "Passwords match!" : "Passwords do not match."}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !isPasswordValid || !passwordMatch}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0F172A] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#0F172A] font-black text-2xl tracking-tighter">
          CareerMate.
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F172A]">
          Create New Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium px-4">
          Choose a strong password to protect your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-[16px] sm:px-10 border border-slate-100 transition-all duration-300">
          
          <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0F172A]" />}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="text-center">
              <Link href="/login" className="font-bold text-sm text-[#0F172A] hover:text-slate-700 flex items-center justify-center gap-2 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to sign in
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
