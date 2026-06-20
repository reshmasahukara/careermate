"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ExternalLink, Bookmark, CheckCircle, Search, Filter, BookmarkCheck, PlayCircle, Book, Code } from "lucide-react";
import { getBookmarkedResourcesAction, bookmarkResourceAction, toggleResourceCompletionAction } from "@/app/actions/pathways";
import { useToast } from "@/components/Providers";
import { CAREER_PATHS_DATA } from "@/lib/constants/careerPathsData";

interface LearningResourcesProps {
  userId: string;
  targetRole: string;
}

export default function LearningResources({ userId, targetRole }: LearningResourcesProps) {
  const [bookmarked, setBookmarked] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadBookmarks();
    }
  }, [userId]);

  const loadBookmarks = async () => {
    try {
      const b = await getBookmarkedResourcesAction(userId);
      setBookmarked(b);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmarkToggle = async (resource: any) => {
    try {
      const res = await bookmarkResourceAction(userId, {
        title: resource.title,
        provider: resource.provider,
        url: resource.url,
        type: resource.type,
        difficulty: resource.difficulty,
        duration: resource.duration,
        skills: resource.skills
      });
      if (res?.action === 'added') {
        setBookmarked(prev => [...prev, res.resource]);
        toast("Resource bookmarked", "success");
      } else if (res?.action === 'removed') {
        setBookmarked(prev => prev.filter(b => b.id !== res.id));
        toast("Bookmark removed", "success");
      }
    } catch (e) {
      toast("Failed to update bookmark", "error");
    }
  };

  const handleCompletionToggle = async (id: string, isCompleted: boolean) => {
    try {
      await toggleResourceCompletionAction(userId, id, isCompleted);
      setBookmarked(prev => prev.map(b => b.id === id ? { ...b, isCompleted } : b));
      if (isCompleted) toast("Marked as completed!", "success");
    } catch (e) {
      toast("Failed to update completion status", "error");
    }
  };

  const currentResources = useMemo(() => {
    // If exact match doesn't exist, we fallback or just show all if none selected
    let base = CAREER_PATHS_DATA[targetRole]?.resources || [];
    if (base.length === 0) {
      // Find partial matches
      for (const key of Object.keys(CAREER_PATHS_DATA)) {
        if (targetRole.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(targetRole.toLowerCase())) {
          base = CAREER_PATHS_DATA[key].resources;
          break;
        }
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.provider.toLowerCase().includes(q) ||
        r.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    if (filterType !== "All") {
      base = base.filter(r => r.type === filterType);
    }

    return base;
  }, [targetRole, search, filterType]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Course': return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case 'Documentation': return <Book className="w-4 h-4 text-blue-500" />;
      case 'Practice': return <Code className="w-4 h-4 text-amber-500" />;
      default: return <Book className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!targetRole) {
    return (
      <div className="bg-white border border-slate-200 rounded-[20px] p-10 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Choose a target role to explore learning resources.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search resources or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
        <div className="relative min-w-[150px]">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 appearance-none transition-colors"
          >
            <option value="All">All Types</option>
            <option value="Course">Courses</option>
            <option value="Documentation">Documentation</option>
            <option value="Practice">Practice</option>
            <option value="Certification">Certifications</option>
          </select>
          <Filter className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Bookmarked Section */}
      {bookmarked.length > 0 && search === "" && filterType === "All" && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-500" /> Saved Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarked.map(b => (
              <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{b.title}</h4>
                    <button onClick={() => handleBookmarkToggle(b)} className="text-emerald-500 hover:text-emerald-600 transition-colors shrink-0">
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">{b.provider}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                      {getIconForType(b.type)} {b.type}
                    </span>
                    {b.isCompleted && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <button 
                    onClick={() => handleCompletionToggle(b.id, !b.isCompleted)}
                    className={`text-[11px] font-bold transition-colors ${b.isCompleted ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-600 hover:text-emerald-700'}`}
                  >
                    {b.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                  </button>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curated Catalog */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Book className="w-4 h-4 text-blue-500" /> Recommended for {targetRole}
        </h3>
        
        {currentResources.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-500">No official resources matched your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentResources.map((res, i) => {
              const isBookmarked = bookmarked.some(b => b.url === res.url);
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-colors flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{res.title}</h4>
                      <button 
                        onClick={() => handleBookmarkToggle(res)} 
                        className={`transition-colors shrink-0 ${isBookmarked ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-emerald-400'}`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mb-3">{res.provider}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                        {getIconForType(res.type)} {res.type}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{res.difficulty}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {res.skills.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    <span className="text-[11px] font-bold text-slate-400">{res.duration}</span>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Start Learning <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
