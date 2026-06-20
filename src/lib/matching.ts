export function calculateMatchScore(job: any, userProfile: any) {
  let score = 0;
  const missingSkills: string[] = [];

  // Extract job skills
  const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
  const userSkills = (userProfile.skills || []).map((s: string) => s.toLowerCase());

  // 1. Skills match (40%)
  if (jobSkills.length > 0) {
    let matchedSkillsCount = 0;
    jobSkills.forEach((skill: string) => {
      if (userSkills.some((us: string) => us.includes(skill) || skill.includes(us))) {
        matchedSkillsCount++;
      } else {
        missingSkills.push(skill);
      }
    });
    score += (matchedSkillsCount / jobSkills.length) * 40;
  } else {
    // If job has no specific skills listed, give partial credit so it's not penalized completely
    score += 20; 
  }

  // 2. Experience relevance (30%)
  // Normalize experience levels
  const jobExp = (job.experienceLevel || "").toLowerCase();
  const userExp = (userProfile.experienceLevel || "").toLowerCase();
  
  if (!jobExp || !userExp) {
    score += 15; // default middle ground
  } else if (jobExp.includes(userExp) || userExp.includes(jobExp)) {
    score += 30; // perfect match
  } else if (
    (jobExp.includes("junior") && userExp.includes("mid")) ||
    (jobExp.includes("mid") && userExp.includes("senior"))
  ) {
    score += 15; // partial match, slight overqualification
  } else if (
    (jobExp.includes("senior") && userExp.includes("mid")) ||
    (jobExp.includes("mid") && userExp.includes("junior"))
  ) {
    score += 10; // partial match, slight underqualification
  } else {
    score += 5; 
  }

  // 3. Location preference (15%)
  const jobLocation = (job.location || "").toLowerCase();
  const userLocation = (userProfile.location || "").toLowerCase();
  const isJobRemote = job.remote;

  if (isJobRemote) {
    score += 15; // Remote jobs are a match for everyone
  } else if (jobLocation && userLocation && (jobLocation.includes(userLocation) || userLocation.includes(jobLocation))) {
    score += 15;
  } else {
    score += 5; 
  }

  // 4. ATS score alignment / Contextual match (15%)
  // Use resume parsed text to see if job title/description keywords exist
  const parsedText = (userProfile.resumeParsedText || "").toLowerCase();
  const jobTitle = (job.title || "").toLowerCase();
  
  if (parsedText) {
    const titleWords = jobTitle.split(/[\s,]+/);
    let titleMatch = 0;
    titleWords.forEach((word: string) => {
      if (word.length > 3 && parsedText.includes(word)) {
        titleMatch++;
      }
    });
    
    if (titleWords.length > 0) {
       const titleMatchPercent = Math.min(1, titleMatch / titleWords.length);
       score += titleMatchPercent * 15;
    } else {
      score += 5;
    }
  } else {
    score += 5;
  }

  return {
    matchScore: Math.round(score),
    missingSkills: missingSkills.slice(0, 5) // Return top 5 missing
  };
}
