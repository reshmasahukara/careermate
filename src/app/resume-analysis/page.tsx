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
  BookOpen
} from "lucide-react";
import { useToast } from "@/components/Providers";
import {
  processResumeUploadAction,
  getResumesAction,
  deleteResumeAction,
  generateResumeAuditAction
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string | null>("experience");

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

      const newResume = await processResumeUploadAction(userId, formData);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(async () => {
        setIsUploading(false);
        setFile(null);
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
          setAnalysisResult(null);
        }
      } else {
        toast("Failed to delete copy.", "error");
      }
    }
  };

  // Audit evaluation mock logic
  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      toast("Please select a resume version to analyze.", "warning");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const dynamicAnalysis = await generateResumeAuditAction(selectedResumeId);
      setAnalysisResult(dynamicAnalysis);
      toast("Detailed section analysis complete!", "success");
    } catch (error) {
      console.error("Audit error:", error);
      toast("Failed to run AI audit.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
          <p className="text-sm font-semibold text-[#64748B]">Loading analysis...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            Upload new resume copies, audit formatting sections, swap passive verbs, and verify keywords structure.
          </p>
        </div>

        {/* Unified Setup Section: Upload Card & selection Dropdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card A: Drag & Drop Upload (col 5) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider">Upload New Version</h3>
                {!isUploading && !file && (
                  <button
                    type="button"
                    id="load-test-resume-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const testContent = `
                      Alex Morgan
                      alex@example.com | 123-456-7890
                      Professional Summary
                      Experienced Senior React Developer with 6+ years of building web applications.
                      Skills
                      React, Node.js, TypeScript, Next.js, Tailwind CSS, PostgreSQL, AWS, Git, Docker, CI/CD, Agile.
                      Experience
                      Senior Software Engineer - Tech Corp (2020 - Present)
                      - Developed key frontend features using React and TypeScript.
                      - Managed AWS deployments and Docker containers.
                      Education
                      Bachelor of Science in Computer Science - University of State (2016 - 2020)
                      `;
                      const mockFile = new File([testContent], "test_resume.docx", {
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      });
                      setFile(mockFile);
                      toast("Loaded test resume copy!", "success");
                    }}
                    className="text-[10px] font-bold text-[#10B981] hover:underline cursor-pointer"
                  >
                    Load Test Resume
                  </button>
                )}
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
                      <h4 className="font-bold text-xs text-[#0F172A]">Parsing and storing copy...</h4>
                      <p className="text-[9px] text-[#64748B] font-bold mt-0.5 uppercase">Unified Text Extractor</p>
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
                        Parse Resume
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
                      <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">Or click to search folders manually.</p>
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

          {/* Card B: Select Version & Audit (col 7) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider mb-2">Section Audit Setup</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Choose a parsed resume copy from your history and click to execute an AI Audit. It will critique formatting styles, highlight passive action verbs, and detail structural updates.
              </p>
            </div>

            <div className="space-y-4">
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
                    className="w-full bg-slate-50 border border-[#E5E7EB] rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  >
                    {resumes.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.fileName} (v{res.version})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs font-semibold">
                    No resume copies uploaded. Drag and drop a file in the uploader to register your first version!
                  </div>
                )}
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || resumes.length === 0}
                className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    Running AI Section Audit...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Run AI Section Audit
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Audit Report Results (if generated) */}
        {analysisResult ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Top Score Summary */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-[20px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-[#0F172A] uppercase tracking-wider">Overall Structure Score</h2>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Audit Complete
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#6366F1] flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                <span className="text-3xl font-black">{analysisResult.score}</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-80">Structure</span>
              </div>
            </div>

            {/* Key Action Priorities */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Priority Corrections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResult.priorityChanges.map((change: any) => (
                  <div
                    key={change.code}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      change.level.includes("High")
                        ? "bg-rose-50 border-rose-100 text-rose-800"
                        : change.level.includes("Medium")
                        ? "bg-amber-50 border-amber-100 text-amber-800"
                        : "bg-emerald-50 border-emerald-100 text-emerald-800"
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                        {change.level}
                      </span>
                      <p className="text-xs mt-1 leading-relaxed font-semibold">
                        {change.text}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-4 block self-end">
                      {change.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordion Section Critique Lists */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Detailed Section Audits</h3>
              
              <div className="space-y-3">
                {analysisResult.sections.map((section: any) => {
                  const isOpen = openSection === section.id;
                  return (
                    <div key={section.id} className="border border-[#E5E7EB] rounded-[20px] overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.id)}
                        className="w-full flex justify-between items-center p-5 font-bold text-slate-800 text-left focus:outline-none cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 text-xs sm:text-sm">
                          <span className={`w-2 h-2 rounded-full ${section.status === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {section.title}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 font-bold uppercase">{section.score}/100</span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-50 space-y-4 bg-slate-50/50">
                          
                          {/* Critique */}
                          <div className="text-xs font-semibold text-slate-700 leading-relaxed">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">AI Critique</span>
                            {section.critique}
                          </div>

                          {/* Action verbs evaluated (only for Experience section) */}
                          {section.verbsAnalyzed && (
                            <div className="space-y-2">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Verb impact assessment</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {section.verbsAnalyzed.map((verbItem: any, i: number) => (
                                  <div
                                    key={i}
                                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                                      verbItem.status === "weak"
                                        ? "bg-rose-50/40 border-rose-100 text-rose-700"
                                        : "bg-emerald-50/40 border-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    <div>
                                      <span className="font-bold">"{verbItem.verb}"</span>
                                      <span className="text-[9px] opacity-70 block">({verbItem.status})</span>
                                    </div>
                                    {verbItem.replace && (
                                      <span className="text-[10px] font-bold bg-white border border-rose-100 px-2 py-0.5 rounded text-slate-800">
                                        Use: {verbItem.replace}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Improvements checklist */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Key changes required</span>
                            <ul className="space-y-2">
                              {section.improvements.map((imp: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-1.5" />
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          !isAnalyzing && (
            <div className="text-center py-12 bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-[#10B981]">
                <BarChart className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 max-w-sm">
                <h3 className="font-bold text-slate-800 text-sm">Run a section evaluation</h3>
                <p className="text-slate-500 text-[11px] font-semibold">Choose a resume copy and click analyze to audit experience verbs, header formats, and education metrics.</p>
              </div>
            </div>
          )
        )}

        {/* Resume History List */}
        <div className="space-y-4 pt-4">
          <h2 className="font-bold text-[#0F172A] text-base flex items-center gap-2 border-b pb-3 border-slate-100">
            <Clock className="w-5 h-5 text-slate-400" />
            Resume Hub Upload History ({resumes.length})
          </h2>

          {isLoadingResumes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
              ))}
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F172A] text-xs sm:text-sm truncate pr-1">
                        {res.fileName}
                      </h4>
                      <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                        v{res.version} • {new Date(res.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/ats-checker?resumeId=${res.id}`}
                      className="p-2 border border-[#E5E7EB] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors flex items-center justify-center"
                      title="Run ATS Check"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Delete Copy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-[#E5E7EB] rounded-[20px] text-slate-400 italic text-xs">
              No previous copies stored in your workspace. Upload a copy above to register your first version!
            </div>
          )}
        </div>

        {/* ── NEXT STEP CTA SECTION ── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mt-8">
          <div className="space-y-1.5">
            <span className="inline-block bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended Next Step
            </span>
            <h3 className="text-lg font-bold">Check ATS Match Percentage</h3>
            <p className="text-xs text-slate-400 max-w-xl font-medium">
              Validate your resume keywords against specific target job requirements to optimize parsing success.
            </p>
          </div>
          <Link
            href="/ats-checker"
            className="flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 hover:translate-x-0.5"
          >
            Run ATS Scan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
