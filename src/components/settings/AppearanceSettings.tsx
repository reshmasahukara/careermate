"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Palette, Layout } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCompact, setIsCompact] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read saved theme on mount
  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("cm-theme") as "light" | "dark") || "light";
    setTheme(saved);
    setIsCompact(localStorage.getItem("cm-compact") === "true");
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("cm-theme", newTheme);
    setTheme(newTheme);
    toast(`Switched to ${newTheme} mode`, "success");
  };

  const toggleCompact = () => {
    const next = !isCompact;
    setIsCompact(next);
    if (next) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
    localStorage.setItem("cm-compact", String(next));
    toast(`Compact mode ${next ? "enabled" : "disabled"}`, "success");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Appearance</h3>
        <p className="text-[#64748B] text-sm mt-1">
          Choose how CareerMate looks. Theme applies across the whole site.
        </p>
      </div>

      {/* Theme toggle */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-emerald-500" />
          Theme
        </h4>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {/* Light */}
          <button
            onClick={() => applyTheme("light")}
            className={`group relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              theme === "light"
                ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                : "border-[#E5E7EB] bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            {/* Mini preview */}
            <div className="w-full h-14 rounded-xl bg-white border border-slate-200 flex flex-col justify-start p-2 mb-4 overflow-hidden">
              <div className="w-full h-2 rounded bg-slate-100 mb-1.5" />
              <div className="flex gap-1">
                <div className="w-1/3 h-6 rounded bg-slate-100" />
                <div className="flex-1 space-y-1">
                  <div className="w-full h-1.5 rounded bg-slate-200" />
                  <div className="w-2/3 h-1.5 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            <Sun
              className={`w-6 h-6 mb-2 transition-colors ${
                theme === "light" ? "text-emerald-500" : "text-slate-400"
              }`}
            />
            <span
              className={`text-sm font-bold transition-colors ${
                theme === "light" ? "text-emerald-700" : "text-[#0F172A]"
              }`}
            >
              Light
            </span>

            {theme === "light" && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Dark */}
          <button
            onClick={() => applyTheme("dark")}
            className={`group relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              theme === "dark"
                ? "border-emerald-500 bg-slate-900 shadow-md shadow-emerald-900/20"
                : "border-[#E5E7EB] bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            {/* Mini preview */}
            <div className="w-full h-14 rounded-xl bg-slate-900 border border-slate-700 flex flex-col justify-start p-2 mb-4 overflow-hidden">
              <div className="w-full h-2 rounded bg-slate-700 mb-1.5" />
              <div className="flex gap-1">
                <div className="w-1/3 h-6 rounded bg-slate-800" />
                <div className="flex-1 space-y-1">
                  <div className="w-full h-1.5 rounded bg-slate-600" />
                  <div className="w-2/3 h-1.5 rounded bg-slate-700" />
                </div>
              </div>
            </div>

            <Moon
              className={`w-6 h-6 mb-2 transition-colors ${
                theme === "dark" ? "text-emerald-400" : "text-slate-400"
              }`}
            />
            <span
              className={`text-sm font-bold transition-colors ${
                theme === "dark" ? "text-emerald-400" : "text-[#0F172A]"
              }`}
            >
              Dark
            </span>

            {theme === "dark" && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your preference is saved and applied across the entire site automatically.
        </p>
      </div>

      {/* Compact Mode */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-emerald-500" />
          Layout Density
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Compact Mode</p>
            <p className="text-xs text-slate-500 mt-1">
              Reduce padding and spacing for a denser interface.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isCompact}
            onClick={toggleCompact}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
              isCompact ? "bg-emerald-500" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                isCompact ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Accent color info */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-emerald-500" />
          Accent Color
        </h4>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 shadow-sm" />
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Emerald Green</p>
            <p className="text-xs text-slate-500 mt-0.5">#10B981 — CareerMate brand color</p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
