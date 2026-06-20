"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, Target } from "lucide-react";

export interface GroupedOption {
  category: string;
  roles: string[];
}

export const GROUPED_ROLES: GroupedOption[] = [
  {
    category: "Web Development",
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Python Developer",
      "Java Developer",
      "Mobile App Developer"
    ]
  },
  {
    category: "AI & Data",
    roles: [
      "Data Analyst",
      "Data Scientist",
      "Machine Learning Engineer",
      "AI/ML Engineer",
      "Generative AI Engineer",
      "Agentic AI Developer",
      "NLP Engineer"
    ]
  },
  {
    category: "Cloud & Security",
    roles: [
      "Cloud Engineer",
      "DevOps Engineer",
      "Cybersecurity Analyst"
    ]
  },
  {
    category: "Core Skills",
    roles: [
      "Data Structures & Algorithms"
    ]
  },
  {
    category: "Design & Product",
    roles: [
      "UI/UX Designer",
      "Product Manager"
    ]
  },
  {
    category: "Marketing",
    roles: [
      "Digital Marketing Specialist"
    ]
  }
];

// Flattened list for quick searching and keyboard navigation
const FLATTENED_ROLES = GROUPED_ROLES.flatMap(g => g.roles);

interface SearchableRoleDropdownProps {
  selectedValue: string;
  onSelect: (role: string) => void;
  disabled?: boolean;
}

export default function SearchableRoleDropdown({ selectedValue, onSelect, disabled }: SearchableRoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter roles based on query
  const filteredRoles = FLATTENED_ROLES.filter(role =>
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keep index within bounds of filtered roles
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        // Focus the search input on the next tick
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % filteredRoles.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + filteredRoles.length) % filteredRoles.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredRoles[highlightedIndex]) {
          onSelect(filteredRoles[highlightedIndex]);
          setIsOpen(false);
          setSearchQuery("");
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        break;
      case "Tab":
        // Keep tab moving naturally but close the modal
        setIsOpen(false);
        setSearchQuery("");
        break;
      default:
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector("[data-highlighted='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Group filtered options to display categorized output
  const renderGroupedOptions = () => {
    let globalIndex = 0;

    return GROUPED_ROLES.map(group => {
      const matchingRolesInGroup = group.roles.filter(role =>
        filteredRoles.includes(role)
      );

      if (matchingRolesInGroup.length === 0) return null;

      return (
        <div key={group.category} className="mb-2">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
            {group.category}
          </div>
          <div className="mt-1 space-y-0.5">
            {matchingRolesInGroup.map(role => {
              const currentGlobalIndex = globalIndex;
              globalIndex++;
              const isSelected = selectedValue === role;
              const isHighlighted = highlightedIndex === currentGlobalIndex;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onSelect(role);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  data-highlighted={isHighlighted}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer
                    ${isHighlighted ? "bg-emerald-50 text-emerald-800" : "text-slate-700 hover:bg-slate-50"}
                    ${isSelected ? "text-emerald-700 font-bold" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{role}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }
          }
        }}
        className={`w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-left text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all flex items-center justify-between cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-slate-300"}
          ${isOpen ? "border-emerald-500 ring-2 ring-emerald-500/10" : ""}
        `}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Target className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span className="truncate">{selectedValue || "Select Career Path..."}</span>
        </div>
        <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[380px] flex flex-col">
          {/* Search Box */}
          <div className="relative p-2 border-b border-slate-100 shrink-0 bg-white">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search career paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Search className="absolute left-4.5 top-4 w-4 h-4 text-slate-400" />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto p-1.5 flex-1 max-h-[300px]" ref={listRef}>
            {filteredRoles.length === 0 ? (
              <div className="text-center py-6 text-xs font-medium text-slate-400">
                No matching career paths found.
              </div>
            ) : (
              renderGroupedOptions()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
