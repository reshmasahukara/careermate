import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

async function fetchPublicApis(search: string, limit: number) {
  const apiJobs: any[] = [];
  try {
    // Fetch from Arbeitnow (public API)
    const arbeitnowRes = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (arbeitnowRes.ok) {
      const data = await arbeitnowRes.json();
      const mapped = (data.data || []).map((job: any) => ({
        id: `arbeitnow-${job.slug}`,
        title: job.title,
        company: job.company_name,
        location: job.location,
        description: job.description,
        employmentType: job.job_types?.[0] || "Full-time",
        experienceLevel: "Any",
        salaryMin: null,
        salaryMax: null,
        remote: job.remote || false,
        applyUrl: job.url,
        skills: job.tags || [],
        logoUrl: null,
        createdAt: new Date(job.created_at * 1000).toISOString(),
        isCurated: false,
        responsibilities: [],
        benefits: [],
        industry: null,
        companySize: null,
        companyWebsite: null,
      }));
      apiJobs.push(...mapped);
    }
  } catch (e) {
    console.error("Arbeitnow fetch failed:", e);
  }

  try {
    // Fetch from Remotive (public API)
    const remotiveUrl = search 
      ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}` 
      : `https://remotive.com/api/remote-jobs?limit=50`;
    const remotiveRes = await fetch(remotiveUrl);
    if (remotiveRes.ok) {
      const data = await remotiveRes.json();
      const mapped = (data.jobs || []).map((job: any) => ({
        id: `remotive-${job.id}`,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || "Remote Worldwide",
        description: job.description,
        employmentType: job.job_type ? job.job_type.replace("_", " ") : "Full-time",
        experienceLevel: "Any",
        salaryMin: null,
        salaryMax: null,
        remote: true,
        applyUrl: job.url,
        skills: job.tags || [],
        logoUrl: job.company_logo,
        createdAt: job.publication_date,
        isCurated: false,
        responsibilities: [],
        benefits: [],
        industry: job.category,
        companySize: null,
        companyWebsite: null,
      }));
      apiJobs.push(...mapped);
    }
  } catch (e) {
    console.error("Remotive fetch failed:", e);
  }

  // Filter API jobs by search locally if needed, though Remotive supports it.
  let filteredApi = apiJobs;
  if (search) {
    const s = search.toLowerCase();
    filteredApi = apiJobs.filter(j => 
      j.title.toLowerCase().includes(s) || 
      j.company.toLowerCase().includes(s) ||
      (j.skills && j.skills.some((skill: string) => skill.toLowerCase().includes(s)))
    );
  }

  return filteredApi.slice(0, limit);
}

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const remote = searchParams.get("remote");
    const limit = parseInt(searchParams.get("limit") || "60");

    // Hybrid Strategy: 70% API, 30% DB
    const apiTargetCount = Math.floor(limit * 0.7);
    const dbTargetCount = limit - apiTargetCount;

    // 1. Fetch from real APIs
    const apiJobs = await fetchPublicApis(search, apiTargetCount);

    // If APIs failed or returned too few, increase DB target
    const actualDbTarget = limit - apiJobs.length;

    // 2. Fetch curated fallback jobs from DB
    const whereClause: any = { isCurated: true };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { title: { contains: category, mode: "insensitive" } },
        { skills: { has: category } }
      ];
    }
    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }
    if (experience) {
      whereClause.experienceLevel = { contains: experience, mode: "insensitive" };
    }
    if (remote === "remote") {
      whereClause.remote = true;
    } else if (remote === "onsite") {
      whereClause.remote = false;
    }

    const curatedJobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: actualDbTarget,
    });

    // 3. Mix them together
    const mixedJobs = [...apiJobs, ...curatedJobs];
    
    // Optional: shuffle them slightly so curated ones aren't always strictly at the bottom
    // const shuffled = mixedJobs.sort(() => 0.5 - Math.random());

    return NextResponse.json({
      jobs: mixedJobs,
      total: mixedJobs.length,
      page: 1,
      totalPages: 1,
    });
  } catch (error: any) {
    console.error("Jobs hybrid fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
