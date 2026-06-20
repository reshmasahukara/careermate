import { prisma } from "./db";

export async function syncJobsInternal() {
  let upsertedCount = 0;
  const errors: string[] = [];

  // 1. Fetch from Arbeitnow
  try {
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api", { next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      const jobs = data.data || [];
      for (const job of jobs) {
        const externalId = job.slug || `arbeitnow-${job.id || Math.random()}`;
        const title = job.title || "Software Engineer";
        const company = job.company_name || "Arbeitnow Partner";
        const location = job.location || "Remote";
        const description = job.description || "No description provided.";
        const remote = job.remote || false;
        const applyUrl = job.url || "https://www.arbeitnow.com";
        const skills = job.tags || [];
        const employmentType = (job.job_types && job.job_types.length > 0) ? job.job_types[0] : "Full-time";
        
        let experienceLevel = "Mid Level";
        const titleLower = title.toLowerCase();
        if (titleLower.includes("intern") || titleLower.includes("apprentice")) experienceLevel = "Internship";
        else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("associate")) experienceLevel = "Entry Level";
        else if (titleLower.includes("senior") || titleLower.includes("sr.")) experienceLevel = "Senior";
        else if (titleLower.includes("lead") || titleLower.includes("architect") || titleLower.includes("principal")) experienceLevel = "Lead";

        const cleanCompanyName = company.toLowerCase().replace(/[^a-z0-9]/g, "");
        const logoUrl = `https://logo.clearbit.com/${cleanCompanyName}.com` || null;

        await prisma.job.upsert({
          where: { externalId },
          update: { title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl },
          create: { externalId, title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl }
        });
        upsertedCount++;
      }
    } else {
      errors.push(`Arbeitnow API returned status ${response.status}`);
    }
  } catch (e: any) {
    errors.push(`Arbeitnow API fetch failed: ${e.message}`);
  }

  // 2. Fetch from Remotive
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=50", { next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      const jobs = data.jobs || [];
      for (const job of jobs) {
        const externalId = `remotive-${job.id}`;
        const title = job.title || "Software Engineer";
        const company = job.company_name || "Remotive Partner";
        const location = job.candidate_required_location || "Remote";
        const description = job.description || "No description provided.";
        const remote = true;
        const applyUrl = job.url || "https://remotive.com";
        const skills = job.tags || [];
        const employmentType = job.job_type || "Full-time";
        
        let experienceLevel = "Mid Level";
        const titleLower = title.toLowerCase();
        if (titleLower.includes("intern") || titleLower.includes("apprentice")) experienceLevel = "Internship";
        else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("associate")) experienceLevel = "Entry Level";
        else if (titleLower.includes("senior") || titleLower.includes("sr.")) experienceLevel = "Senior";
        else if (titleLower.includes("lead") || titleLower.includes("architect") || titleLower.includes("principal")) experienceLevel = "Lead";

        const logoUrl = job.company_logo || null;

        await prisma.job.upsert({
          where: { externalId },
          update: { title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl },
          create: { externalId, title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl }
        });
        upsertedCount++;
      }
    } else {
      errors.push(`Remotive API returned status ${response.status}`);
    }
  } catch (e: any) {
    errors.push(`Remotive API fetch failed: ${e.message}`);
  }

  // 3. Fetch from JSearch (RapidAPI) if key exists
  const jsearchApiKey = process.env.JSEARCH_API_KEY;
  if (jsearchApiKey && jsearchApiKey !== "jsearch-api-key-here") {
    try {
      const response = await fetch("https://jsearch.p.rapidapi.com/search?query=Developer&num_pages=1", {
        headers: {
          "X-RapidAPI-Key": jsearchApiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        },
        next: { revalidate: 0 }
      });
      if (response.ok) {
        const data = await response.json();
        const jobs = data.data || [];
        for (const job of jobs) {
          const externalId = `jsearch-${job.job_id}`;
          const title = job.job_title || "Software Engineer";
          const company = job.employer_name || "Partner Company";
          const location = `${job.job_city || ""}${job.job_city && job.job_country ? ", " : ""}${job.job_country || ""}` || "Remote";
          const description = job.job_description || "No description provided.";
          const remote = job.job_is_remote || false;
          const applyUrl = job.job_apply_link || "https://google.com";
          const skills = job.job_required_skills || [];
          const employmentType = job.job_employment_type || "Full-time";
          
          let experienceLevel = "Mid Level";
          const titleLower = title.toLowerCase();
          if (titleLower.includes("intern") || titleLower.includes("apprentice")) experienceLevel = "Internship";
          else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("associate")) experienceLevel = "Entry Level";
          else if (titleLower.includes("senior") || titleLower.includes("sr.")) experienceLevel = "Senior";
          else if (titleLower.includes("lead") || titleLower.includes("architect") || titleLower.includes("principal")) experienceLevel = "Lead";

          const logoUrl = job.employer_logo || null;
          const salaryMin = job.job_min_salary ? Number(job.job_min_salary) : null;
          const salaryMax = job.job_max_salary ? Number(job.job_max_salary) : null;

          await prisma.job.upsert({
            where: { externalId },
            update: { title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl, salaryMin, salaryMax },
            create: { externalId, title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl, salaryMin, salaryMax }
          });
          upsertedCount++;
        }
      } else {
        errors.push(`JSearch API returned status ${response.status}`);
      }
    } catch (e: any) {
      errors.push(`JSearch API fetch failed: ${e.message}`);
    }
  }

  return { upsertedCount, errors };
}
