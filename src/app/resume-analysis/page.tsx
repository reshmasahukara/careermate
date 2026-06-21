"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Clock,
  ChevronDown,
  BarChart,
  BookOpen,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/components/Providers";
import {
  processResumeUploadAction,
  getResumesAction,
  deleteResumeAction
} from "@/app/actions/resume";
import DashboardLayout from "@/components/DashboardLayout";

export default function ResumeAnalysisPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unified States
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  // Upload States
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Load history on mount
  const loadHistory = async () => {
    setIsLoadingResumes(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const userResumes = await getResumesAction(userId);
      setResumes(userResumes);
      if (userResumes.length > 0) {
        setSelectedResumeId(userResumes[0].id);
      }
    } catch (e) {
      console.error("Error loading resumes:", e);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session]);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setUploadError(null);
    const validMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const isDocx = selectedFile.name.endsWith(".docx");
    const isPdf = selectedFile.name.endsWith(".pdf");

    if (!validMimes.includes(selectedFile.type) && !isDocx && !isPdf) {
      toast("Invalid format. Please select PDF or DOCX.", "error");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast("File exceeds 5MB limit.", "error");
      return;
    }

    setFile(selectedFile);
  };

  // Upload Submission Action
  const handleUploadSubmit = async () => {
    if (!file || !session?.user) return;
    if (!targetRole.trim()) {
      toast("Please enter your Target Role first.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Simulated progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const userId = (session?.user as any)?.id || "demo-user-123";
      const formData = new FormData();
      formData.append("file", file);

      const newResume = await processResumeUploadAction(userId, formData, targetRole);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(async () => {
        setIsUploading(false);
        setFile(null);
        setTargetRole("");
        toast("Resume uploaded and parsed successfully!", "success");
        await loadHistory();
        setSelectedResumeId(newResume.id);
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadError(err.message || "An error occurred during file parsing.");
      toast("File upload failed.", "error");
    }
  };

  // Delete Action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume version?")) {
      const success = await deleteResumeAction(id);
      if (success) {
        const filtered = resumes.filter((r) => r.id !== id);
        setResumes(filtered);
        toast("Resume copy deleted successfully.", "success");
        if (selectedResumeId === id) {
          setSelectedResumeId(filtered.length > 0 ? filtered[0].id : "");
        }
      } else {
        toast("Failed to delete copy.", "error");
      }
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
          <p className="text-sm font-semibold text-[#64748B]">Loading workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  const selectedResume = resumes.find(r => r.id === selectedResumeId);
  const insights = selectedResume?.qualitativeAnalysis;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-[#E5E7EB] pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Resume Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">Resume Analyzer</h1>
          <p className="text-sm text-[#64748B] font-semibold mt-1">
            Receive AI-powered feedback on your resume structure, strengths, and missing keywords.
          </p>
        </div>

        {/* Unified Setup Section: Upload Card & selection Dropdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card A: Drag & Drop Upload (col 5) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider">Upload & Analyze</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  disabled={isUploading}
                  className="w-full border border-[#E5E7EB] bg-slate-50 text-sm font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Uploader Box */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[16px] p-6 text-center transition-all duration-200 min-h-[160px] flex flex-col items-center justify-center cursor-pointer ${
                  isDragActive
                    ? "border-[#10B981] bg-[#10B981]/5 scale-[0.99]"
                    : "border-[#E5E7EB] bg-slate-50 hover:bg-slate-100/60 hover:border-slate-300"
                } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="w-full space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#10B981] mx-auto" />
                    <div>
                      <h4 className="font-bold text-xs text-[#0F172A]">AI is analyzing your resume...</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-[#64748B]">
                        <span>Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white border border-[#E5E7EB] rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  </div>
                ) : file ? (
                  <div className="space-y-3.5 w-full">
                    <FileText className="w-8 h-8 text-[#10B981] mx-auto" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#0F172A] truncate max-w-[200px] mx-auto">{file.name}</h4>
                      <p className="text-[10px] text-[#64748B] mt-0.5 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="px-3 py-1.5 border border-[#E5E7EB] hover:bg-slate-50 text-slate-500 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleUploadSubmit(); }}
                        className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Analyze Resume
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-slate-400 mx-auto">
                      <Upload className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Drag and drop resume here</h4>
                      <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">Accepts PDF or DOCX format</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[11px] font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Card B: Select Version */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm flex flex-col justify-start space-y-6">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider mb-2">History</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Review qualitative AI insights for resumes you have uploaded previously. Select a copy below to see its analysis.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Active Copy
              </label>
              {isLoadingResumes ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
              ) : resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.fileName} (Target: {res.targetRole || "Unknown"})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs font-semibold">
                  No resume copies uploaded yet.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Qualitative Insights Sections */}
        {!selectedResume ? (
           <div className="text-center py-16 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm flex flex-col items-center gap-3 animate-in fade-in">
             <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-[#10B981]">
               <Sparkles className="w-6 h-6" />
             </div>
             <div className="space-y-1.5 max-w-sm">
               <h3 className="font-extrabold text-slate-800 text-base">No Data to Display</h3>
               <p className="text-slate-500 text-xs font-semibold leading-relaxed">Upload your resume to receive AI-powered feedback and improvement suggestions.</p>
             </div>
           </div>
        ) : !insights ? (
           <div className="text-center py-16 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm flex flex-col items-center gap-3 animate-in fade-in">
             <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
               <AlertTriangle className="w-6 h-6" />
             </div>
             <div className="space-y-1.5 max-w-sm">
               <h3 className="font-extrabold text-slate-800 text-base">Insights Not Available</h3>
               <p className="text-slate-500 text-xs font-semibold leading-relaxed">This older resume copy does not have qualitative AI insights. Please re-upload it to generate the latest analysis.</p>
             </div>
           </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* 1. Resume Summary */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Resume Summary
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {insights.summary}
              </p>
            </div>

            {/* 2 & 3. Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
                <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strengths
                </h2>
                <ul className="space-y-3">
                  {insights.strengths?.map((str: string, i: number) => (
                     <li key={i} className="flex items-start gap-2.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
                       <span className="text-xs text-slate-600 font-medium leading-relaxed">{str}</span>
                     </li>
                  ))}
                  {(!insights.strengths || insights.strengths.length === 0) && (
                    <li className="text-xs text-slate-400 italic">No specific strengths detected.</li>
                  )}
                </ul>
              </div>

              <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
                <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Improvement Areas
                </h2>
                <ul className="space-y-3">
                  {insights.improvementAreas?.map((imp: string, i: number) => (
                     <li key={i} className="flex items-start gap-2.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                       <span className="text-xs text-slate-600 font-medium leading-relaxed">{imp}</span>
                     </li>
                  ))}
                  {(!insights.improvementAreas || insights.improvementAreas.length === 0) && (
                    <li className="text-xs text-slate-400 italic">No major improvement areas detected.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 4. Missing Keywords */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Missing Target Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {insights.missingKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-100">
                    {kw}
                  </span>
                ))}
                {(!insights.missingKeywords || insights.missingKeywords.length === 0) && (
                   <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                     Looks like your resume is well-tailored with target keywords!
                   </span>
                )}
              </div>
            </div>

            {/* 5. Actionable Recommendations */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable Recommendations
              </h2>
              <div className="grid gap-3">
                {insights.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Section Completeness */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm">
              <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Section Completeness
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(insights.sectionCompleteness || {}).map(([sectionName, status]) => {
                  let icon = <AlertCircle className="w-4 h-4 text-amber-500" />;
                  let bg = "bg-amber-50 border-amber-100 text-amber-700";
                  
                  if (status === "Complete") {
                    icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
                    bg = "bg-emerald-50 border-emerald-100 text-emerald-700";
                  } else if (status === "Missing") {
                    icon = <XCircle className="w-4 h-4 text-rose-500" />;
                    bg = "bg-rose-50 border-rose-100 text-rose-700";
                  }

                  return (
                    <div key={sectionName} className={`p-3 rounded-xl border flex items-center justify-between ${bg}`}>
                      <span className="text-[11px] font-bold">{sectionName}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
