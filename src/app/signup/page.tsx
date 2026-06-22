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
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
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

          </form>
        </div>
      </div>
    </div>
  );
}
