"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, EyeOff, Eye, ShieldAlert, KeyRound, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Providers";
import Logo from "@/components/Logo";

const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, { message: "Code must be 6 digits." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!emailParam) {
      setErrorMsg("Missing email address. Please start the reset process again.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          otp: data.otp,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error || "Failed to reset password.");
        toast("Failed to reset password.", "error");
        return;
      }

      toast("Password successfully reset! Please sign in.", "success");
      router.push("/login");
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center py-16 px-4 bg-[#FAFBFC]">
      <div className="w-full max-w-[480px] space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex justify-center mb-4">
            <Logo className="w-7 h-7" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Set new password
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Enter the 6-digit code sent to {emailParam || "your email"} and choose a new password.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[20px] shadow-sm space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-[12px] text-xs flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  {...register("otp")}
                  placeholder="000000"
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10 tracking-widest font-mono"
                />
                <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
              </div>
              {errors.otp && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter new password"
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
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10"
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex-1 min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F172A]" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
