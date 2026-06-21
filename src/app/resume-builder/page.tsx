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
  User,
  Briefcase,
  GraduationCap,
  Wrench
} from "lucide-react";
import { useToast } from "@/components/Providers";

type TemplateConfig = {
  id: string;
  name: string;
  desc: string;
  font: string;
  headerAlign: "left" | "center" | "right";
  nameColor: string;
  nameSize: string;
  jobTitleColor: string;
  headerBg: string;
  headerBorder: string;
  sectionTitleAlign: "left" | "center" | "right";
  sectionTitleColor: string;
  sectionTitleBorder: string;
  skillBullet: string;
  companyColor: string;
};

const templates: TemplateConfig[] = [
  { id: "modern", name: "Modern Executive", desc: "Emerald Accent", font: "font-sans", headerAlign: "left", nameColor: "text-emerald-600", nameSize: "text-3xl font-black", jobTitleColor: "text-slate-700", headerBg: "bg-transparent", headerBorder: "border-b border-emerald-500/20", sectionTitleAlign: "left", sectionTitleColor: "text-emerald-600", sectionTitleBorder: "border-b border-emerald-100", skillBullet: "bg-emerald-500", companyColor: "text-emerald-600" },
  { id: "classic", name: "Classic Scholar", desc: "Monochrome Serif", font: "font-serif", headerAlign: "center", nameColor: "text-slate-900", nameSize: "text-4xl font-bold", jobTitleColor: "text-slate-600", headerBg: "bg-transparent", headerBorder: "border-b border-slate-300", sectionTitleAlign: "center", sectionTitleColor: "text-slate-900", sectionTitleBorder: "border-b border-slate-200", skillBullet: "none", companyColor: "text-slate-900" },
  { id: "minimal", name: "Minimalist Developer", desc: "Clean Sans-Serif", font: "font-sans", headerAlign: "left", nameColor: "text-slate-900", nameSize: "text-2xl tracking-tighter font-semibold", jobTitleColor: "text-slate-500", headerBg: "bg-transparent", headerBorder: "border-b-2 border-slate-900", sectionTitleAlign: "left", sectionTitleColor: "text-slate-900", sectionTitleBorder: "border-none", skillBullet: "none", companyColor: "text-slate-900" },
  { id: "creative", name: "Creative Director", desc: "Vibrant & Bold", font: "font-sans", headerAlign: "left", nameColor: "text-fuchsia-600", nameSize: "text-4xl font-black", jobTitleColor: "text-fuchsia-500", headerBg: "bg-fuchsia-50", headerBorder: "border-none", sectionTitleAlign: "left", sectionTitleColor: "text-fuchsia-600", sectionTitleBorder: "border-b-4 border-fuchsia-100", skillBullet: "bg-fuchsia-500", companyColor: "text-fuchsia-600" },
  { id: "corporate", name: "Corporate Leader", desc: "Navy Blue", font: "font-serif", headerAlign: "center", nameColor: "text-blue-900", nameSize: "text-3xl font-bold", jobTitleColor: "text-blue-700", headerBg: "bg-transparent", headerBorder: "border-b-2 border-blue-900", sectionTitleAlign: "left", sectionTitleColor: "text-blue-900", sectionTitleBorder: "border-b border-blue-200", skillBullet: "bg-blue-900", companyColor: "text-blue-900" },
  { id: "startup", name: "Startup Innovator", desc: "Indigo Modern", font: "font-sans", headerAlign: "left", nameColor: "text-indigo-600", nameSize: "text-3xl font-bold", jobTitleColor: "text-indigo-500", headerBg: "bg-indigo-50/50", headerBorder: "border-b border-indigo-200", sectionTitleAlign: "left", sectionTitleColor: "text-indigo-600", sectionTitleBorder: "border-l-4 border-indigo-500 pl-2", skillBullet: "bg-indigo-500", companyColor: "text-indigo-600" },
  { id: "data", name: "Data Scientist", desc: "Teal Analytical", font: "font-mono", headerAlign: "left", nameColor: "text-teal-700", nameSize: "text-2xl font-bold", jobTitleColor: "text-teal-600", headerBg: "bg-transparent", headerBorder: "border-b border-dashed border-teal-300", sectionTitleAlign: "left", sectionTitleColor: "text-teal-700", sectionTitleBorder: "border-b border-dashed border-teal-200", skillBullet: "bg-teal-500", companyColor: "text-teal-700" },
  { id: "finance", name: "Finance Pro", desc: "Slate Conservative", font: "font-serif", headerAlign: "left", nameColor: "text-slate-800", nameSize: "text-3xl font-bold", jobTitleColor: "text-slate-600", headerBg: "bg-transparent", headerBorder: "border-b border-slate-400", sectionTitleAlign: "left", sectionTitleColor: "text-slate-800", sectionTitleBorder: "border-b border-slate-300", skillBullet: "bg-slate-400", companyColor: "text-slate-800" },
  { id: "marketing", name: "Marketing Expert", desc: "Pink Accent", font: "font-sans", headerAlign: "center", nameColor: "text-pink-600", nameSize: "text-4xl font-light", jobTitleColor: "text-pink-500", headerBg: "bg-transparent", headerBorder: "border-none", sectionTitleAlign: "center", sectionTitleColor: "text-pink-600", sectionTitleBorder: "border-b border-pink-200", skillBullet: "bg-pink-500", companyColor: "text-pink-600" },
  { id: "healthcare", name: "Healthcare Expert", desc: "Cyan Clean", font: "font-sans", headerAlign: "left", nameColor: "text-cyan-700", nameSize: "text-3xl font-bold", jobTitleColor: "text-cyan-600", headerBg: "bg-cyan-50/50", headerBorder: "border-b border-cyan-200", sectionTitleAlign: "left", sectionTitleColor: "text-cyan-700", sectionTitleBorder: "border-b-2 border-cyan-100", skillBullet: "bg-cyan-500", companyColor: "text-cyan-700" },
  { id: "legal", name: "Legal Counsel", desc: "Crimson Serif", font: "font-serif", headerAlign: "center", nameColor: "text-rose-900", nameSize: "text-3xl font-bold", jobTitleColor: "text-rose-800", headerBg: "bg-transparent", headerBorder: "border-b-4 border-double border-rose-900", sectionTitleAlign: "center", sectionTitleColor: "text-rose-900", sectionTitleBorder: "border-b border-rose-200", skillBullet: "none", companyColor: "text-rose-900" },
  { id: "academic", name: "Academic Researcher", desc: "Classic Dense", font: "font-serif", headerAlign: "center", nameColor: "text-black", nameSize: "text-2xl font-bold uppercase", jobTitleColor: "text-slate-700", headerBg: "bg-transparent", headerBorder: "border-b border-black", sectionTitleAlign: "left", sectionTitleColor: "text-black uppercase", sectionTitleBorder: "border-b border-black", skillBullet: "none", companyColor: "text-black" },
  { id: "pm", name: "Product Manager", desc: "Violet Blocks", font: "font-sans", headerAlign: "left", nameColor: "text-violet-700", nameSize: "text-4xl tracking-tight font-bold", jobTitleColor: "text-violet-600", headerBg: "bg-transparent", headerBorder: "border-b border-violet-200", sectionTitleAlign: "left", sectionTitleColor: "text-violet-700 bg-violet-50 px-2 py-1 inline-block", sectionTitleBorder: "border-none", skillBullet: "bg-violet-500", companyColor: "text-violet-700" },
  { id: "sales", name: "Sales Executive", desc: "Orange Dynamic", font: "font-sans", headerAlign: "right", nameColor: "text-orange-600", nameSize: "text-3xl italic font-bold", jobTitleColor: "text-orange-500", headerBg: "bg-transparent", headerBorder: "border-b border-orange-200", sectionTitleAlign: "right", sectionTitleColor: "text-orange-600", sectionTitleBorder: "border-b border-orange-200", skillBullet: "bg-orange-500", companyColor: "text-orange-600" },
  { id: "visionary", name: "Bold Visionary", desc: "Dark Mode Header", font: "font-sans", headerAlign: "left", nameColor: "text-white", nameSize: "text-3xl font-black", jobTitleColor: "text-slate-300", headerBg: "bg-slate-900", headerBorder: "border-none", sectionTitleAlign: "left", sectionTitleColor: "text-slate-900", sectionTitleBorder: "border-b-4 border-slate-900", skillBullet: "bg-slate-900", companyColor: "text-slate-900" },
];

