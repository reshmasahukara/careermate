"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BarChart2, FileSearch } from "lucide-react";

interface AtsDataPoint {
  date: Date | string;
  score: number;
}

interface ATSChartProps {
  history: AtsDataPoint[];
  currentScore: number | null;
  highestScore: number | null;
}

type Range = "7d" | "30d" | "90d";

export default function ATSChart({ history, currentScore, highestScore }: ATSChartProps) {
  const [range, setRange] = useState<Range>("30d");

  const rangeDays: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

  const parsedHistory = useMemo(() => {
    return (history || []).map((h) => ({ date: new Date(h.date), score: h.score }));
  }, [history]);

  const filtered = useMemo(() => {
    if (parsedHistory.length === 0) return [];
    const cutoff = new Date(new Date().getTime() - rangeDays[range] * 24 * 60 * 60 * 1000);
    return parsedHistory.filter((p) => p.date >= cutoff);
  }, [parsedHistory, range]);

  const isEmpty = parsedHistory.length < 2;

  // SVG chart math
  const W = 400;
  const H = 120;
  const PAD = 16;
  
  // Need to handle if filtered is empty but parsedHistory isn't (user has data but none in range)
  const displayData = isEmpty 
    ? [{ date: new Date(), score: 50 }, { date: new Date(), score: 50 }]
    : (filtered.length >= 2 ? filtered : parsedHistory);

  const minScore = isEmpty ? 0 : Math.max(0, Math.min(...displayData.map((p) => p.score)) - 10);
  const maxScore = isEmpty ? 100 : Math.min(100, Math.max(...displayData.map((p) => p.score)) + 10);
  const scaleY = (score: number) =>
    H - PAD - ((score - minScore) / (maxScore - minScore)) * (H - PAD * 2);
  const scaleX = (i: number) => PAD + (i / (displayData.length - 1)) * (W - PAD * 2);

  const pathD = isEmpty 
    ? "" 
    : displayData
        .map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${scaleY(p.score).toFixed(1)}`)
        .join(" ");

  const areaD = isEmpty ? "" : `${pathD} L${scaleX(displayData.length - 1).toFixed(1)},${H} L${PAD},${H} Z`;

  const improvement = isEmpty
    ? null
    : (displayData.length >= 2 ? displayData[displayData.length - 1].score - displayData[0].score : 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-[#111827]">
              {isEmpty ? "--" : (currentScore ?? displayData[displayData.length - 1]?.score ?? "—")}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Current</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div>
            <p className="text-2xl font-extrabold text-[#111827]">
              {isEmpty ? "--" : (highestScore ?? Math.max(...displayData.map((p) => p.score)))}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Best</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div>
            <p className={`text-2xl font-extrabold ${isEmpty ? "text-slate-400" : (improvement ?? 0) >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {isEmpty ? "--" : `${(improvement ?? 0) >= 0 ? "+" : ""}${improvement}`}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Trend</p>
          </div>
        </div>

        <div className="flex gap-1 bg-[#F7F8FA] border border-[#E5E7EB] p-1 rounded-xl">
          {(["7d", "30d", "90d"] as Range[]).map((r) => (
            <button
              key={r}
              disabled={isEmpty}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                range === r && !isEmpty
                  ? "bg-white shadow-sm text-[#111827]"
                  : "text-[#64748B] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`w-full h-[120px] ${isEmpty ? "opacity-30" : ""}`}
          aria-label="ATS score trend chart"
        >
          <defs>
            <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <line
              key={v}
              x1={PAD}
              x2={W - PAD}
              y1={scaleY(Math.max(minScore, Math.min(maxScore, v)))}
              y2={scaleY(Math.max(minScore, Math.min(maxScore, v)))}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}
          {/* Area fill */}
          {!isEmpty && <path d={areaD} fill="url(#atsGrad)" />}
          {/* Line */}
          {!isEmpty && <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {/* Dots */}
          {!isEmpty && displayData.map((p, i) => (
            <circle key={i} cx={scaleX(i)} cy={scaleY(p.score)} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
          ))}
        </svg>

        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/80 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Your insights will appear after your first analysis.
            </p>
            <Link 
              href="/ats-checker" 
              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1 rounded-lg transition-colors"
            >
              Run ATS Scan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
