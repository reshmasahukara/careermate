// In-memory Mock Database for CareerMate
// This file simulates database operations when DATABASE_URL is not set.

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

export interface MockResume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  parsedText: string;
  version: number;
  createdAt: Date;
}

export interface MockAtsScore {
  id: string;
  resumeId: string;
  targetRole: string;
  score: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  formattingFeedback: string;
  sectionAnalysis: string;
  improvements: string;
  createdAt: Date;
}

export interface MockJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  applyUrl: string;
  logoUrl?: string;
  isRemote: boolean;
  createdAt: Date;
}

export interface MockSavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
}

export interface MockSkill {
  id: string;
  name: string;
  category: string;
}

export interface MockUserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: "Beginner" | "Intermediate" | "Expert";
}

export interface MockCareerPath {
  id: string;
  userId: string;
  targetRole: string;
  description: string;
  roadmapData: string; // JSON String representing milestones
  createdAt: Date;
}

export interface MockLearningResource {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: "Course" | "Video" | "Book" | "Article";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  skills: string[];
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  createdAt: Date;
}

export interface MockSubscription {
  id: string;
  userId: string;
  plan: "Free" | "Pro" | "Premium" | "Enterprise";
  status: "Active" | "Cancelled" | "Expired";
  currentPeriodEnd: Date;
  createdAt: Date;
}

// Seed Data
export const MOCK_USER: MockUser = {
  id: "demo-user-123",
  name: "Alex Morgan",
  email: "alex@example.com",
  image: undefined,
  createdAt: new Date("2026-01-10"),
};

export const MOCK_JOBS: MockJob[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer (React/Next.js)",
    company: "Vercel",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Senior",
    salary: "$140,000 - $180,000",
    description: "We are looking for a Senior Frontend Engineer with deep expertise in Next.js, React, and Tailwind CSS to help build the future of deployment and hosting.",
    requirements: [
      "5+ years of experience with modern frontend frameworks.",
      "Expert knowledge of React, Next.js, and TypeScript.",
      "Experience optimizing page speed and Core Web Vitals.",
      "Strong communication and collaboration skills."
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web Performance"],
    applyUrl: "https://vercel.com/careers",
    logoUrl: "/vercel-logo.png",
    isRemote: true,
    createdAt: new Date("2026-06-15"),
  },
  {
    id: "job-2",
    title: "Full Stack Developer",
    company: "Stripe",
    location: "Seattle, WA",
    type: "Full-time",
    experience: "Mid",
    salary: "$130,000 - $165,000",
    description: "Join the Stripe Billing team to build robust APIs and user interfaces that enable internet businesses to scale their billing operations globally.",
    requirements: [
      "3+ years of software engineering experience.",
      "Experience with Prisma, Node.js, and PostgreSQL.",
      "Proficient in React and modern CSS systems.",
      "Familiarity with financial systems is a plus."
    ],
    skills: ["React", "Prisma", "Node.js", "PostgreSQL", "APIs"],
    applyUrl: "https://stripe.com/careers",
    logoUrl: "/stripe-logo.png",
    isRemote: false,
    createdAt: new Date("2026-06-17"),
  },
  {
    id: "job-3",
    title: "AI Product Designer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Senior",
    salary: "$150,000 - $210,000",
    description: "Help shape the future of artificial intelligence interfaces. You will design next-generation canvas interfaces and conversational agents.",
    requirements: [
      "4+ years of product design experience for complex web apps.",
      "Strong portfolio highlighting UI/UX, motion, and interaction design.",
      "Experience prototyping with React or advanced tools.",
      "Familiarity with AI interfaces or prompt engineering."
    ],
    skills: ["Framer Motion", "UI/UX Design", "Figma", "React", "AI Prototyping"],
    applyUrl: "https://openai.com/careers",
    logoUrl: "/openai-logo.png",
    isRemote: false,
    createdAt: new Date("2026-06-14"),
  },
  {
    id: "job-4",
    title: "Software Engineer Intern",
    company: "GitHub",
    location: "Remote",
    type: "Internship",
    experience: "Junior",
    salary: "$40 - $60 / hour",
    description: "Work with GitHub's developer workflows team to build features that improve daily pipelines for millions of developers worldwide.",
    requirements: [
      "Currently pursuing a BS/MS in Computer Science or equivalent experience.",
      "Proficiency in Git, TypeScript, and React.",
      "Passion for developer tooling and open source."
    ],
    skills: ["Git", "TypeScript", "React", "Node.js"],
    applyUrl: "https://github.com/careers",
    logoUrl: "/github-logo.png",
    isRemote: true,
    createdAt: new Date("2026-06-12"),
  },
  {
    id: "job-5",
    title: "Technical Project Manager",
    company: "Google",
    location: "New York, NY",
    type: "Full-time",
    experience: "Mid",
    salary: "$125,000 - $160,000",
    description: "Coordinate large-scale cloud migration projects across cross-functional engineering teams. Define scope, track progress, and mitigate risks.",
    requirements: [
      "3+ years managing software development lifecycle projects.",
      "Excellent communication, risk management, and scoping skills.",
      "Technical background in cloud computing is highly desired."
    ],
    skills: ["Project Management", "Agile", "Cloud Computing", "Jira"],
    applyUrl: "https://google.com/careers",
    logoUrl: "/google-logo.png",
    isRemote: false,
    createdAt: new Date("2026-06-10"),
  }
];