export default function ResumeBuilderPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("modern");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

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
      // Trigger native print dialog which can be saved to PDF
      window.print();
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Resume Builder</h1>
            <p className="text-sm text-[#64748B]">Build a premium, optimized resume using our live editor.</p>
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
              {isExporting ? "Preparing..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Templates Selector */}
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-[16px] shadow-sm space-y-3 print:hidden">
          <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block">Select Style Template (15 Options)</span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`min-w-[160px] px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col shrink-0 ${
                  selectedTemplateId === tpl.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-[#E5E7EB] hover:border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                <span>{tpl.name}</span>
                <span className={`text-[10px] font-medium mt-0.5 ${selectedTemplateId === tpl.id ? "text-emerald-600/80" : "text-slate-400"}`}>
                  {tpl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Split View */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start print:block">
          
          {/* Left Panel: Form Editor */}
          <div className="xl:col-span-6 bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm overflow-hidden print:hidden">
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
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Target Job Title</label>
                    <input
                      type="text"
                      value={resumeData.jobTitle}
                      onChange={e => handleUpdateField("jobTitle", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={e => handleUpdateField("email", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={e => handleUpdateField("phone", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={e => handleUpdateField("location", e.target.value)}
                      className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
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
                  className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white h-24 resize-none transition-colors"
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
                    className="flex-1 bg-slate-50 border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
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
          <div className={`xl:col-span-6 bg-slate-100 p-6 rounded-[20px] border border-[#E5E7EB] print:col-span-12 print:border-none print:p-0 print:bg-white ${activeTab === "preview" ? "block" : "hidden xl:block"}`}>
            
            {/* Paper Sheet Preview container - strictly respects selectedTemplate constraints */}
            <div className={`w-full min-h-[750px] bg-white shadow-lg print:shadow-none p-8 sm:p-12 border border-slate-200/50 rounded-xl print:border-none print:rounded-none leading-relaxed text-slate-800 transition-all duration-300 ${selectedTemplate.font}`}>
              
              {/* Header block */}
              <div className={`${selectedTemplate.headerBg} ${selectedTemplate.headerBorder} pb-6 ${selectedTemplate.headerBg !== 'bg-transparent' ? 'p-6 -mt-12 -mx-12 rounded-t-xl mb-6' : ''}`}>
                <div className={`flex flex-col justify-between gap-4 ${
                  selectedTemplate.headerAlign === "center" ? "items-center text-center" : 
                  selectedTemplate.headerAlign === "right" ? "items-end text-right" : "items-start text-left"
                }`}>
                  <div>
                    <h2 className={`tracking-tight ${selectedTemplate.nameColor} ${selectedTemplate.nameSize}`}>
                      {resumeData.fullName}
                    </h2>
                    <p className={`text-sm font-bold uppercase tracking-wider mt-1.5 ${selectedTemplate.jobTitleColor}`}>
                      {resumeData.jobTitle}
                    </p>
                  </div>
                  <div className={`text-[11px] font-semibold text-slate-500 space-x-3 flex flex-wrap ${
                    selectedTemplate.headerAlign === "center" ? "justify-center" : 
                    selectedTemplate.headerAlign === "right" ? "justify-end" : "justify-start"
                  }`}>
                    {resumeData.email && <span>{resumeData.email}</span>}
                    {resumeData.phone && <span>• {resumeData.phone}</span>}
                    {resumeData.location && <span>• {resumeData.location}</span>}
                  </div>
                </div>
              </div>

              {/* Summary Block */}
              {resumeData.summary && (
                <div className="py-6">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${selectedTemplate.sectionTitleColor} ${selectedTemplate.sectionTitleBorder} pb-1 ${
                    selectedTemplate.sectionTitleAlign === "center" ? "text-center mx-auto" : 
                    selectedTemplate.sectionTitleAlign === "right" ? "text-right ml-auto" : "text-left"
                  }`}>Professional Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mt-3">{resumeData.summary}</p>
                </div>
              )}

              {/* Work Experience list */}
              {resumeData.experience.length > 0 && (
                <div className="py-6">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${selectedTemplate.sectionTitleColor} ${selectedTemplate.sectionTitleBorder} pb-1 ${
                    selectedTemplate.sectionTitleAlign === "center" ? "text-center mx-auto" : 
                    selectedTemplate.sectionTitleAlign === "right" ? "text-right ml-auto" : "text-left"
                  }`}>Work Experience</h4>
                  <div className="space-y-6 mt-3">
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} className="space-y-1.5">
                        <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                          <span>{exp.role} @ <span className={selectedTemplate.companyColor}>{exp.company}</span></span>
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
                <div className="py-6">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${selectedTemplate.sectionTitleColor} ${selectedTemplate.sectionTitleBorder} pb-1 ${
                    selectedTemplate.sectionTitleAlign === "center" ? "text-center mx-auto" : 
                    selectedTemplate.sectionTitleAlign === "right" ? "text-right ml-auto" : "text-left"
                  }`}>Skills & Expertise</h4>
                  <div className={`flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-700 mt-3 ${
                    selectedTemplate.sectionTitleAlign === "center" ? "justify-center" : 
                    selectedTemplate.sectionTitleAlign === "right" ? "justify-end" : "justify-start"
                  }`}>
                    {resumeData.skills.map((skill, i) => (
                      <span key={skill} className="flex items-center gap-1.5">
                        {selectedTemplate.skillBullet !== "none" && (
                          <span className={`w-1.5 h-1.5 rounded-sm ${selectedTemplate.skillBullet}`} />
                        )}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education section */}
              {resumeData.education.length > 0 && (
                <div className="py-6">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${selectedTemplate.sectionTitleColor} ${selectedTemplate.sectionTitleBorder} pb-1 ${
                    selectedTemplate.sectionTitleAlign === "center" ? "text-center mx-auto" : 
                    selectedTemplate.sectionTitleAlign === "right" ? "text-right ml-auto" : "text-left"
                  }`}>Education</h4>
                  <div className="mt-3">
                    {resumeData.education.map(edu => (
                      <div key={edu.id} className="flex justify-between items-start text-xs font-bold text-slate-800 mb-2">
                        <span>{edu.degree} — <span className="text-slate-600 font-semibold">{edu.school}</span></span>
                        <span className="text-slate-500 font-semibold">{edu.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
