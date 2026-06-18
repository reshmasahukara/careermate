const fs = require('fs');

const roles = [
  'Senior Frontend Engineer', 'Backend Developer', 'Full Stack Engineer', 'Data Scientist', 'DevOps Engineer',
  'Product Manager', 'UX Designer', 'Machine Learning Engineer', 'Security Analyst', 'Cloud Architect',
  'iOS Developer', 'Android Developer', 'Blockchain Engineer', 'Data Analyst', 'Systems Engineer',
  'Technical Lead', 'QA Automation Engineer', 'Site Reliability Engineer', 'Database Administrator', 'Network Engineer',
  'AI Researcher', 'Game Developer', 'Embedded Systems Engineer', 'Security Engineer', 'Solutions Architect',
  'Technical Writer', 'Scrum Master', 'IT Support Specialist', 'Marketing Analytics Manager', 'Sales Engineer'
];

let paths = [];

for (let i = 1; i <= 30; i++) {
  paths.push({
    id: 'cp-' + i,
    userId: 'demo-user-123',
    targetRole: roles[i - 1],
    description: 'A comprehensive career path focusing on core skills, advanced techniques, and practical projects to master the ' + roles[i - 1] + ' role.',
    roadmapData: JSON.stringify([
      {
        week: 1,
        title: "Foundations & Basics",
        description: "Master the fundamental concepts and basic tools required.",
        status: "completed",
        resourceId: "lr-1",
      },
      {
        week: 2,
        title: "Intermediate Concepts",
        description: "Dive into intermediate workflows and patterns.",
        status: "in-progress",
        resourceId: "lr-2",
      },
      {
        week: 3,
        title: "Advanced Architecture",
        description: "Learn high-level system design and architecture.",
        status: "pending",
        resourceId: "lr-3",
      },
      {
        week: 4,
        title: "Capstone Project",
        description: "Build a production-ready project to showcase your skills.",
        status: "pending",
        resourceId: "lr-4",
      }
    ]),
    createdAt: new Date("2026-06-12T10:10:00Z")
  });
}

let str = "export const MOCK_CAREER_PATHS: MockCareerPath[] = [\n";
for (let p of paths) {
  str += `  {
    id: "${p.id}",
    userId: "${p.userId}",
    targetRole: "${p.targetRole}",
    description: "${p.description}",
    roadmapData: \`${p.roadmapData}\`,
    createdAt: new Date("2026-06-12T10:10:00Z")
  },\n`;
}
str += "];\n";

fs.writeFileSync('newRoadmaps.txt', str);
console.log('done');
