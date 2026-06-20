"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ExternalLink, Bookmark, CheckCircle, Search, Filter, BookmarkCheck, PlayCircle, Book, Code } from "lucide-react";
import { getBookmarkedResourcesAction, bookmarkResourceAction, toggleResourceCompletionAction } from "@/app/actions/pathways";
import { useToast } from "@/components/Providers";

const CURATED_RESOURCES: Record<string, any[]> = {
  "Frontend Developer": [
    { title: "MDN Web Docs: Learn Web Development", provider: "MDN Web Docs", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", url: "https://developer.mozilla.org/en-US/docs/Learn", skills: ["HTML", "CSS", "JavaScript"] },
    { title: "Responsive Web Design Certification", provider: "freeCodeCamp", type: "Course", difficulty: "Beginner", duration: "300 Hours", url: "https://www.freecodecamp.org/learn/responsive-web-design/", skills: ["HTML", "CSS"] },
    { title: "Meta Front-End Developer Professional Certificate", provider: "Coursera", type: "Certification", difficulty: "Intermediate", duration: "7 Months", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", skills: ["React", "JavaScript", "UI/UX"] },
    { title: "Frontend Mentor Challenges", provider: "Frontend Mentor", type: "Practice", difficulty: "All Levels", duration: "Ongoing", url: "https://www.frontendmentor.io/", skills: ["CSS", "React", "HTML"] }
  ],
  "Backend Developer": [
    { title: "Node.js Official Documentation", provider: "Node.js Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://nodejs.org/en/docs/", skills: ["Node.js", "JavaScript"] },
    { title: "Express.js Guide", provider: "Express.js Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://expressjs.com/en/guide/routing.html", skills: ["Express", "Node.js"] },
    { title: "Backend Development Tutorial", provider: "GeeksforGeeks", type: "Course", difficulty: "Beginner", duration: "40 Hours", url: "https://www.geeksforgeeks.org/backend-development/", skills: ["Databases", "APIs"] },
    { title: "Node.js, Express, MongoDB Bootcamp", provider: "Udemy", type: "Course", difficulty: "Intermediate", duration: "42 Hours", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/", skills: ["Node.js", "MongoDB"] }
  ],
  "Full Stack Developer": [
    { title: "The Odin Project - Full Stack Curriculum", provider: "The Odin Project", type: "Course", difficulty: "Beginner to Advanced", duration: "1000 Hours", url: "https://www.theodinproject.com/", skills: ["JavaScript", "Ruby", "React"] },
    { title: "Full Stack Open", provider: "University of Helsinki", type: "Course", difficulty: "Intermediate", duration: "120 Hours", url: "https://fullstackopen.com/en/", skills: ["React", "Node.js", "GraphQL"] },
    { title: "IBM Full Stack Software Developer Certificate", provider: "Coursera", type: "Certification", difficulty: "Beginner", duration: "4 Months", url: "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer", skills: ["Cloud", "Python", "React"] },
    { title: "Back End Development and APIs", provider: "freeCodeCamp", type: "Course", difficulty: "Intermediate", duration: "300 Hours", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", skills: ["Node.js", "Express", "MongoDB"] }
  ],
  "Python Development": [
    { title: "Python Official Documentation", provider: "Python Official Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://docs.python.org/3/", skills: ["Python"] },
    { title: "Python for Everybody Specialization", provider: "Coursera", type: "Course", difficulty: "Beginner", duration: "8 Months", url: "https://www.coursera.org/specializations/python", skills: ["Python", "Data Structures"] },
    { title: "Python Programming Language", provider: "GeeksforGeeks", type: "Course", difficulty: "Beginner", duration: "Self-paced", url: "https://www.geeksforgeeks.org/python-programming-language/", skills: ["Python"] },
    { title: "Python Practice Problems", provider: "HackerRank", type: "Practice", difficulty: "All Levels", duration: "Ongoing", url: "https://www.hackerrank.com/domains/python", skills: ["Python"] }
  ],
  "Data Structures & Algorithms": [
    { title: "LeetCode Study Plan", provider: "LeetCode", type: "Practice", difficulty: "Intermediate", duration: "Ongoing", url: "https://leetcode.com/study-plan/", skills: ["DSA", "Problem Solving"] },
    { title: "Data Structures and Algorithms", provider: "GeeksforGeeks", type: "Course", difficulty: "Intermediate", duration: "Self-paced", url: "https://www.geeksforgeeks.org/data-structures/", skills: ["DSA", "C++", "Java"] },
    { title: "CodeChef Practice Problems", provider: "CodeChef", type: "Practice", difficulty: "All Levels", duration: "Ongoing", url: "https://www.codechef.com/practice", skills: ["Competitive Programming"] },
    { title: "NeetCode Roadmap", provider: "NeetCode", type: "Practice", difficulty: "Advanced", duration: "150 Hours", url: "https://neetcode.io/roadmap", skills: ["DSA", "Interview Prep"] }
  ],
  "Machine Learning": [
    { title: "Machine Learning Specialization", provider: "Coursera", type: "Course", difficulty: "Beginner", duration: "2 Months", url: "https://www.coursera.org/specializations/machine-learning-introduction", skills: ["Python", "Math", "ML"] },
    { title: "Kaggle Learn: Intro to Machine Learning", provider: "Kaggle", type: "Course", difficulty: "Beginner", duration: "10 Hours", url: "https://www.kaggle.com/learn/intro-to-machine-learning", skills: ["Pandas", "Scikit-Learn"] },
    { title: "Scikit-Learn User Guide", provider: "Scikit-learn Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://scikit-learn.org/stable/user_guide.html", skills: ["Scikit-Learn"] },
    { title: "Hands-On Machine Learning Repository", provider: "GitHub", type: "Practice", difficulty: "Intermediate", duration: "Self-paced", url: "https://github.com/ageron/handson-ml3", skills: ["TensorFlow", "Keras"] }
  ],
  "Generative AI": [
    { title: "Generative AI for Everyone", provider: "DeepLearning.AI", type: "Course", difficulty: "Beginner", duration: "6 Hours", url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/", skills: ["GenAI", "Prompt Engineering"] },
    { title: "OpenAI API Documentation", provider: "OpenAI Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://platform.openai.com/docs/introduction", skills: ["OpenAI API", "GPT"] },
    { title: "Hugging Face NLP Course", provider: "Hugging Face", type: "Course", difficulty: "Intermediate", duration: "40 Hours", url: "https://huggingface.co/learn/nlp-course/chapter1/1", skills: ["Transformers", "Hugging Face"] },
    { title: "LangChain Documentation", provider: "LangChain Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://python.langchain.com/docs/get_started/introduction", skills: ["LangChain", "LLMs"] }
  ],
  "Agentic AI": [
    { title: "LangGraph Concepts", provider: "LangGraph Documentation", type: "Documentation", difficulty: "Advanced", duration: "Self-paced", url: "https://python.langchain.com/docs/langgraph", skills: ["LangGraph", "Agents"] },
    { title: "CrewAI Official Docs", provider: "CrewAI Documentation", type: "Documentation", difficulty: "Advanced", duration: "Self-paced", url: "https://docs.crewai.com/", skills: ["CrewAI", "Multi-Agent"] },
    { title: "Microsoft AutoGen", provider: "AutoGen Documentation", type: "Documentation", difficulty: "Advanced", duration: "Self-paced", url: "https://microsoft.github.io/autogen/", skills: ["AutoGen"] },
    { title: "OpenAI Assistants API", provider: "OpenAI Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://platform.openai.com/docs/assistants/overview", skills: ["OpenAI Assistants"] }
  ],
  "Natural Language Processing": [
    { title: "Natural Language Processing Specialization", provider: "Coursera", type: "Course", difficulty: "Intermediate", duration: "3 Months", url: "https://www.coursera.org/specializations/natural-language-processing", skills: ["NLP", "Deep Learning"] },
    { title: "Hugging Face NLP Course", provider: "Hugging Face", type: "Course", difficulty: "Intermediate", duration: "40 Hours", url: "https://huggingface.co/learn/nlp-course/", skills: ["Transformers", "Hugging Face"] },
    { title: "spaCy 101", provider: "spaCy Documentation", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", url: "https://spacy.io/usage/spacy-101", skills: ["spaCy", "Python"] },
    { title: "NLTK Book", provider: "NLTK Documentation", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", url: "https://www.nltk.org/book/", skills: ["NLTK"] }
  ],
  "Cybersecurity": [
    { title: "TryHackMe Learning Paths", provider: "TryHackMe", type: "Practice", difficulty: "Beginner to Advanced", duration: "Ongoing", url: "https://tryhackme.com/", skills: ["Penetration Testing", "Networking"] },
    { title: "Hack The Box Academy", provider: "Hack The Box", type: "Practice", difficulty: "Intermediate", duration: "Ongoing", url: "https://academy.hackthebox.com/", skills: ["Ethical Hacking"] },
    { title: "Google Cybersecurity Professional Certificate", provider: "Coursera", type: "Certification", difficulty: "Beginner", duration: "6 Months", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", skills: ["Security", "Linux", "SQL"] },
    { title: "OWASP Top 10", provider: "OWASP Documentation", type: "Documentation", difficulty: "All Levels", duration: "Self-paced", url: "https://owasp.org/www-project-top-ten/", skills: ["Web Security"] }
  ],
  "Cloud Computing": [
    { title: "AWS Skill Builder", provider: "AWS Skill Builder", type: "Course", difficulty: "All Levels", duration: "Self-paced", url: "https://explore.skillbuilder.aws/", skills: ["AWS", "Cloud"] },
    { title: "Azure Fundamentals", provider: "Microsoft Learn", type: "Course", difficulty: "Beginner", duration: "20 Hours", url: "https://learn.microsoft.com/en-us/training/azure/", skills: ["Azure"] },
    { title: "Google Cloud Skills Boost", provider: "Google Cloud Skills Boost", type: "Practice", difficulty: "All Levels", duration: "Ongoing", url: "https://www.cloudskillsboost.google/", skills: ["GCP"] },
    { title: "Cloud Computing Specialization", provider: "Coursera", type: "Course", difficulty: "Intermediate", duration: "6 Months", url: "https://www.coursera.org/specializations/cloud-computing", skills: ["Cloud", "Distributed Systems"] }
  ],
  "Digital Marketing": [
    { title: "Fundamentals of Digital Marketing", provider: "Google Digital Garage", type: "Certification", difficulty: "Beginner", duration: "40 Hours", url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing", skills: ["SEO", "SEM"] },
    { title: "HubSpot Academy Inbound Marketing", provider: "HubSpot Academy", type: "Certification", difficulty: "Beginner", duration: "5 Hours", url: "https://academy.hubspot.com/courses/inbound", skills: ["Inbound", "Content Marketing"] },
    { title: "Digital Marketing Specialization", provider: "Coursera", type: "Course", difficulty: "Intermediate", duration: "8 Months", url: "https://www.coursera.org/specializations/digital-marketing", skills: ["Analytics", "Strategy"] },
    { title: "Semrush Academy", provider: "Semrush Academy", type: "Course", difficulty: "Intermediate", duration: "Self-paced", url: "https://www.semrush.com/academy/", skills: ["SEO", "PPC"] }
  ]
};

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
    let base = CURATED_RESOURCES[targetRole] || [];
    if (base.length === 0) {
      // Find partial matches
      for (const key of Object.keys(CURATED_RESOURCES)) {
        if (targetRole.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(targetRole.toLowerCase())) {
          base = CURATED_RESOURCES[key];
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
