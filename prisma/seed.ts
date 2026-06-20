import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COMPANIES = [
  { name: "Google", logoUrl: "https://logo.clearbit.com/google.com", industry: "Technology", size: "10,000+" },
  { name: "Microsoft", logoUrl: "https://logo.clearbit.com/microsoft.com", industry: "Technology", size: "10,000+" },
  { name: "Amazon", logoUrl: "https://logo.clearbit.com/amazon.com", industry: "E-Commerce & Cloud", size: "10,000+" },
  { name: "Apple", logoUrl: "https://logo.clearbit.com/apple.com", industry: "Consumer Electronics", size: "10,000+" },
  { name: "Meta", logoUrl: "https://logo.clearbit.com/meta.com", industry: "Social Media", size: "10,000+" },
  { name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", industry: "Entertainment", size: "10,000+" },
  { name: "Adobe", logoUrl: "https://logo.clearbit.com/adobe.com", industry: "Software", size: "10,000+" },
  { name: "Oracle", logoUrl: "https://logo.clearbit.com/oracle.com", industry: "Enterprise Software", size: "10,000+" },
  { name: "Salesforce", logoUrl: "https://logo.clearbit.com/salesforce.com", industry: "Cloud Computing", size: "10,000+" },
  { name: "IBM", logoUrl: "https://logo.clearbit.com/ibm.com", industry: "Information Technology", size: "10,000+" },
  { name: "NVIDIA", logoUrl: "https://logo.clearbit.com/nvidia.com", industry: "Semiconductors", size: "10,000+" },
  { name: "Uber", logoUrl: "https://logo.clearbit.com/uber.com", industry: "Transportation", size: "10,000+" },
  { name: "Airbnb", logoUrl: "https://logo.clearbit.com/airbnb.com", industry: "Hospitality", size: "5,000 - 10,000" },
  { name: "Accenture", logoUrl: "https://logo.clearbit.com/accenture.com", industry: "Consulting", size: "10,000+" },
  { name: "Deloitte", logoUrl: "https://logo.clearbit.com/deloitte.com", industry: "Professional Services", size: "10,000+" },
  { name: "TCS", logoUrl: "https://logo.clearbit.com/tcs.com", industry: "IT Services", size: "10,000+" },
  { name: "Infosys", logoUrl: "https://logo.clearbit.com/infosys.com", industry: "IT Services", size: "10,000+" },
  { name: "Wipro", logoUrl: "https://logo.clearbit.com/wipro.com", industry: "IT Services", size: "10,000+" },
  { name: "Cognizant", logoUrl: "https://logo.clearbit.com/cognizant.com", industry: "IT Services", size: "10,000+" },
  { name: "Capgemini", logoUrl: "https://logo.clearbit.com/capgemini.com", industry: "IT Services", size: "10,000+" }
];

const ROLES = [
  { title: "Frontend Developer", category: "Software Engineering", skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Next.js", "TailwindCSS"], min: 60000, max: 130000 },
  { title: "Backend Developer", category: "Software Engineering", skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "Express", "Docker", "AWS"], min: 70000, max: 150000 },
  { title: "Full Stack Developer", category: "Software Engineering", skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "GraphQL", "Docker"], min: 80000, max: 160000 },
  { title: "React Developer", category: "Software Engineering", skills: ["React", "Redux", "TypeScript", "JavaScript", "HTML", "CSS"], min: 65000, max: 135000 },
  { title: "Node.js Developer", category: "Software Engineering", skills: ["Node.js", "Express", "TypeScript", "MongoDB", "REST APIs"], min: 70000, max: 140000 },
  { title: "Java Developer", category: "Software Engineering", skills: ["Java", "Spring Boot", "Hibernate", "Microservices", "MySQL"], min: 75000, max: 150000 },
  { title: "Python Developer", category: "Software Engineering", skills: ["Python", "Django", "Flask", "PostgreSQL", "REST APIs"], min: 75000, max: 145000 },
  { title: "Mobile Developer", category: "Software Engineering", skills: ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"], min: 70000, max: 145000 },
  { title: "Data Analyst", category: "AI & Data", skills: ["SQL", "Python", "Tableau", "Excel", "Data Visualization", "Power BI"], min: 55000, max: 110000 },
  { title: "Data Scientist", category: "AI & Data", skills: ["Python", "Machine Learning", "SQL", "Pandas", "Scikit-Learn", "R", "TensorFlow"], min: 90000, max: 180000 },
  { title: "Machine Learning Engineer", category: "AI & Data", skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "NLP", "Deep Learning"], min: 100000, max: 200000 },
  { title: "AI Engineer", category: "AI & Data", skills: ["Python", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "PyTorch"], min: 110000, max: 210000 },
  { title: "NLP Engineer", category: "AI & Data", skills: ["Python", "NLP", "PyTorch", "Hugging Face", "Transformers", "Machine Learning"], min: 105000, max: 205000 },
  { title: "Business Analyst", category: "AI & Data", skills: ["SQL", "Business Intelligence", "Excel", "Data Analysis", "Agile", "Tableau"], min: 60000, max: 120000 },
  { title: "DevOps Engineer", category: "Cloud & DevOps", skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Jenkins"], min: 90000, max: 170000 },
  { title: "Cloud Engineer", category: "Cloud & DevOps", skills: ["AWS", "Azure", "GCP", "Linux", "Terraform", "Python"], min: 85000, max: 160000 },
  { title: "Site Reliability Engineer", category: "Cloud & DevOps", skills: ["Linux", "Kubernetes", "AWS", "Python", "Go", "Docker", "Monitoring"], min: 95000, max: 180000 },
  { title: "Cybersecurity Analyst", category: "Security", skills: ["Security", "Network Security", "Linux", "Python", "Information Security", "SIEM"], min: 75000, max: 140000 },
  { title: "Security Engineer", category: "Security", skills: ["Security", "Python", "AWS", "Linux", "Application Security", "Penetration Testing"], min: 90000, max: 170000 },
  { title: "UI/UX Designer", category: "Product & Design", skills: ["Figma", "UI Design", "UX Design", "Wireframing", "Prototyping", "Adobe Creative Suite"], min: 65000, max: 130000 },
  { title: "Product Manager", category: "Product & Design", skills: ["Product Management", "Agile", "Scrum", "Jira", "Roadmapping", "Data Analysis"], min: 90000, max: 180000 },
  { title: "QA Engineer", category: "Testing", skills: ["Testing", "Selenium", "Java", "Python", "Manual Testing", "Automated Testing", "API Testing"], min: 60000, max: 115000 },
  { title: "Automation Test Engineer", category: "Testing", skills: ["Selenium", "Java", "Python", "Cypress", "Automated Testing", "CI/CD"], min: 70000, max: 130000 },
  { title: "Graduate Engineer Trainee", category: "Entry-Level", skills: ["Java", "Python", "C++", "SQL", "HTML", "CSS"], min: 40000, max: 70000 },
  { title: "Software Intern", category: "Entry-Level", skills: ["JavaScript", "Python", "HTML", "CSS", "Git"], min: 20000, max: 40000 },
  { title: "Data Analyst Intern", category: "Entry-Level", skills: ["SQL", "Excel", "Python", "Data Analysis"], min: 20000, max: 40000 }
];

const LOCATIONS = [
  "Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Delhi NCR", "Gurugram", "Noida",
  "San Francisco", "Seattle", "New York", "Austin", "London", "Berlin", "Singapore", "Toronto", "Sydney", "Dubai",
  "Remote Worldwide", "Remote India", "Hybrid"
];

const EXPERIENCE_LEVELS = ["Entry-Level", "Junior", "Mid", "Senior", "Lead"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = (arr: any[], num: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

async function main() {
  console.log("Starting DB seed for Curated Jobs...");

  for (let i = 0; i < 150; i++) {
    const company = getRandomElement(COMPANIES);
    const role = getRandomElement(ROLES);
    const location = getRandomElement(LOCATIONS);
    
    // Logic to determine level and type based on role
    let experienceLevel = getRandomElement(EXPERIENCE_LEVELS);
    let employmentType = "Full-time";
    
    if (role.title.includes("Intern")) {
      experienceLevel = "Entry-Level";
      employmentType = "Internship";
    } else if (role.title.includes("Lead") || role.title.includes("Manager")) {
      experienceLevel = "Lead";
    } else if (role.title.includes("Senior")) {
      experienceLevel = "Senior";
    } else if (role.title.includes("Junior") || role.title.includes("Trainee")) {
      experienceLevel = "Junior";
    }

    const isRemote = location.includes("Remote");
    
    const salaryMin = Math.floor(Math.random() * (role.max - role.min)) + role.min;
    const salaryMax = salaryMin + Math.floor(Math.random() * 30000) + 10000;

    const jobSkills = getRandomElements(role.skills, Math.min(role.skills.length, 5));

    const externalId = `curated-${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${role.title.toLowerCase().replace(/[^a-z0-9]/g, '')}-${i}`;

    const description = `We are looking for a highly skilled and motivated ${role.title} to join our growing team at ${company.name}. You will be responsible for building innovative solutions and contributing to our mission.`;
    const responsibilities = [
      `Design and develop scalable systems as a ${role.title}.`,
      "Collaborate with cross-functional teams to deliver high-quality products.",
      "Participate in code reviews and maintain code quality.",
      "Stay up-to-date with emerging technologies and industry trends.",
      "Troubleshoot, debug, and upgrade existing software."
    ];
    const benefits = [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Generous paid time off and holidays",
      "Professional development budget"
    ];

    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.job.upsert({
      where: { externalId },
      update: {
        title: role.title,
        company: company.name,
        location,
        description,
        employmentType,
        experienceLevel,
        salaryMin,
        salaryMax,
        remote: isRemote,
        applyUrl: `https://example.com/apply/${externalId}`,
        skills: jobSkills,
        logoUrl: company.logoUrl,
        isCurated: true,
        responsibilities,
        benefits,
        industry: company.industry,
        companySize: company.size,
        companyWebsite: `https://${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        createdAt
      },
      create: {
        externalId,
        title: role.title,
        company: company.name,
        location,
        description,
        employmentType,
        experienceLevel,
        salaryMin,
        salaryMax,
        remote: isRemote,
        applyUrl: `https://example.com/apply/${externalId}`,
        skills: jobSkills,
        logoUrl: company.logoUrl,
        isCurated: true,
        responsibilities,
        benefits,
        industry: company.industry,
        companySize: company.size,
        companyWebsite: `https://${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        createdAt
      }
    });
  }

  console.log("Successfully seeded 150 curated jobs into the database.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
