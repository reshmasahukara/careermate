"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Palette, Layout } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isCompact, setIsCompact] = useState(false);

  // On mount: read saved preferences from localStorage and apply them
  useEffect(() => {
    const savedTheme = (localStorage.getItem("cm-theme") as "light" | "dark" | "system") || "system";
    const savedCompact = localStorage.getItem("cm-compact") === "true";
    setTheme(savedTheme);
    setIsCompact(savedCompact);
    applyTheme(savedTheme);
    if (savedCompact) document.documentElement.classList.add("compact");
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else if (newTheme === "light") {
      html.classList.remove("dark");
    } else {
      // System: follow OS preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("cm-theme", newTheme);
    applyTheme(newTheme);
    toast(`Theme switched to ${newTheme} mode.`, "success");
  };

  const toggleCompact = () => {
    const newValue = !isCompact;
    setIsCompact(newValue);
    localStorage.setItem("cm-compact", String(newValue));
    if (newValue) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
    toast(`Compact mode ${newValue ? "enabled" : "disabled"}.`, "success");
  };

  const themeOptions = [
    {
      id: "light" as const,
      label: "Light",
      icon: Sun,
      preview: (
        <div className="w-full h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center gap-1 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-8 h-1.5 rounded bg-slate-200" />
          <div className="w-4 h-1.5 rounded bg-slate-100" />
        </div>
      ),
    },
    {
      id: "dark" as const,
      label: "Dark",
      icon: Moon,
      preview: (
        <div className="w-full h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center gap-1 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="w-8 h-1.5 rounded bg-slate-600" />
          <div className="w-4 h-1.5 rounded bg-slate-700" />
        </div>
      ),
    },
    {
      id: "system" as const,
      label: "System",
      icon: Monitor,
      preview: (
        <div className="w-full h-12 rounded-lg border border-slate-200 overflow-hidden flex mb-3">
          <div className="w-1/2 bg-white flex items-center justify-center">
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="w-1/2 bg-slate-900 flex items-center justify-center">
            <Moon className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-xl">Appearance</h3>
        <p className="text-[#64748B] text-sm mt-1">Customize how CareerMate looks on your device.</p>
      </div>

      {/* Theme Selector */}
      <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-emerald-500" /> Theme
        </h4>

        <div className="grid grid-cols-3 gap-4">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleThemeChange(opt.id)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-[#E5E7EB] dark:border-slate-600 hover:border-slate-300 bg-[#FAFBFC] dark:bg-slate-700/40"
                }`}
              >
                {opt.preview}
                <Icon
                  className={`w-5 h-5 mb-2 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                />
                <span
                  className={`text-sm font-bold ${
                    isActive ? "text-emerald-700 dark:text-emerald-400" : "text-[#0F172A] dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </span>
                {isActive && (
                  <span className="mt-1.5 text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Mode */}
      <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-emerald-500" /> Layout Density
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-slate-200">Compact Mode</p>
            <p className="text-xs text-slate-500 mt-1">
              Reduce padding and spacing to fit more content on screen.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isCompact}
            onClick={toggleCompact}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              isCompact ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isCompact ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Accent Color Preview */}
      <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-emerald-500" /> Accent Color
        </h4>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-sm shadow-emerald-200" />
          <div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-slate-200">Emerald Green</p>
            <p className="text-xs text-slate-500">#10B981 — CareerMate brand accent</p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
