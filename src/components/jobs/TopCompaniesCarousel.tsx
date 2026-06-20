import React from "react";
import Image from "next/image";

const COMPANIES = [
  { name: "Google", logoUrl: "https://logo.clearbit.com/google.com", industry: "Technology", openJobs: 124 },
  { name: "Microsoft", logoUrl: "https://logo.clearbit.com/microsoft.com", industry: "Technology", openJobs: 89 },
  { name: "Amazon", logoUrl: "https://logo.clearbit.com/amazon.com", industry: "E-Commerce", openJobs: 215 },
  { name: "Apple", logoUrl: "https://logo.clearbit.com/apple.com", industry: "Consumer Electronics", openJobs: 67 },
  { name: "Meta", logoUrl: "https://logo.clearbit.com/meta.com", industry: "Social Media", openJobs: 92 },
  { name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", industry: "Entertainment", openJobs: 45 },
];

export default function TopCompaniesCarousel() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-black text-[#0F172A] mb-4">Top Companies Hiring</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        {COMPANIES.map((company) => (
          <div 
            key={company.name} 
            className="flex-shrink-0 w-[240px] snap-start bg-white border border-[#E2E8F0] rounded-[20px] p-5 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-[#E2E8F0] group-hover:border-emerald-200 transition-colors">
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">{company.name}</h3>
                <p className="text-xs text-[#64748B] font-medium">{company.industry}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                {company.openJobs} open jobs
              </span>
              <span className="text-slate-400 text-xs font-bold group-hover:text-emerald-500 transition-colors">
                View &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
