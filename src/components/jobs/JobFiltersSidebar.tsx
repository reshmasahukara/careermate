import React, { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, RefreshCw, X, Filter } from "lucide-react";

interface JobFiltersSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobFiltersSidebar({ filters, setFilters, resetFilters, isOpen, onClose }: JobFiltersSidebarProps) {
  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleRemoteToggle = () => {
    handleChange("remote", filters.remote === "remote" ? "" : "remote");
  };

  const content = (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filters
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Role, company, keywords..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 pl-10 transition-colors font-semibold text-[#0F172A]"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
        <div className="relative">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, state, or country..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 pl-10 transition-colors font-semibold text-[#0F172A]"
          />
          <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience Level</label>
        <div className="relative">
          <select
            value={filters.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 pl-10 transition-colors font-semibold text-[#0F172A] appearance-none"
          >
            <option value="">Any Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
          <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Type</label>
        <div className="relative">
          <select
            value={filters.jobType}
            onChange={(e) => handleChange("jobType", e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 pl-10 transition-colors font-semibold text-[#0F172A] appearance-none"
          >
            <option value="">Any Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Remote Toggle */}
      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
        <span className="text-sm font-bold text-[#0F172A]">Remote Only</span>
        <button 
          onClick={handleRemoteToggle}
          className={`w-11 h-6 rounded-full transition-colors relative ${filters.remote === "remote" ? "bg-emerald-500" : "bg-slate-300"}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${filters.remote === "remote" ? "left-6" : "left-1"}`} />
        </button>
      </div>

      <button
        onClick={resetFilters}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar / Drawer container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[320px] bg-white lg:bg-transparent shadow-2xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
        <div className="p-6 lg:p-0 overflow-y-auto lg:overflow-visible h-full bg-white lg:bg-transparent lg:border-none rounded-r-[24px] lg:rounded-none">
          {/* Desktop Title */}
          <div className="hidden lg:flex items-center gap-2 pb-6 border-b border-[#E2E8F0] mb-6">
            <Filter className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-black text-[#0F172A]">Filters</h2>
          </div>
          
          {content}
        </div>
      </aside>
    </>
  );
}