export const MOCK_SKILLS: MockSkill[] = [
  { id: "s-1", name: "React", category: "Frontend" },
  { id: "s-2", name: "Next.js", category: "Frontend" },
  { id: "s-3", name: "TypeScript", category: "Languages" },
  { id: "s-4", name: "Tailwind CSS", category: "Frontend" },
  { id: "s-5", name: "Framer Motion", category: "Frontend" },
  { id: "s-6", name: "Prisma", category: "Backend" },
  { id: "s-7", name: "Node.js", category: "Backend" },
  { id: "s-8", name: "PostgreSQL", category: "Backend" },
  { id: "s-9", name: "Git", category: "Tools" },
  { id: "s-10", name: "UI/UX Design", category: "Design" },
  { id: "s-11", name: "Docker", category: "DevOps" },
  { id: "s-12", name: "AWS", category: "DevOps" },
];

export const MOCK_USER_SKILLS: MockUserSkill[] = [
  { id: "us-1", userId: "demo-user-123", skillId: "s-1", proficiency: "Expert" },
  { id: "us-2", userId: "demo-user-123", skillId: "s-3", proficiency: "Intermediate" },
  { id: "us-3", userId: "demo-user-123", skillId: "s-4", proficiency: "Expert" },
  { id: "us-4", userId: "demo-user-123", skillId: "s-9", proficiency: "Intermediate" },
];

export const MOCK_RESUMES: MockResume[] = [
  {
    id: "res-1",
    userId: "demo-user-123",
    fileName: "Alex_Morgan_Resume_v1.pdf",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/resumes/dummy.pdf",
    fileType: "application/pdf",
    parsedText: "Alex Morgan. Senior Frontend Engineer. Experience: Vercel (2 years), Google (2 years). Skills: React, Tailwind CSS, Javascript, CSS.",
    version: 1,
    createdAt: new Date("2026-06-12T10:00:00Z"),
  }
];

export const MOCK_ATS_SCORES: MockAtsScore[] = [
  {
    id: "ats-1",
    resumeId: "res-1",
    targetRole: "Senior Frontend Engineer",
    score: 74,
    keywordsFound: ["React", "Tailwind CSS", "Javascript", "CSS"],
    keywordsMissing: ["Next.js", "TypeScript", "Framer Motion", "Web Performance", "SEO"],
    formattingFeedback: "• Bullet points under Vercel role look clear but are missing structural numbers.\n• Font sizing is appropriate (11pt), margins are standard (1 inch).\n• Section headers are clean, but contact details are in the header field, which some older ATS systems might miss.",
    sectionAnalysis: "• **Experience (Good)**: Defined bullet points highlight accomplishments rather than just duties.\n• **Skills (Fair)**: Missing critical modern keywords expected for a Senior role (e.g. Next.js, Webpack, optimization).\n• **Education (Good)**: Degree and graduation year clearly listed.",
    improvements: "• Integrate missing technical keywords like TypeScript and Next.js.\n• Re-format contact details out of the top header margins.\n• Use quantitative metrics for bullet points (e.g., 'Improved loading speed by 25%').",
    createdAt: new Date("2026-06-12T10:05:00Z"),
  }
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "not-1",
    userId: "demo-user-123",
    title: "ATS Analysis Complete",
    message: "Your resume 'Alex_Morgan_Resume_v1.pdf' has been analyzed. Score: 74/100.",
    type: "success",
    isRead: false,
    createdAt: new Date("2026-06-12T10:05:00Z"),
  },
  {
    id: "not-2",
    userId: "demo-user-123",
    title: "Interview Reminder",
    message: "Upcoming mock interview preparation session in 24 hours.",
    type: "warning",
    isRead: false,
    createdAt: new Date("2026-06-17T09:00:00Z"),
  },
  {
    id: "not-3",
    userId: "demo-user-123",
    title: "New Recommended Job",
    message: "Vercel has posted a new remote position matching your 'React' skill set.",
    type: "info",
    isRead: true,
    createdAt: new Date("2026-06-15T12:00:00Z"),
  }
];

