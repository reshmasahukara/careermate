import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { syncJobsInternal } from "@/lib/syncJobs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const jobType = searchParams.get("jobType") || "";
    const remote = searchParams.get("remote");
    const userId = searchParams.get("userId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // 1. AUTO-SYNC CACHE CHECK
    // If the database has < 50 jobs or the latest job is > 6 hours old, run sync.
    const count = await prisma.job.count();
    let needsSync = count < 50;

    if (!needsSync) {
      const latestJob = await prisma.job.findFirst({
        orderBy: { createdAt: "desc" }
      });
      if (latestJob) {
        const ageInHours = (Date.now() - new Date(latestJob.createdAt).getTime()) / (1000 * 60 * 60);
        if (ageInHours >= 6) {
          needsSync = true;
        }
      } else {
        needsSync = true;
      }
    }

    if (needsSync) {
      console.log("Triggering auto job sync...");
      try {
        await syncJobsInternal();
      } catch (syncError) {
        console.error("Auto sync failed:", syncError);
      }
    }

    // 2. USER HISTORY AND PREFERENCES LOGGING
    if (userId) {
      // Save search queries to SearchHistory
      if (search) {
        try {
          await prisma.searchHistory.create({
            data: {
              userId,
              query: search,
              filters: {
                role: role || undefined,
                location: location || undefined,
                experience: experience || undefined,
                jobType: jobType || undefined,
                remote: remote === "true" || undefined,
              }
            }
          });
        } catch (dbErr) {
          console.error("Error saving search history:", dbErr);
        }
      }

      // Update UserPreferences based on current filters
      if (role || location || experience || jobType || remote !== null) {
        try {
          const currentPrefs = await prisma.userPreferences.findUnique({
            where: { userId }
          });

          const roles = role ? Array.from(new Set([...(currentPrefs?.roles || []), role])) : (currentPrefs?.roles || []);
          const locations = location ? Array.from(new Set([...(currentPrefs?.locations || []), location])) : (currentPrefs?.locations || []);
          const experienceLevels = experience ? Array.from(new Set([...(currentPrefs?.experienceLevels || []), experience])) : (currentPrefs?.experienceLevels || []);
          const jobTypes = jobType ? Array.from(new Set([...(currentPrefs?.jobTypes || []), jobType])) : (currentPrefs?.jobTypes || []);
          const remoteOnly = remote === "true" ? true : remote === "false" ? false : (currentPrefs?.remoteOnly || false);

          await prisma.userPreferences.upsert({
            where: { userId },
            update: {
              roles,
              locations,
              experienceLevels,
              jobTypes,
              remoteOnly,
              updatedAt: new Date(),
            },
            create: {
              userId,
              roles,
              locations,
              experienceLevels,
              jobTypes,
              remoteOnly,
            }
          });
        } catch (dbErr) {
          console.error("Error updating user preferences:", dbErr);
        }
      }
    }

    // 3. BUILD FILTER QUERY
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { skills: { hasSome: [search] } } // search skills array directly
      ];
    }

    if (role) {
      // Find matches where role query is in title or skills
      const roleClause = [
        { title: { contains: role, mode: "insensitive" } },
        { skills: { hasSome: [role] } }
      ];
      if (whereClause.OR) {
        whereClause.AND = [
          { OR: whereClause.OR },
          { OR: roleClause }
        ];
        delete whereClause.OR;
      } else {
        whereClause.OR = roleClause;
      }
    }

    if (location) {
      if (location.toLowerCase() === "remote") {
        whereClause.remote = true;
      } else {
        whereClause.location = { contains: location, mode: "insensitive" };
      }
    }

    if (experience) {
      whereClause.experienceLevel = { contains: experience, mode: "insensitive" };
    }

    if (jobType) {
      whereClause.employmentType = { contains: jobType, mode: "insensitive" };
    }

    if (remote === "true") {
      whereClause.remote = true;
    } else if (remote === "false") {
      whereClause.remote = false;
    }

    // 4. FETCH GENERAL JOBS
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.job.count({ where: whereClause }),
    ]);

    // 5. IF NO FILTERS ACTIVE, FETCH CAROUSEL FEEDS
    const hasActiveFilters = !!(search || role || location || experience || jobType || remote === "true");

    let trendingInternships: any[] = [];
    let remoteJobs: any[] = [];
    let topCompanies: any[] = [];
    let recentlyPosted: any[] = [];

    if (!hasActiveFilters) {
      const allDBJobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 100, // Fetch recent pool to filter inside JS for clean categories
      });

      // Filter Trending Internships (Internship experience level or job type)
      trendingInternships = allDBJobs.filter(
        j => (j.experienceLevel?.toLowerCase().includes("intern") || j.employmentType?.toLowerCase().includes("intern"))
      ).slice(0, 10);

      // Filter Remote Opportunities
      remoteJobs = allDBJobs.filter(j => j.remote).slice(0, 10);

      // Filter Top Companies Hiring (One unique job per company)
      const uniqueCompanies = new Set<string>();
      topCompanies = [];
      for (const j of allDBJobs) {
        if (!uniqueCompanies.has(j.company.toLowerCase())) {
          uniqueCompanies.add(j.company.toLowerCase());
          topCompanies.push(j);
          if (topCompanies.length >= 10) break;
        }
      }

      // Filter Recently Posted
      recentlyPosted = allDBJobs.slice(0, 15);
    }

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      trendingInternships,
      remoteJobs,
      topCompanies,
      recentlyPosted
    });
  } catch (error: any) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
