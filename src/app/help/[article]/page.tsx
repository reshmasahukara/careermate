import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { ChevronLeft, FileText, CheckCircle2 } from "lucide-react";

export default function HelpArticlePage({ params }: { params: { article: string } }) {
  // Format the slug back to a readable title
  const title = params.article.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        
        <div>
          <div className="flex items-center gap-3 text-sm font-semibold text-blue-600 mb-4 bg-blue-50 w-fit px-3 py-1 rounded-lg">
            <FileText className="w-4 h-4" /> Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
          <p className="text-[#64748B] text-sm mt-4">Last updated on June 18, 2026</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 md:p-12 shadow-sm prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            This is a comprehensive guide to help you understand how to navigate and utilize this feature effectively. Our platform uses advanced algorithms to process your inputs and provide actionable feedback.
          </p>

          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Step-by-step Instructions</h2>
          <ul className="space-y-4 list-none pl-0">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Navigate to the module:</strong> Access this tool directly from your dashboard sidebar.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Input your data:</strong> Provide the necessary files or selections when prompted by the application interface.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Review results:</strong> Once processing is complete, carefully review the generated insights and follow the recommended action items.
              </div>
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mt-8">
            <h4 className="font-bold text-blue-900 m-0">Pro Tip</h4>
            <p className="text-blue-800 text-sm mt-2 mb-0">
              For the best results, ensure your data is up-to-date. If you encounter errors, try refreshing the page or checking your internet connection.
            </p>
          </div>

          <h2 className="text-xl font-bold text-[#0F172A] mt-10 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Why is my data not updating?</h4>
              <p className="text-slate-600 text-sm">Our system uses optimistic updates to make the UI feel fast, but sometimes background syncing takes a few seconds. If it still doesn't update, clear your cache.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Is this feature available on the Free plan?</h4>
              <p className="text-slate-600 text-sm">Basic access is free. For advanced insights and historical data retention, consider upgrading to Pro.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-[20px] p-6 text-center sm:text-left gap-4">
          <div>
            <h4 className="font-bold text-[#0F172A]">Was this article helpful?</h4>
            <p className="text-slate-500 text-sm">Let us know so we can improve our documentation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">Yes</button>
            <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">No</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
