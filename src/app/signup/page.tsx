"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useToast } from "@/components/Providers";
import Logo from "@/components/Logo";

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().trim().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number." })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least 1 special character." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Too Short");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  // Calculate password strength
  useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength(0);
      setStrengthLabel("Too Short");
      return;
    }

    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 10) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;

    setPasswordStrength(score);

    if (passwordValue.length < 6) {
      setStrengthLabel("Too Short");
    } else if (score <= 2) {
      setStrengthLabel("Weak");
    } else if (score <= 4) {
      setStrengthLabel("Medium");
    } else {
      setStrengthLabel("Strong");
    }
  }, [passwordValue]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const resultData = await response.json();

      if (!response.ok) {
        toast(resultData.error || "Registration failed. Please try again.", "error");
        return;
      }

      toast("Verification code sent!", "success");
      
      // Store registration data in sessionStorage temporarily
      sessionStorage.setItem(
        "signup_data",
        JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      );
      
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast("An unexpected error occurred during registration.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google") => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const getStrengthBarColor = () => {
    if (passwordStrength === 0) return "bg-slate-200";
    if (strengthLabel === "Weak") return "bg-rose-500";
    if (strengthLabel === "Medium") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center py-16 px-4 bg-[#FAFBFC]">
      <div className="w-full max-w-[480px] space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex justify-center mb-4">
            <Logo className="w-7 h-7" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#10B981] hover:text-[#059669] transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[20px] shadow-sm space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Enter your full name"
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10"
                />
                <User className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10"
                />
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Password
              </label>
              <div className="relative border-none">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
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

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Password Strength</span>
                    <span className={
                      strengthLabel === "Weak" ? "text-rose-500" :
                      strengthLabel === "Medium" ? "text-amber-500" :
                      strengthLabel === "Strong" ? "text-emerald-500" : "text-[#64748B]"
                    }>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 1 ? getStrengthBarColor() : "bg-slate-200"}`} />
                    <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 3 ? getStrengthBarColor() : "bg-slate-200"}`} />
                    <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 5 ? getStrengthBarColor() : "bg-slate-200"}`} />
                  </div>
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
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-[12px] py-3 px-4 text-sm focus:outline-none focus:border-[#1E293B] focus:bg-white transition-colors pl-10"
                />
                <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-x-0 h-px bg-[#E5E7EB]" />
              <span className="relative px-3 bg-white text-xs text-[#64748B] font-semibold uppercase tracking-wider">
                OR SIGN UP WITH
              </span>
            </div>

            {/* Social Sign-In */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAFBFC] text-[#0F172A] font-semibold py-3 px-4 border border-[#E5E7EB] rounded-[12px] shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
