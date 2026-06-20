import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

// Force edge/serverless runtime logic
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    // Verify cron secret if in production
    const authHeader = request.headers.get("authorization");
    if (
      process.env.NODE_ENV === "production" &&
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch jobs from Arbeitnow API
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (!response.ok) {
      throw new Error(`Failed to fetch from Arbeitnow API: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = data.data;

    let upsertedCount = 0;

    // Process and upsert each job
    for (const job of jobs) {
      // Map Arbeitnow job properties to our schema
      const externalId = job.slug || `arbeitnow-${Date.now()}-${Math.random()}`;
      const title = job.title || "Unknown Title";
      const company = job.company_name || "Unknown Company";
      const location = job.location || "Remote";
      const description = job.description || "No description provided.";
      const remote = job.remote || false;
      const applyUrl = job.url || "#";
      const skills = job.tags || [];
      const employmentType = (job.job_types && job.job_types.length > 0) ? job.job_types[0] : "Full-time";
      
      // Upsert into Neon Postgres
      await prisma.job.upsert({
        where: { externalId },
        update: {
          title,
          company,
          location,
          description,
          remote,
          applyUrl,
          skills,
          employmentType,
        },
        create: {
          externalId,
          title,
          company,
          location,
          description,
          remote,
          applyUrl,
          skills,
          employmentType,
        },
      });
      upsertedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${upsertedCount} jobs from Arbeitnow.`,
    });
  } catch (error: any) {
    console.error("Job sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync jobs" },
      { status: 500 }
    );
  }
}