export const MOCK_SUBSCRIPTION: MockSubscription = {
  id: "sub-1",
  userId: "demo-user-123",
  plan: "Pro",
  status: "Active",
  currentPeriodEnd: new Date("2026-07-18T10:00:00Z"),
  createdAt: new Date("2026-06-18T10:00:00Z"),
};

export const MOCK_CAREER_PATH: MockCareerPath = {
  id: "cp-1",
  userId: "demo-user-123",
  targetRole: "Senior Frontend Engineer",
  description: "A career path focusing on advanced architecture, UI optimization, Next.js deep dive, and technical leadership in frontend systems.",
  roadmapData: JSON.stringify([
    {
      week: 1,
      title: "Mastering Next.js 14 App Router & RSCs",
      description: "Learn React Server Components, Streaming, suspense boundaries, and server actions inside out.",
      status: "completed",
      resourceId: "lr-1",
    },
    {
      week: 2,
      title: "Advanced TypeScript Architectures",
      description: "Dive into conditional types, utility types, mapped types, and robust generic API responses.",
      status: "in-progress",
      resourceId: "lr-2",
    },
    {
      week: 3,
      title: "Web Performance, Core Web Vitals & Hydration",
      description: "Master image optimization, script loading strategies, font preloading, and diagnostic tools.",
      status: "pending",
      resourceId: "lr-3",
    },
    {
      week: 4,
      title: "Framer Motion & Micro-interactions",
      description: "Implement premium SaaS-like animations, slide lists, layout morphing, and interactive feedback loops.",
      status: "pending",
      resourceId: "lr-4",
    }
  ]),
  createdAt: new Date("2026-06-12T10:10:00Z"),
};

export const MOCK_LEARNING_RESOURCES: MockLearningResource[] = [
  {
    id: "lr-1",
    title: "Next.js 14+ Complete Developer Guide",
    provider: "Academind",
    url: "https://www.udemy.com",
    type: "Course",
    difficulty: "Intermediate",
    duration: "18.5 hours",
    rating: 4.8,
    skills: ["Next.js", "React"],
    isCompleted: true,
    userId: "demo-user-123",
    createdAt: new Date("2026-06-12T10:10:00Z"),
  },
  {
    id: "lr-2",
    title: "TypeScript Deep Dive & Design Patterns",
    provider: "Frontend Masters",
    url: "https://frontendmasters.com",
    type: "Course",
    difficulty: "Advanced",
    duration: "6 hours",
    rating: 4.9,
    skills: ["TypeScript"],
    isCompleted: false,
    userId: "demo-user-123",
    createdAt: new Date("2026-06-12T10:10:00Z"),
  },
  {
    id: "lr-3",
    title: "Optimizing Core Web Vitals in Next.js Projects",
    provider: "Vercel Guides",
    url: "https://nextjs.org/learn",
    type: "Article",
    difficulty: "Advanced",
    duration: "45 mins",
    rating: 4.7,
    skills: ["Web Performance", "Next.js"],
    isCompleted: false,
    userId: "demo-user-123",
    createdAt: new Date("2026-06-12T10:10:00Z"),
  },
  {
    id: "lr-4",
    title: "Framer Motion Masterclass: Creating Dynamic SaaS Interfaces",
    provider: "DesignCode",
    url: "https://designcode.io",
    type: "Course",
    difficulty: "Intermediate",
    duration: "8 hours",
    rating: 4.9,
    skills: ["Framer Motion", "UI/UX Design"],
    isCompleted: false,
    userId: "demo-user-123",
    createdAt: new Date("2026-06-12T10:10:00Z"),
  }
];

