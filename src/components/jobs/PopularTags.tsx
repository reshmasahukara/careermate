import React from "react";
import { Search } from "lucide-react";

const TAGS = [
  "React Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Remote Jobs",
  "Freshers",
  "Internships"
];

interface PopularTagsProps {
  onSelectTag: (tag: string) => void;
}

export default function PopularTags({ onSelectTag }: PopularTagsProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-[#64748B] flex items-center gap-1.5">
          <Search className="w-4 h-4" />
          Popular:
        </span>
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className="bg-white hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-200 text-[#0F172A] hover:text-emerald-700 text-sm font-bold py-1.5 px-4 rounded-full transition-all shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
