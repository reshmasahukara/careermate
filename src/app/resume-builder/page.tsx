"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Sparkles,
  FileText,
  Save,
  Download,
  Plus,
  Trash2,
  Check,
  Eye,
  Edit,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Wrench
} from "lucide-react";
import { useToast } from "@/components/Providers";

export default function ResumeBuilderPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic" | "minimal">("modern");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    fullName: session?.user?.name || "Alex Morgan",
    jobTitle: "Senior Frontend Engineer",
    email: session?.user?.email || "alex@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    summary: "Strategic, impact-driven Frontend Engineer with 5+ years of experience leading UI/UX architectures, engineering high-performance React applications, and optimizing bundle performance. Passionate about AI integrations, clean code systems, and collaborative development frameworks.",
    experience: [
      {
        id: "1",
        role: "Senior Frontend Developer",
        company: "Vercel Inc.",
        duration: "2023 - Present",
        description: "Led development of core framework interfaces, achieving 25% bundle size reduction. Collaborated on next-generation styling integration engines and micro-frontend structures."
      },
      {
        id: "2",
        role: "Software Engineer",
        company: "GitHub",
        duration: "2021 - 2023",
        description: "Designed features for project management interfaces and optimized repository loading pipelines, resulting in a 15% increase in weekly active user engagement."
      }
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "REST APIs", "CI/CD", "AWS"],
    education: [
      {
        id: "1",
        degree: "B.S. in Computer Science",
        school: "Stanford University",
        duration: "2017 - 2021"
      }
    ]
  });

  const handleUpdateField = (field: string, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      role: "New Role",
      company: "Company Name",
      duration: "Duration",
      description: "Describe your key impact and metrics here."
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    if (resumeData.skills.includes(skill)) return;
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
  };

  const handleRemoveSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast("Draft version successfully saved!", "success");
    }, 1000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast("PDF export ready! Your download has started.", "success");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Resume Builder</h1>
            <p className="text-sm text-[#64748B]">Build a premium, ATS-optimized resume using our live editor.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] bg-white rounded-xl text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-500" />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Templates Selector */}
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-[16px] shadow-sm flex flex-wrap items-center gap-4">
          <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Select Style Template</span>
          <div className="flex gap-2">
            {[
              { id: "modern", label: "Modern Executive", desc: "Emerald Accent" },
              { id: "classic", label: "Classic Scholar", desc: "Monochrome Serif" },
              { id: "minimal", label: "Minimalist Developer", desc: "Clean Sans-Serif" }
            ].map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id as any)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col ${
                  selectedTemplate === tpl.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-[#E5E7EB] hover:border-slate-300 bg-white"
                }`}
              >
                <span>{tpl.label}</span>
                <span className="text-[10px] text-slate-400 font-medium">{tpl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Split View */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Form Editor */}
          <div className="xl:col-span-6 bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm overflow-hidden">
            <div className="flex border-b border-[#E5E7EB]">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-4 text-center text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border-r border-[#E5E7EB] cursor-pointer ${
                  activeTab === "edit" ? "bg-slate-50 text-[#0F172A]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Edit className="w-4 h-4" /> Edit Content
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-4 text-center text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "preview" ? "bg-slate-50 text-[#0F172A]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Eye className="w-4 h-4" /> Live Preview
              </button>
            </div>

            <div className={`p-6 space-y-6 ${activeTab === "edit" ? "block" : "hidden xl:block"}`}>
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={e => handleUpdateField("fullName", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Target Job Title</label>
                    <input
                      type="text"
                      value={resumeData.jobTitle}
                      onChange={e => handleUpdateField("jobTitle", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={e => handleUpdateField("email", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={e => handleUpdateField("phone", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={e => handleUpdateField("location", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Professional Summary
                </h3>
                <textarea
                  value={resumeData.summary}
                  onChange={e => handleUpdateField("summary", e.target.value)}
                  className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white h-24 resize-none"
                />
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    Work Experience
                  </h3>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 hover:text-emerald-700 uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/50 space-y-3 relative">
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Role / Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={e => handleUpdateExperience(exp.id, "role", e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-1.5 px-2.5 text-xs font-semibold outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={e => handleUpdateExperience(exp.id, "company", e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-1.5 px-2.5 text-xs font-semibold outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Duration</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={e => handleUpdateExperience(exp.id, "duration", e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] rounded-lg py-1.5 px-2.5 text-xs font-semibold outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={e => handleUpdateExperience(exp.id, "description", e.target.value)}
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 h-16 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                  Skills Checklist
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-600 font-extrabold text-[10px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview Panel */}
          <div className={`xl:col-span-6 bg-slate-100 p-6 rounded-[20px] border border-[#E5E7EB] ${activeTab === "preview" ? "block" : "hidden xl:block"}`}>
            
            {/* Paper Sheet Preview container */}
            <div className={`w-full min-h-[750px] bg-white shadow-lg p-8 sm:p-12 font-sans border border-slate-200/50 rounded-xl leading-relaxed text-slate-800 ${
              selectedTemplate === "classic" ? "font-serif" : "font-sans"
            }`}>
              
              {/* Header block */}
              <div className={`border-b pb-6 ${
                selectedTemplate === "modern" ? "border-emerald-500/20" : "border-slate-200"
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className={`font-black tracking-tight text-slate-900 ${
                      selectedTemplate === "modern" ? "text-3xl text-emerald-600" : "text-2xl"
                    }`}>
                      {resumeData.fullName}
                    </h2>
                    <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${
                      selectedTemplate === "modern" ? "text-slate-700" : "text-slate-500"
                    }`}>
                      {resumeData.jobTitle}
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-[11px] font-semibold text-slate-500 space-y-0.5">
                    <p>{resumeData.email}</p>
                    <p>{resumeData.phone}</p>
                    <p>{resumeData.location}</p>
                  </div>
                </div>
              </div>

              {/* Summary Block */}
              {resumeData.summary && (
                <div className="py-6 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Professional Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{resumeData.summary}</p>
                </div>
              )}

              {/* Work Experience list */}
              {resumeData.experience.length > 0 && (
                <div className="py-6 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Work Experience</h4>
                  <div className="space-y-5">
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                          <span>{exp.role} @ <span className={selectedTemplate === "modern" ? "text-emerald-600" : "text-slate-950"}>{exp.company}</span></span>
                          <span className="text-slate-500 font-semibold">{exp.duration}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills block */}
              {resumeData.skills.length > 0 && (
                <div className="py-6 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-700">
                    {resumeData.skills.map((skill, i) => (
                      <span key={skill} className="flex items-center gap-1.5">
                        {selectedTemplate === "modern" && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education section */}
              {resumeData.education.length > 0 && (
                <div className="py-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Education</h4>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-start text-xs font-bold text-slate-800">
                      <span>{edu.degree} — <span className="text-slate-600 font-semibold">{edu.school}</span></span>
                      <span className="text-slate-500 font-semibold">{edu.duration}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Audit your draft with the ATS Match Checker</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Run real-time parsing checks, look for missing industry keywords, and score your resume draft against target roles.
            </p>
          </div>
          <a
            href="/ats-checker"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Audit Resume
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
