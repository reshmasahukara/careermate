"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CloudLightning,
  ChevronRight,
  Clock
} from "lucide-react";
import { useToast } from "@/components/Providers";
import { processResumeUploadAction, getResumesAction, deleteResumeAction } from "@/app/actions/resume";
import DashboardLayout from "@/components/DashboardLayout";

export default function ResumeUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Upload States
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const userId = (session?.user as any).id || "demo-user-123";
      const history = await getResumesAction(userId);
      setResumes(history);
    } catch (e) {
      console.error("Error loading resume history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setUploadError(null);
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".docx")) {
      setUploadError("Invalid format. Please upload a PDF or DOCX file.");
      toast("Unsupported file format.", "error");
      return;
    }

    // Check size limit: 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      toast("File size too large.", "error");
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadSubmit = async () => {
    if (!file || !session?.user) return;
    setIsUploading(true);
    setUploadProgress(0);

    // Simulated parsing progress
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
      const userId = (session.user as any).id || "demo-user-123";
      
      const formData = new FormData();
      formData.append("file", file);

      // Server action now handles Cloudinary upload and text parsing simulation
      const newResume = await processResumeUploadAction(userId, formData);

      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        toast("Resume parsed successfully! Directing to ATS Score...", "success");
        router.push(`/ats-checker?resumeId=${newResume.id}`);
      }, 300);
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadError("An error occurred during file parsing.");
      toast("File upload failed.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume version?")) {
      const success = await deleteResumeAction(id);
      if (success) {
        setResumes(resumes.filter((r) => r.id !== id));
        toast("Resume copy deleted successfully.", "success");
      } else {
        toast("Failed to delete copy.", "error");
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback for unauthenticated access
  if (!session) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-[#F8FAFC] py-16 px-4">
        <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] p-8 rounded-[20px] text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-7 h-7 text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Sign in to Upload Resumes</h2>
          <p className="text-[#64748B] text-sm leading-relaxed">
            Please log in or explore our sandbox dashboard to test resume parsing, score benchmarking, and skills validation.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/login")}
              className="bg-[#2563EB] text-white py-2.5 rounded-[12px] font-bold text-xs shadow-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Log In
            </button>
            <button
              onClick={async () => {
                await signIn("credentials", { redirect: false, email: "alex@example.com", password: "password123" });
                router.refresh();
              }}
              className="bg-[#0F172A] text-white py-2.5 rounded-[12px] font-bold text-xs shadow-sm hover:bg-[#1E293B] transition-colors"
            >
              Explore sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Resume Upload</h1>
          <p className="text-[#64748B] text-xs font-semibold mt-1">Upload PDF or DOCX file to run simulated ATS scoring checks.</p>
        </div>

        {/* Upload Zone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Form zone (col 2) */}
          <div className="md:col-span-2 space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[20px] p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] cursor-pointer ${
                isDragActive
                  ? "border-[#2563EB] bg-[#2563EB]/5 scale-[0.99]"
                  : "border-[#E2E8F0] bg-white hover:border-[#2563EB]/60 hover:bg-[#F8FAFC]/50"
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
                <div className="w-full max-w-xs space-y-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#2563EB]/10 flex items-center justify-center mx-auto text-[#2563EB]">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm">Uploading and parsing...</h3>
                    <p className="text-[10px] text-[#64748B] font-bold mt-0.5 uppercase">Simulating Cloudinary storage pipeline</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F8FAFC] border border-[#E2E8F0]/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : file ? (
                <div className="space-y-4 max-w-sm">
                  <div className="w-12 h-12 rounded-[12px] bg-[#2563EB]/10 flex items-center justify-center mx-auto text-[#2563EB]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-sm break-all">{file.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1 font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  
                  <div className="flex gap-2.5 justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="px-4 py-2 border border-[#E2E8F0] rounded-[12px] text-[#64748B] font-bold text-xs hover:bg-[#F8FAFC]"
                    >
                      Clear File
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadSubmit();
                      }}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-[12px] shadow-sm transition-colors"
                    >
                      Parse Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#F8FAFC] flex items-center justify-center mx-auto border border-[#E2E8F0] shadow-sm text-[#64748B]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#0F172A] text-sm">Drag and drop resume here</h3>
                    <p className="text-[#64748B] text-xs font-semibold">Or click to search folders manually.</p>
                  </div>
                  <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
                    PDF & DOCX files accepted. Size limit: 5MB.
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-[12px] text-rose-600 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Guidelines Sidebar (col 1) */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
            <h2 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              Upload Checklist
            </h2>
            <ul className="space-y-3.5 text-xs text-[#64748B] leading-relaxed font-semibold">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>**Formatting**: Standard single-column styles optimize parser accuracy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>**Margins**: Keep margins standard. Avoid text columns inside header boundaries.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>**Content**: Quantify bullets (e.g. &#39;Improved efficiency by 12%&#39;).</span>
              </li>
            </ul>
          </div>

        </div>

        {/* History Section */}
        <div className="space-y-4 pt-4">
          <h2 className="font-bold text-[#0F172A] text-base flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-[#64748B]" />
            Resume Upload History
          </h2>

          {isLoadingHistory ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-[#F8FAFC] animate-pulse rounded-[12px] border border-[#E2E8F0]/60" />
              ))}
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-[12px] bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F172A] text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[240px]">
                        {res.fileName}
                      </h4>
                      <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                        v{res.version} • {new Date(res.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/ats-checker?resumeId=${res.id}`}
                      className="bg-[#2563EB]/10 hover:bg-[#2563EB]/25 text-[#2563EB] p-2 rounded-[8px] text-xs font-bold transition-all"
                      title="Run ATS Check"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="text-[#64748B] hover:text-rose-600 p-2 rounded-[8px] transition-colors cursor-pointer"
                      title="Delete Copy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#64748B] py-4 italic font-semibold">
              No previous versions stored. Add a copy above to establish records.
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
