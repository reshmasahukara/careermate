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

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
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
      // Simulate/Trigger signup registration.
      // Since CredentialsProvider handles auto-registration for any email with a password >= 6
      // in our lib/auth.ts (mock mode), or adds it to users in Prisma if connected,
      // we call signIn directly to log them in!
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast("Registration failed. Please try again.", "error");
      } else {
        toast("Account created successfully! Welcome to CareerMate.", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast("An error occurred during registration.", "error");
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
    <div className="flex-1 min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-50 via-slate-100 to-blue-50/30">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              CM
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              CareerMate
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-blue-700 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Card wrapper */}
        <div className="glass-card p-8 rounded-2xl shadow-xl space-y-6">
          {/* Social Sign-In */}
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 border border-slate-200 rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-slate-200" />
            <span className="relative px-3 bg-white text-xs text-slate-500 font-semibold uppercase">
              Or fill in your details
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Alex Morgan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors pl-10"
                />
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors pl-10"
                />
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative border-none">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors pl-10 pr-10"
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
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
                      strengthLabel === "Strong" ? "text-emerald-500" : "text-slate-400"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors pl-10"
                />
                <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
