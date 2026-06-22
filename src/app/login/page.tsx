"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, ShieldAlert, LogIn } from "lucide-react";
import { useToast } from "@/components/Providers";
import Logo from "@/components/Logo";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setErrorMsg(result.error);
        toast(result.error, "error");
      } else {
        toast("Successfully logged in!", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      toast("An error occurred during sign in.", "error");
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            New to CareerMate?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#10B981] hover:text-[#059669] transition-colors underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[20px] shadow-sm space-y-6">


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-[12px] text-xs flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

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
              <div className="relative">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0F172A] focus:ring-[#0F172A] border-[#E5E7EB] rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-xs font-semibold text-[#64748B] uppercase tracking-wider cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