// Helper database manager class to store data in runtime memory
class MemoryDatabase {
  private users: Map<string, MockUser> = new Map();
  private resumes: Map<string, MockResume> = new Map();
  private atsScores: Map<string, MockAtsScore> = new Map();
  private savedJobs: Map<string, MockSavedJob> = new Map();
  private userSkills: Map<string, MockUserSkill> = new Map();
  private careerPaths: Map<string, MockCareerPath> = new Map();
  private learningResources: Map<string, MockLearningResource> = new Map();
  private notifications: Map<string, MockNotification> = new Map();
  private subscriptions: Map<string, MockSubscription> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    this.users.set(MOCK_USER.id, MOCK_USER);
    MOCK_RESUMES.forEach((r) => this.resumes.set(r.id, r));
    MOCK_ATS_SCORES.forEach((s) => this.atsScores.set(s.id, s));
    MOCK_NOTIFICATIONS.forEach((n) => this.notifications.set(n.id, n));
    MOCK_LEARNING_RESOURCES.forEach((lr) => this.learningResources.set(lr.id, lr));
    this.careerPaths.set(MOCK_CAREER_PATH.id, MOCK_CAREER_PATH);
    this.subscriptions.set(MOCK_SUBSCRIPTION.id, MOCK_SUBSCRIPTION);
    MOCK_USER_SKILLS.forEach((us) => this.userSkills.set(us.id, us));
  }

  // Users
  getUser(email: string) {
    return Array.from(this.users.values()).find((u) => u.email === email) || null;
  }
  getUserById(id: string) {
    return this.users.get(id) || null;
  }
  createUser(name: string, email: string) {
    const newUser: MockUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    // Auto subscribe to Free plan
    this.createSubscription(newUser.id, "Free");
    return newUser;
  }
  updateUser(id: string, name: string) {
    const user = this.users.get(id);
    if (user) {
      user.name = name;
      this.users.set(id, user);
    }
    return user;
  }

  // Resumes
  getResumes(userId: string) {
    return Array.from(this.resumes.values()).filter((r) => r.userId === userId);
  }
  createResume(userId: string, fileName: string, fileUrl: string, fileType: string, parsedText: string) {
    const newResume: MockResume = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      fileName,
      fileUrl,
      fileType,
      parsedText,
      version: this.getResumes(userId).length + 1,
      createdAt: new Date(),
    };
    this.resumes.set(newResume.id, newResume);
    return newResume;
  }
  deleteResume(id: string) {
    return this.resumes.delete(id);
  }

  // ATS Scores
  getAtsScores(resumeId: string) {
    return Array.from(this.atsScores.values()).filter((s) => s.resumeId === resumeId);
  }
  getAtsScoresByUserId(userId: string) {
    const resumeIds = this.getResumes(userId).map((r) => r.id);
    return Array.from(this.atsScores.values()).filter((s) => resumeIds.includes(s.resumeId));
  }
  createAtsScore(resumeId: string, targetRole: string, score: number, keywordsFound: string[], keywordsMissing: string[], formatting: string, section: string, improvements: string) {
    const newScore: MockAtsScore = {
      id: Math.random().toString(36).substring(2, 9),
      resumeId,
      targetRole,
      score,
      keywordsFound,
      keywordsMissing,
      formattingFeedback: formatting,
      sectionAnalysis: section,
      improvements,
      createdAt: new Date(),
    };
    this.atsScores.set(newScore.id, newScore);
    
    // Add success notification
    const resume = this.resumes.get(resumeId);
    if (resume) {
      this.createNotification(
        resume.userId,
        "ATS Score Calculated",
        `ATS score calculated for '${resume.fileName}'. Target: ${targetRole}. Score: ${score}/100.`,
        "success"
      );
    }

    return newScore;
  }

  // Saved Jobs
  getSavedJobs(userId: string) {
    const userSaves = Array.from(this.savedJobs.values()).filter((s) => s.userId === userId);
    const jobIds = userSaves.map((s) => s.jobId);
    return MOCK_JOBS.filter((j) => jobIds.includes(j.id));
  }
  saveJob(userId: string, jobId: string) {
    const existing = Array.from(this.savedJobs.values()).find(
      (s) => s.userId === userId && s.jobId === jobId
    );
    if (existing) {
      // Toggle off / Unsave
      this.savedJobs.delete(existing.id);
      return false;
    }
    const newSave: MockSavedJob = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      jobId,
      savedAt: new Date(),
    };
    this.savedJobs.set(newSave.id, newSave);
    return true;
  }

  // Skills
  getUserSkills(userId: string) {
    const userProficiencies = Array.from(this.userSkills.values()).filter((us) => us.userId === userId);
    return userProficiencies.map((us) => {
      const skill = MOCK_SKILLS.find((s) => s.id === us.skillId);
      return {
        id: us.id,
        name: skill?.name || "Unknown Skill",
        category: skill?.category || "General",
        proficiency: us.proficiency,
        skillId: us.skillId,
      };
    });
  }
  addUserSkill(userId: string, skillName: string, proficiency: "Beginner" | "Intermediate" | "Expert") {
    // Check if skill exists globally, if not create
    let skill = MOCK_SKILLS.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) {
      skill = {
        id: Math.random().toString(36).substring(2, 9),
        name: skillName,
        category: "General",
      };
      MOCK_SKILLS.push(skill);
    }

    // Check if user has it
    const existing = Array.from(this.userSkills.values()).find(
      (us) => us.userId === userId && us.skillId === skill!.id
    );
    if (existing) {
      existing.proficiency = proficiency;
      this.userSkills.set(existing.id, existing);
      return existing;
    }

    const newUs: MockUserSkill = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      skillId: skill.id,
      proficiency,
    };
    this.userSkills.set(newUs.id, newUs);
    return newUs;
  }
  removeUserSkill(userId: string, skillId: string) {
    const item = Array.from(this.userSkills.values()).find(
      (us) => us.userId === userId && us.skillId === skillId
    );
    if (item) {
      this.userSkills.delete(item.id);
      return true;
    }
    return false;
  }

  // Career Paths
  getCareerPath(userId: string) {
    return Array.from(this.careerPaths.values()).find((cp) => cp.userId === userId) || null;
  }
  createCareerPath(userId: string, targetRole: string, description: string, milestones: any[]) {
    // Delete existing
    const existing = this.getCareerPath(userId);
    if (existing) {
      this.careerPaths.delete(existing.id);
    }

    const newCp: MockCareerPath = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      targetRole,
      description,
      roadmapData: JSON.stringify(milestones),
      createdAt: new Date(),
    };
    this.careerPaths.set(newCp.id, newCp);

    this.createNotification(
      userId,
      "Learning Roadmap Generated",
      `A custom learning roadmap for '${targetRole}' has been successfully created.`,
      "info"
    );

    return newCp;
  }

  // Learning Resources
  getLearningResources(userId: string) {
    return Array.from(this.learningResources.values()).filter((lr) => lr.userId === userId);
  }
  toggleResourceCompletion(id: string) {
    const resource = this.learningResources.get(id);
    if (resource) {
      resource.isCompleted = !resource.isCompleted;
      this.learningResources.set(id, resource);
      return resource;
    }
    return null;
  }

  // Notifications
  getNotifications(userId: string) {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  createNotification(userId: string, title: string, message: string, type: "info" | "success" | "warning" | "alert") {
    const newNot: MockNotification = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(newNot.id, newNot);
    return newNot;
  }
  markNotificationsAsRead(userId: string) {
    Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.isRead = true;
        this.notifications.set(n.id, n);
      });
  }

  // Subscriptions
  getSubscription(userId: string) {
    return Array.from(this.subscriptions.values()).find((s) => s.userId === userId) || null;
  }
  createSubscription(userId: string, plan: "Free" | "Pro" | "Premium" | "Enterprise") {
    const end = new Date();
    end.setMonth(end.getMonth() + 1); // 1 month period
    const newSub: MockSubscription = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      plan,
      status: "Active",
      currentPeriodEnd: end,
      createdAt: new Date(),
    };
    this.subscriptions.set(userId, newSub); // Map user to their subscription
    return newSub;
  }
}

// Global server instance
export const mockDb = new MemoryDatabase();
