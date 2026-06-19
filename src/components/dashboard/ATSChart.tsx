"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

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

  const mockHistory = useMemo(() => {
    // If no real data, generate a plausible mock progression
    if (!history || history.length < 2) {
      const now = Date.now();
      return Array.from({ length: 8 }, (_, i) => ({
        date: new Date(now - (7 - i) * 4 * 24 * 60 * 60 * 1000),
        score: 45 + i * 5 + Math.floor(Math.random() * 6),
      }));
    }
    return history.map((h) => ({ date: new Date(h.date), score: h.score }));
  }, [history]);

  const rangeDays: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

  const filtered = useMemo(() => {
    const cutoff = new Date(Date.now() - rangeDays[range] * 24 * 60 * 60 * 1000);
    const data = mockHistory.filter((p) => p.date >= cutoff);
    return data.length >= 2 ? data : mockHistory;
  }, [mockHistory, range]);

  // SVG chart math
  const W = 400;
  const H = 120;
  const PAD = 16;
  const minScore = Math.max(0, Math.min(...filtered.map((p) => p.score)) - 10);
  const maxScore = Math.min(100, Math.max(...filtered.map((p) => p.score)) + 10);
  const scaleY = (score: number) =>
    H - PAD - ((score - minScore) / (maxScore - minScore)) * (H - PAD * 2);
  const scaleX = (i: number) => PAD + (i / (filtered.length - 1)) * (W - PAD * 2);

  const pathD = filtered
    .map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${scaleY(p.score).toFixed(1)}`)
    .join(" ");

  const areaD = `${pathD} L${scaleX(filtered.length - 1).toFixed(1)},${H} L${PAD},${H} Z`;

  const improvement =
    filtered.length >= 2
      ? filtered[filtered.length - 1].score - filtered[0].score
      : 0;

  const isMock = !history || history.length < 2;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-[#111827]">
              {currentScore ?? filtered[filtered.length - 1]?.score ?? "—"}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Current</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div>
            <p className="text-2xl font-extrabold text-[#111827]">
              {highestScore ?? Math.max(...filtered.map((p) => p.score))}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Best</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div>
            <p className={`text-2xl font-extrabold ${improvement >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {improvement >= 0 ? "+" : ""}{improvement}
            </p>
            <p className="text-[11px] text-[#64748B] uppercase tracking-wider">Trend</p>
          </div>
        </div>

        <div className="flex gap-1 bg-[#F7F8FA] border border-[#E5E7EB] p-1 rounded-xl">
          {(["7d", "30d", "90d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                range === r
                  ? "bg-white shadow-sm text-[#111827]"
                  : "text-[#64748B] hover:text-[#111827]"
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
          className="w-full h-[120px]"
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
          <path d={areaD} fill="url(#atsGrad)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {filtered.map((p, i) => (
            <circle key={i} cx={scaleX(i)} cy={scaleY(p.score)} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {isMock && (
        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 font-medium">
          <TrendingUp className="w-3 h-3" />
          Run your first ATS scan to see real score history.
        </div>
      )}
    </div>
  );
}
