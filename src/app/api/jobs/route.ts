import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";
import { syncJobsInternal } from "@/lib/syncJobs";

export const dynamic = "force-dynamic";

function isValidUrl(urlStr: string) {
  try {
    const url = new URL(urlStr);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function getCompletenessScore(job: any) {
  let score = 0;
  if (job.logoUrl) score += 2;
  if (job.location) score += 1;
  if (job.experienceLevel) score += 1;
  if (job.employmentType) score += 1;
  if (job.skills && job.skills.length > 0) score += 2;
  if (job.salaryMin || job.salaryMax) score += 3;
  return score;
}

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

    // 1. AUTO-SYNC CACHE CHECK (every 6 hours)
    const count = await prisma.job.count();
    let needsSync = count < 30; // lower threshold to trigger auto sync if DB gets cleared

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
        { skills: { hasSome: [search] } }
      ];
    }

    if (role) {
      const roleWords = role.split(/[\s,]+/);
      const roleClauses = roleWords.map(word => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { skills: { hasSome: [word] } }
        ]
      }));
      
      if (whereClause.OR) {
        whereClause.AND = [
          { OR: whereClause.OR },
          ...roleClauses
        ];
        delete whereClause.OR;
      } else {
        whereClause.AND = roleClauses;
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

    // 4. FETCH A LARGER BATCH TO ENFORCE DE-DUPLICATION, COMPLETENESS & LIMIT OF EXACTLY 5-6
    const poolJobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100 // Fetch recent pool to filter and score in JS memory
    });

    // Enforce URL Validation & Deduplication (by title + company case-insensitive)
    const seenTitles = new Set<string>();
    const cleanedJobs: typeof poolJobs = [];

    for (const job of poolJobs) {
      if (!job.applyUrl || !isValidUrl(job.applyUrl)) {
        continue; // Exclude listings without a valid URL
      }

      const uniqueKey = `${job.title.toLowerCase().trim()}@${job.company.toLowerCase().trim()}`;
      if (seenTitles.has(uniqueKey)) {
        continue; // Exclude duplicate listings
      }

      seenTitles.add(uniqueKey);
      cleanedJobs.push(job);
    }

    // Score jobs by completeness
    const scoredJobs = cleanedJobs.map(job => ({
      job,
      score: getCompletenessScore(job),
      timeAge: Date.now() - new Date(job.createdAt).getTime()
    }));

    // Prioritize recency & completeness
    // Primary sort: completeness score (higher is better)
    // Secondary sort: time age (smaller is better/more recent)
    scoredJobs.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeAge - b.timeAge;
    });

    // Slice to exactly 6 jobs (or 5 if 6 aren't available, satisfying exactly 5-6 jobs per selected role)
    const finalJobs = scoredJobs.map(sj => sj.job).slice(0, 6);

    return NextResponse.json({
      jobs: finalJobs,
      total: finalJobs.length
    });
  } catch (error: any) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
