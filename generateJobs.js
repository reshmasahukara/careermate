const fs = require('fs');
const companies = ['Vercel', 'Stripe', 'OpenAI', 'GitHub', 'Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Spotify'];
const roles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'UX Designer', 'Machine Learning Engineer', 'Security Analyst', 'Cloud Architect'];
const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote'];
const types = ['Full-time', 'Contract', 'Internship'];
const experiences = ['Entry', 'Mid', 'Senior', 'Lead'];
const skillsPool = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Go', 'Figma', 'SQL'];

let jobs = [];
for (let i = 1; i <= 25; i++) {
  jobs.push({
    id: 'job-' + i,
    title: roles[Math.floor(Math.random() * roles.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    type: types[Math.floor(Math.random() * types.length)],
    experience: experiences[Math.floor(Math.random() * experiences.length)],
    salary: '$' + (Math.floor(Math.random() * 50) + 80) + ',000 - $' + (Math.floor(Math.random() * 50) + 150) + ',000',
    description: 'We are looking for a talented individual to join our team.',
    requirements: ['3+ years experience', 'Strong communication skills', 'Problem solving'],
    skills: [skillsPool[Math.floor(Math.random() * skillsPool.length)], skillsPool[Math.floor(Math.random() * skillsPool.length)]],
    applyUrl: 'https://example.com/careers',
    logoUrl: '/logo.png',
    isRemote: Math.random() > 0.5,
    createdAt: new Date("2026-06-15")
  });
}

// Convert jobs to string, handling the Date object correctly
let str = "export const MOCK_JOBS: MockJob[] = [\n";
for (let j of jobs) {
    str += `  {
    id: "${j.id}",
    title: "${j.title}",
    company: "${j.company}",
    location: "${j.location}",
    type: "${j.type}",
    experience: "${j.experience}",
    salary: "${j.salary}",
    description: "${j.description}",
    requirements: ${JSON.stringify(j.requirements)},
    skills: ${JSON.stringify(j.skills)},
    applyUrl: "${j.applyUrl}",
    logoUrl: "${j.logoUrl}",
    isRemote: ${j.isRemote},
    createdAt: new Date("2026-06-15")
  },\n`;
}
str += "];\n";

fs.writeFileSync('newJobs.txt', str);
console.log('done');
