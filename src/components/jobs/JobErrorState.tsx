import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface JobErrorStateProps {
  onRetry: () => void;
}

export default function JobErrorState({ onRetry }: JobErrorStateProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center flex flex-col items-center shadow-sm">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-black text-[#0F172A] mb-3">We couldn't load job recommendations</h1>
      <p className="text-slate-500 font-semibold mb-8 max-w-md leading-relaxed">
        There was a temporary connection issue. Please try again.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={onRetry}
          className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold py-3 px-8 rounded-xl shadow-sm transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
