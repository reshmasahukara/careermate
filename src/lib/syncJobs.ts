import { prisma } from "./db";
import { seedCuratedCompanies } from "./seedCompanies";

function isValidUrl(urlStr: string) {
  if (!urlStr) return false;
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    const badDomains = ["example.com", "dummy.com", "placeholder.com", "test.com", "localhost"];
    if (badDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function syncJobsInternal() {
  let upsertedCount = 0;
  const errors: string[] = [];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

  // Seed curated companies into the DB
  await seedCuratedCompanies();

  // Load companies for fast matching
  const dbCompanies = await prisma.company.findMany();
  
  function getMatchedCompany(companyName: string) {
    if (!companyName) return null;
    const name = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const comp of dbCompanies) {
      const dbName = comp.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (name.includes(dbName) || dbName.includes(name)) {
        return comp;
      }
    }
    return null;
  }

  // Target Roles to ensure volume
  const targetRoles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "React Developer",
    "Node.js Developer", "Python Developer", "Java Developer", "Mobile Developer",
    "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Engineer",
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "UI/UX Designer",
    "Product Manager", "QA Engineer", "Business Analyst", "Software Engineer Intern"
  ];

  // Helper to process job
  const processJob = async (jobData: any) => {
    let { externalId, title, company, location, description, remote, applyUrl, skills, employmentType, experienceLevel, logoUrl, salaryMin, salaryMax, sourcePlatform } = jobData;
    
    applyUrl = isValidUrl(applyUrl) ? applyUrl : null;
    
    const matchedComp = getMatchedCompany(company);
    const companyCareersUrl = matchedComp?.careersUrl || null;
    const companyId = matchedComp?.id || null;

    if (!applyUrl && !companyCareersUrl) {
      return; // Skip if no valid URLs
    }

    const titleLower = (title || "").toLowerCase();
    if (!experienceLevel || experienceLevel === "Mid Level") {
      if (titleLower.includes("intern") || titleLower.includes("apprentice")) experienceLevel = "Internship";
      else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("associate")) experienceLevel = "Entry Level";
      else if (titleLower.includes("senior") || titleLower.includes("sr.")) experienceLevel = "Senior";
      else if (titleLower.includes("lead") || titleLower.includes("architect") || titleLower.includes("principal")) experienceLevel = "Lead";
      else experienceLevel = "Mid Level";
    }

    try {
      await prisma.job.upsert({
        where: { externalId },
        update: { title, company, location, description, remote, applyUrl: applyUrl || "", companyCareersUrl, companyId, skills, employmentType, experienceLevel, logoUrl, salaryMin, salaryMax, sourcePlatform, expiresAt },
        create: { externalId, title, company, location, description, remote, applyUrl: applyUrl || "", companyCareersUrl, companyId, skills, employmentType, experienceLevel, logoUrl, salaryMin, salaryMax, sourcePlatform, expiresAt }
      });
      upsertedCount++;
    } catch (upsertError) {
      console.error(`Failed to upsert job ${externalId}:`, upsertError);
    }
  };

  // 1. Fetch from Arbeitnow
  try {
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api", { next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      const jobs = data.data || [];
      for (const job of jobs) {
        await processJob({
          externalId: job.slug || `arbeitnow-${job.id || Math.random()}`,
          title: job.title || "Software Engineer",
          company: job.company_name || "Arbeitnow Partner",
          location: job.location || "Remote",
          description: job.description || "No description provided.",
          remote: job.remote || false,
          applyUrl: job.url || "",
          skills: job.tags || [],
          employmentType: (job.job_types && job.job_types.length > 0) ? job.job_types[0] : "Full-time",
          logoUrl: null,
          sourcePlatform: "Arbeitnow"
        });
      }
    }
  } catch (e: any) {
    errors.push(`Arbeitnow API fetch failed: ${e.message}`);
  }

  // 2. Fetch from Remotive (limit to ensure variety)
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=150", { next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      for (const job of (data.jobs || [])) {
        await processJob({
          externalId: `remotive-${job.id}`,
          title: job.title || "Software Engineer",
          company: job.company_name || "Remotive Partner",
          location: job.candidate_required_location || "Remote",
          description: job.description || "No description provided.",
          remote: true,
          applyUrl: job.url || "",
          skills: job.tags || [],
          employmentType: job.job_type || "Full-time",
          logoUrl: job.company_logo || null,
          sourcePlatform: "Remotive"
        });
      }
    }
  } catch (e: any) {
    errors.push(`Remotive API fetch failed: ${e.message}`);
  }

  // 3. JSearch (RapidAPI)
  const jsearchApiKey = process.env.JSEARCH_API_KEY;
  if (jsearchApiKey && jsearchApiKey !== "jsearch-api-key-here") {
    for (const role of targetRoles) {
      try {
        const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role)}&num_pages=2`, {
          headers: {
            "X-RapidAPI-Key": jsearchApiKey,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
          },
          next: { revalidate: 0 }
        });
        if (response.ok) {
          const data = await response.json();
          for (const job of (data.data || [])) {
            await processJob({
              externalId: `jsearch-${job.job_id}`,
              title: job.job_title || role,
              company: job.employer_name || "Partner Company",
              location: `${job.job_city || ""}${job.job_city && job.job_country ? ", " : ""}${job.job_country || ""}` || "Remote",
              description: job.job_description || "No description provided.",
              remote: job.job_is_remote || false,
              applyUrl: job.job_apply_link || "",
              skills: job.job_required_skills || [],
              employmentType: job.job_employment_type || "Full-time",
              logoUrl: job.employer_logo || null,
              salaryMin: job.job_min_salary ? Number(job.job_min_salary) : null,
              salaryMax: job.job_max_salary ? Number(job.job_max_salary) : null,
              sourcePlatform: "JSearch"
            });
          }
        }
      } catch (e: any) {}
    }
  }

  // 4. Adzuna
  const adzunaAppId = process.env.ADZUNA_APP_ID;
  const adzunaAppKey = process.env.ADZUNA_APP_KEY;
  if (adzunaAppId && adzunaAppKey && adzunaAppId !== "adzuna-app-id-here") {
    for (const role of targetRoles) {
      try {
        const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&results_per_page=20&what=${encodeURIComponent(role)}`, { next: { revalidate: 0 } });
        if (response.ok) {
          const data = await response.json();
          for (const item of (data.results || [])) {
            await processJob({
              externalId: `adzuna-${item.id}`,
              title: item.title || role,
              company: item.company?.display_name || "Partner Company",
              location: item.location?.display_name || "Remote",
              description: item.description || "No description provided.",
              remote: item.title.toLowerCase().includes("remote") || item.description.toLowerCase().includes("remote"),
              applyUrl: item.redirect_url || "",
              skills: item.category?.tag ? [item.category.tag] : [],
              employmentType: item.contract_time === "full_time" ? "Full-time" : "Part-time",
              sourcePlatform: "Adzuna",
              salaryMin: item.salary_min ? Math.round(Number(item.salary_min)) : null,
              salaryMax: item.salary_max ? Math.round(Number(item.salary_max)) : null,
            });
          }
        }
      } catch (e: any) {}
    }
  }

  // 5. Cleanup expired and dummy jobs
  try {
    const deleteRes = await prisma.job.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { applyUrl: { contains: "example.com" } },
          { applyUrl: { contains: "dummy.com" } },
          { applyUrl: { contains: "localhost" } },
          { applyUrl: { contains: "test.com" } }
        ]
      }
    });
    console.log(`Deleted ${deleteRes.count} expired/dummy jobs.`);
  } catch (cleanErr: any) {
    errors.push(`Expired job cleanup failed: ${cleanErr.message}`);
  }

  return { upsertedCount, errors };
}
