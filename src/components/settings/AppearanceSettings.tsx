"use client";

import React, { useState } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { useToast } from "@/components/Providers";

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isCompact, setIsCompact] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast(`Theme updated to ${newTheme} mode.`, "success");
    // In a real app, this would trigger next-themes or a context update
  };

  const toggleCompact = () => {
    setIsCompact(!isCompact);
    toast(`Compact mode ${!isCompact ? "enabled" : "disabled"}.`, "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Appearance</h3>
        <p className="text-[#64748B] text-sm mt-1">Customize how CareerMate looks on your device.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-emerald-500" /> Theme Preference
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange("light")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              theme === "light" ? "border-emerald-500 bg-emerald-50" : "border-[#E5E7EB] hover:border-slate-300 bg-[#FAFBFC]"
            }`}
          >
            <Sun className={`w-8 h-8 mb-3 ${theme === "light" ? "text-emerald-600" : "text-slate-400"}`} />
            <span className={`text-sm font-bold ${theme === "light" ? "text-emerald-700" : "text-[#0F172A]"}`}>Light Mode</span>
          </button>

          <button
            onClick={() => handleThemeChange("dark")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              theme === "dark" ? "border-emerald-500 bg-emerald-50" : "border-[#E5E7EB] hover:border-slate-300 bg-[#FAFBFC]"
            }`}
          >
            <Moon className={`w-8 h-8 mb-3 ${theme === "dark" ? "text-emerald-600" : "text-slate-400"}`} />
            <span className={`text-sm font-bold ${theme === "dark" ? "text-emerald-700" : "text-[#0F172A]"}`}>Dark Mode</span>
          </button>

          <button
            onClick={() => handleThemeChange("system")}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              theme === "system" ? "border-emerald-500 bg-emerald-50" : "border-[#E5E7EB] hover:border-slate-300 bg-[#FAFBFC]"
            }`}
          >
            <Monitor className={`w-8 h-8 mb-3 ${theme === "system" ? "text-emerald-600" : "text-slate-400"}`} />
            <span className={`text-sm font-bold ${theme === "system" ? "text-emerald-700" : "text-[#0F172A]"}`}>System Sync</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-emerald-500" /> Layout Density
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Compact Mode</p>
            <p className="text-xs text-slate-500 mt-1">Reduce padding and spacing to show more content on screen.</p>
          </div>
          <button
            type="button"
            onClick={toggleCompact}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isCompact ? "bg-emerald-500" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isCompact ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
