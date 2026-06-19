"use client";

import React, { useState } from "react";
import { User, Camera, Loader2, Save } from "lucide-react";
import { useToast } from "@/components/Providers";
import { updateProfileAction } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  user: any;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    jobTitle: user?.jobTitle || "",
    experienceLevel: user?.experienceLevel || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await updateProfileAction(user.id, formData);
      toast("Profile updated successfully!", "success");
      router.refresh();
    } catch (err) {
      toast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Profile</h3>
        <p className="text-[#64748B] text-sm mt-1">Manage your public profile and personal information.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-6 pb-6 border-b border-[#E5E7EB]">
            <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden shrink-0">
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-emerald-600" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Profile Photo</h4>
              <p className="text-xs text-[#64748B] mt-1 mb-3">We recommend a 300x300px image.</p>
              <div className="flex gap-3">
                <button type="button" className="text-xs font-bold bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                  Change
                </button>
                <button type="button" className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0F172A]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0F172A]">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-100 border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm text-[#64748B] cursor-not-allowed shadow-sm"
              />
              <p className="text-xs text-slate-500">Email is read-only for OAuth accounts.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0F172A]">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0F172A]">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shadow-sm"
              >
                <option value="">Select level...</option>
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (3-5 years)</option>
                <option value="Senior Level">Senior Level (5-8 years)</option>
                <option value="Lead/Manager">Lead / Manager (8+ years)</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-[#0F172A]">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-[#0F172A]">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us a little bit about yourself..."
                className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors shadow-sm resize-none"
              />
              <p className="text-xs text-[#64748B]">Brief description for your profile. URLs are hyperlinked.</p>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
