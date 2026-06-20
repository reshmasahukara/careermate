"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Target, Compass, Book, ExternalLink } from "lucide-react";
import LearningPaths from "@/components/career-pathways/LearningPaths";
import LearningResources from "@/components/career-pathways/LearningResources";
import { getAvailableRolesAction } from "@/app/actions/pathways";
import Link from "next/link";

export default function CareerPathwaysPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "demo-user-123";

  const [activeTab, setActiveTab] = useState<"paths" | "resources">("paths");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadRoles();
    }
  }, [session]);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await getAvailableRolesAction(userId);
      setAvailableRoles(roles);
      if (roles.length > 0) {
        setTargetRole(roles[0]); // Default to first available role
      }
    } catch (error) {
      console.error("Failed to load roles", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Career Pathways</h1>
            <p className="text-[#64748B] text-sm font-semibold mt-1">Bridge the gap between your skills and your target career.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : availableRoles.length === 0 ? (
          /* Empty State: No Target Roles */
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] min-h-[400px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No learning path available</h3>
            <p className="text-[#64748B] text-sm max-w-sm mb-8">
              Upload your resume and select a target role in the Skill Gap Analysis module to generate a personalized roadmap.
            </p>
            <Link 
              href="/skill-gap"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm"
            >
              Analyze Skills
            </Link>
          </div>
        ) : (
          /* Main Content */
          <>
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Tabs */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("paths")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "paths" 
                      ? "bg-white text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Target className="w-4 h-4" /> Learning Paths
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "resources" 
                      ? "bg-white text-blue-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Book className="w-4 h-4" /> Learning Resources
                </button>
              </div>

              {/* Role Selector */}
              <div className="relative min-w-[250px] shrink-0">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500 appearance-none transition-colors"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <Target className="absolute left-3.5 top-3 w-4.5 h-4.5 text-emerald-500 pointer-events-none" />
              </div>
            </div>

            {/* Dynamic Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "paths" ? (
                <LearningPaths userId={userId} targetRole={targetRole} />
              ) : (
                <LearningResources userId={userId} targetRole={targetRole} />
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
