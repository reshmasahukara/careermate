"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUploadPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/resume-analysis");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
