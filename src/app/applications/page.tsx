"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/Providers";
import { Briefcase, Building, Calendar, Edit3, Trash2, Plus, ExternalLink, Activity } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: any = {
  "Applied": "bg-blue-50 text-blue-700 border-blue-200",
  "Interviewing": "bg-amber-50 text-amber-700 border-amber-200",
  "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
  "Offer Received": "bg-emerald-50 text-emerald-700 border-emerald-200"
};

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const userId = session?.user ? (session.user as any).id : null;

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    status: "Applied"
  });

  const fetchApplications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/applications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error(err);
      toast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchApplications();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [userId, status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    try {
      if (editingApp) {
        // Update status only via PATCH for now (or could add full update)
        const res = await fetch(`/api/applications`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingApp.id, status: formData.status })
        });
        if (res.ok) {
          toast("Application updated!", "success");
        } else {
          throw new Error("Failed to update");
        }
      } else {
        // Create new
        const res = await fetch(`/api/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId })
        });
        if (res.ok) {
          toast("Application added!", "success");
        } else {
          throw new Error("Failed to create");
        }
      }
      setIsModalOpen(false);
      setEditingApp(null);
      setFormData({ title: "", company: "", status: "Applied" });
      fetchApplications();
    } catch (err) {
      toast("Something went wrong", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Deleted successfully", "success");
        fetchApplications();
      }
    } catch (err) {
      toast("Failed to delete", "error");
    }
  };

  const openAddModal = () => {
    setEditingApp(null);
    setFormData({ title: "", company: "", status: "Applied" });
    setIsModalOpen(true);
  };

  const openEditModal = (app: any) => {
    setEditingApp(app);
    setFormData({ title: app.title, company: app.company, status: app.status });
    setIsModalOpen(true);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your applications</h2>
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">Go to Login</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Activity className="w-8 h-8 text-emerald-500" />
              Application Tracker
            </h1>
            <p className="text-slate-500 font-semibold mt-1">Manage and track your job applications all in one place.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-2.5 px-5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
              <Briefcase className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-[#0F172A] mb-2">No applications tracked yet</h3>
            <p className="text-slate-500 font-semibold mb-6 max-w-sm">
              Keep your job search organized. Track roles you've applied to and monitor their status.
            </p>
            <button onClick={openAddModal} className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all">
              Track Your First Job
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Role & Company</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-[#0F172A]">{app.title}</span>
                          <span className="text-sm font-semibold text-slate-500 flex items-center gap-1 mt-1">
                            <Building className="w-3.5 h-3.5" /> {app.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider inline-block ${STATUS_COLORS[app.status] || STATUS_COLORS["Applied"]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.job && app.job.applyUrl && (
                            <a href={app.job.applyUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="View Job Listing">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => openEditModal(app)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(app.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0F172A]">{editingApp ? "Update Application" : "Track New Application"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <ExternalLink className="w-5 h-5 rotate-45" /> {/* Close icon trick or use X */}
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Frontend Developer"
                  required
                  disabled={!!editingApp} // If editing, we only update status right now based on logic
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Company</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Google"
                  required
                  disabled={!!editingApp}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer Received">Offer Received</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 text-sm font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  {editingApp ? "Save Changes" : "Track Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
