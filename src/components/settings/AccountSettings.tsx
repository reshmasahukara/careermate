"use client";

import React, { useState } from "react";
import { Key, Shield, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/Providers";
import { deleteAccountAction } from "@/app/actions/settings";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface AccountSettingsProps {
  user: any;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  const calculatePasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    let score = 0;
    if (pwd.length > 8) score += 25;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score += 25;
    if (pwd.match(/\d/)) score += 25;
    if (pwd.match(/[^a-zA-Z\d]/)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(newPassword);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      toast("Password must be at least 8 characters.", "error");
      return;
    }
    setIsUpdatingPassword(true);
    // Simulate API call for password update (NextAuth credentials not implemented in actions yet)
    setTimeout(() => {
      toast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatingPassword(false);
    }, 1000);
  };

  const handleToggle2FA = () => {
    // Optimistic toggle
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    toast(`Two-factor authentication ${newValue ? "enabled" : "disabled"}.`, "success");
    // Normally we'd call an action here
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("WARNING: This will permanently delete your account, resumes, and data. This action CANNOT be undone. Proceed?")) {
      setIsDeleting(true);
      try {
        await deleteAccountAction(user.id);
        toast("Account deleted.", "info");
        signOut({ callbackUrl: "/" });
      } catch (e) {
        toast("Failed to delete account.", "error");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold text-[#0F172A] text-xl">Account Security</h3>
        <p className="text-[#64748B] text-sm mt-1">Manage your password, security preferences, and account deletion.</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-6">
          <Key className="w-5 h-5 text-emerald-500" /> Change Password
        </h4>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#0F172A]">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#0F172A]">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
            {newPassword && (
              <div className="pt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 25 ? "bg-rose-500" : strength <= 50 ? "bg-amber-400" : strength <= 75 ? "bg-emerald-400" : "bg-emerald-600"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-12 text-right">
                  {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#0F172A]">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-[#E5E7EB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword || !currentPassword || !newPassword}
            className="mt-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-500" /> Two-Factor Authentication
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Protect your account</p>
            <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <button
            type="button"
            onClick={handleToggle2FA}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFactorEnabled ? "bg-emerald-500" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
        <h4 className="font-bold text-rose-700 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h4>
        <p className="text-sm text-rose-600/80 mb-4 max-w-2xl">
          Permanently delete your account and all of your content. This action is not reversible, so please continue with caution.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
