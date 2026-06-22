import { prisma } from "./db";

export const CURATED_COMPANIES = [
  // TECH GIANTS
  { name: "Google", logoUrl: "https://logo.clearbit.com/google.com", careersUrl: "https://careers.google.com", industry: "Technology", companySize: "100,000+", headquarters: "Mountain View, CA", remoteFriendly: true },
  { name: "Microsoft", logoUrl: "https://logo.clearbit.com/microsoft.com", careersUrl: "https://careers.microsoft.com", industry: "Technology", companySize: "100,000+", headquarters: "Redmond, WA", remoteFriendly: true },
  { name: "Amazon", logoUrl: "https://logo.clearbit.com/amazon.com", careersUrl: "https://www.amazon.jobs", industry: "E-commerce & Cloud", companySize: "1,000,000+", headquarters: "Seattle, WA", remoteFriendly: true },
  { name: "Apple", logoUrl: "https://logo.clearbit.com/apple.com", careersUrl: "https://jobs.apple.com", industry: "Technology", companySize: "100,000+", headquarters: "Cupertino, CA", remoteFriendly: false },
  { name: "Meta", logoUrl: "https://logo.clearbit.com/meta.com", careersUrl: "https://www.metacareers.com", industry: "Technology", companySize: "80,000+", headquarters: "Menlo Park, CA", remoteFriendly: true },
  { name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", careersUrl: "https://jobs.netflix.com", industry: "Entertainment", companySize: "10,000+", headquarters: "Los Gatos, CA", remoteFriendly: true },
  { name: "Adobe", logoUrl: "https://logo.clearbit.com/adobe.com", careersUrl: "https://careers.adobe.com", industry: "Software", companySize: "20,000+", headquarters: "San Jose, CA", remoteFriendly: true },
  { name: "Oracle", logoUrl: "https://logo.clearbit.com/oracle.com", careersUrl: "https://careers.oracle.com", industry: "Software", companySize: "100,000+", headquarters: "Austin, TX", remoteFriendly: true },
  { name: "Salesforce", logoUrl: "https://logo.clearbit.com/salesforce.com", careersUrl: "https://careers.salesforce.com", industry: "Software", companySize: "70,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "IBM", logoUrl: "https://logo.clearbit.com/ibm.com", careersUrl: "https://www.ibm.com/careers", industry: "Technology", companySize: "250,000+", headquarters: "Armonk, NY", remoteFriendly: true },
  { name: "NVIDIA", logoUrl: "https://logo.clearbit.com/nvidia.com", careersUrl: "https://www.nvidia.com/en-us/about-nvidia/careers", industry: "Semiconductors", companySize: "20,000+", headquarters: "Santa Clara, CA", remoteFriendly: true },
  { name: "Intel", logoUrl: "https://logo.clearbit.com/intel.com", careersUrl: "https://jobs.intel.com", industry: "Semiconductors", companySize: "100,000+", headquarters: "Santa Clara, CA", remoteFriendly: true },
  { name: "Cisco", logoUrl: "https://logo.clearbit.com/cisco.com", careersUrl: "https://jobs.cisco.com", industry: "Networking", companySize: "80,000+", headquarters: "San Jose, CA", remoteFriendly: true },
  { name: "SAP", logoUrl: "https://logo.clearbit.com/sap.com", careersUrl: "https://jobs.sap.com", industry: "Software", companySize: "100,000+", headquarters: "Walldorf, Germany", remoteFriendly: true },
  { name: "ServiceNow", logoUrl: "https://logo.clearbit.com/servicenow.com", careersUrl: "https://careers.servicenow.com", industry: "Software", companySize: "20,000+", headquarters: "Santa Clara, CA", remoteFriendly: true },
  { name: "VMware", logoUrl: "https://logo.clearbit.com/vmware.com", careersUrl: "https://careers.vmware.com", industry: "Software", companySize: "30,000+", headquarters: "Palo Alto, CA", remoteFriendly: true },

  // PRODUCT COMPANIES
  { name: "Uber", logoUrl: "https://logo.clearbit.com/uber.com", careersUrl: "https://www.uber.com/us/en/careers", industry: "Transportation", companySize: "30,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Airbnb", logoUrl: "https://logo.clearbit.com/airbnb.com", careersUrl: "https://careers.airbnb.com", industry: "Hospitality", companySize: "6,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Spotify", logoUrl: "https://logo.clearbit.com/spotify.com", careersUrl: "https://www.lifeatspotify.com", industry: "Entertainment", companySize: "8,000+", headquarters: "Stockholm, Sweden", remoteFriendly: true },
  { name: "Atlassian", logoUrl: "https://logo.clearbit.com/atlassian.com", careersUrl: "https://www.atlassian.com/company/careers", industry: "Software", companySize: "10,000+", headquarters: "Sydney, Australia", remoteFriendly: true },
  { name: "Dropbox", logoUrl: "https://logo.clearbit.com/dropbox.com", careersUrl: "https://jobs.dropbox.com", industry: "Software", companySize: "3,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Stripe", logoUrl: "https://logo.clearbit.com/stripe.com", careersUrl: "https://stripe.com/jobs", industry: "FinTech", companySize: "7,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "PayPal", logoUrl: "https://logo.clearbit.com/paypal.com", careersUrl: "https://careers.pypl.com", industry: "FinTech", companySize: "25,000+", headquarters: "San Jose, CA", remoteFriendly: true },
  { name: "Pinterest", logoUrl: "https://logo.clearbit.com/pinterest.com", careersUrl: "https://www.pinterestcareers.com", industry: "Social Media", companySize: "4,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "LinkedIn", logoUrl: "https://logo.clearbit.com/linkedin.com", careersUrl: "https://careers.linkedin.com", industry: "Technology", companySize: "20,000+", headquarters: "Sunnyvale, CA", remoteFriendly: true },
  { name: "Canva", logoUrl: "https://logo.clearbit.com/canva.com", careersUrl: "https://www.canva.com/careers", industry: "Design", companySize: "4,000+", headquarters: "Sydney, Australia", remoteFriendly: true },
  { name: "Figma", logoUrl: "https://logo.clearbit.com/figma.com", careersUrl: "https://www.figma.com/careers", industry: "Design", companySize: "1,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Notion", logoUrl: "https://logo.clearbit.com/notion.so", careersUrl: "https://www.notion.so/careers", industry: "Software", companySize: "500+", headquarters: "San Francisco, CA", remoteFriendly: true },

  // AI & CLOUD
  { name: "OpenAI", logoUrl: "https://logo.clearbit.com/openai.com", careersUrl: "https://openai.com/careers", industry: "Artificial Intelligence", companySize: "1,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Anthropic", logoUrl: "https://logo.clearbit.com/anthropic.com", careersUrl: "https://www.anthropic.com/careers", industry: "Artificial Intelligence", companySize: "500+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Databricks", logoUrl: "https://logo.clearbit.com/databricks.com", careersUrl: "https://www.databricks.com/company/careers", industry: "Cloud", companySize: "5,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Snowflake", logoUrl: "https://logo.clearbit.com/snowflake.com", careersUrl: "https://careers.snowflake.com", industry: "Cloud", companySize: "6,000+", headquarters: "Bozeman, MT", remoteFriendly: true },
  { name: "MongoDB", logoUrl: "https://logo.clearbit.com/mongodb.com", careersUrl: "https://www.mongodb.com/careers", industry: "Database", companySize: "4,000+", headquarters: "New York, NY", remoteFriendly: true },
  { name: "Elastic", logoUrl: "https://logo.clearbit.com/elastic.co", careersUrl: "https://www.elastic.co/about/careers", industry: "Software", companySize: "3,000+", headquarters: "Mountain View, CA", remoteFriendly: true },
  { name: "Cloudflare", logoUrl: "https://logo.clearbit.com/cloudflare.com", careersUrl: "https://www.cloudflare.com/careers", industry: "Cloud Security", companySize: "3,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "DigitalOcean", logoUrl: "https://logo.clearbit.com/digitalocean.com", careersUrl: "https://www.digitalocean.com/careers", industry: "Cloud", companySize: "1,000+", headquarters: "New York, NY", remoteFriendly: true },
  { name: "Confluent", logoUrl: "https://logo.clearbit.com/confluent.io", careersUrl: "https://careers.confluent.io", industry: "Cloud", companySize: "2,000+", headquarters: "Mountain View, CA", remoteFriendly: true },
  { name: "Hugging Face", logoUrl: "https://logo.clearbit.com/huggingface.co", careersUrl: "https://huggingface.co/careers", industry: "Artificial Intelligence", companySize: "200+", headquarters: "New York, NY", remoteFriendly: true },

  // INDIAN PRODUCT COMPANIES
  { name: "Flipkart", logoUrl: "https://logo.clearbit.com/flipkart.com", careersUrl: "https://www.flipkartcareers.com", industry: "E-commerce", companySize: "30,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "Meesho", logoUrl: "https://logo.clearbit.com/meesho.com", careersUrl: "https://meesho.io/careers", industry: "E-commerce", companySize: "1,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "Swiggy", logoUrl: "https://logo.clearbit.com/swiggy.com", careersUrl: "https://careers.swiggy.com", industry: "Food Tech", companySize: "5,000+", headquarters: "Bengaluru, India", remoteFriendly: false },
  { name: "Zomato", logoUrl: "https://logo.clearbit.com/zomato.com", careersUrl: "https://www.zomato.com/careers", industry: "Food Tech", companySize: "5,000+", headquarters: "Gurugram, India", remoteFriendly: false },
  { name: "Razorpay", logoUrl: "https://logo.clearbit.com/razorpay.com", careersUrl: "https://razorpay.com/jobs", industry: "FinTech", companySize: "3,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "PhonePe", logoUrl: "https://logo.clearbit.com/phonepe.com", careersUrl: "https://www.phonepe.com/careers", industry: "FinTech", companySize: "5,000+", headquarters: "Bengaluru, India", remoteFriendly: false },
  { name: "Paytm", logoUrl: "https://logo.clearbit.com/paytm.com", careersUrl: "https://jobs.paytm.com", industry: "FinTech", companySize: "10,000+", headquarters: "Noida, India", remoteFriendly: false },
  { name: "CRED", logoUrl: "https://logo.clearbit.com/cred.club", careersUrl: "https://careers.cred.club", industry: "FinTech", companySize: "1,000+", headquarters: "Bengaluru, India", remoteFriendly: false },
  { name: "Myntra", logoUrl: "https://logo.clearbit.com/myntra.com", careersUrl: "https://careers.myntra.com", industry: "E-commerce", companySize: "5,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "Freshworks", logoUrl: "https://logo.clearbit.com/freshworks.com", careersUrl: "https://www.freshworks.com/company/careers", industry: "Software", companySize: "5,000+", headquarters: "San Mateo, CA", remoteFriendly: true },
  { name: "Zoho", logoUrl: "https://logo.clearbit.com/zoho.com", careersUrl: "https://www.zoho.com/careers", industry: "Software", companySize: "15,000+", headquarters: "Chennai, India", remoteFriendly: false },
  { name: "Dream11", logoUrl: "https://logo.clearbit.com/dream11.com", careersUrl: "https://www.dreamsports.group/careers", industry: "Gaming", companySize: "1,000+", headquarters: "Mumbai, India", remoteFriendly: true },
  { name: "ShareChat", logoUrl: "https://logo.clearbit.com/sharechat.com", careersUrl: "https://careers.sharechat.com", industry: "Social Media", companySize: "1,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "Upstox", logoUrl: "https://logo.clearbit.com/upstox.com", careersUrl: "https://upstox.com/careers", industry: "FinTech", companySize: "1,000+", headquarters: "Mumbai, India", remoteFriendly: true },
  { name: "Groww", logoUrl: "https://logo.clearbit.com/groww.in", careersUrl: "https://groww.in/careers", industry: "FinTech", companySize: "1,000+", headquarters: "Bengaluru, India", remoteFriendly: true },

  // IT SERVICES & CONSULTING
  { name: "Accenture", logoUrl: "https://logo.clearbit.com/accenture.com", careersUrl: "https://www.accenture.com/careers", industry: "IT Services", companySize: "700,000+", headquarters: "Dublin, Ireland", remoteFriendly: true },
  { name: "Deloitte", logoUrl: "https://logo.clearbit.com/deloitte.com", careersUrl: "https://careers.deloitte.com", industry: "Consulting", companySize: "400,000+", headquarters: "London, UK", remoteFriendly: true },
  { name: "Capgemini", logoUrl: "https://logo.clearbit.com/capgemini.com", careersUrl: "https://www.capgemini.com/careers", industry: "IT Services", companySize: "350,000+", headquarters: "Paris, France", remoteFriendly: true },
  { name: "Cognizant", logoUrl: "https://logo.clearbit.com/cognizant.com", careersUrl: "https://careers.cognizant.com", industry: "IT Services", companySize: "300,000+", headquarters: "Teaneck, NJ", remoteFriendly: true },
  { name: "Infosys", logoUrl: "https://logo.clearbit.com/infosys.com", careersUrl: "https://www.infosys.com/careers", industry: "IT Services", companySize: "300,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "TCS", logoUrl: "https://logo.clearbit.com/tcs.com", careersUrl: "https://www.tcs.com/careers", industry: "IT Services", companySize: "600,000+", headquarters: "Mumbai, India", remoteFriendly: true },
  { name: "Wipro", logoUrl: "https://logo.clearbit.com/wipro.com", careersUrl: "https://careers.wipro.com", industry: "IT Services", companySize: "250,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "HCLTech", logoUrl: "https://logo.clearbit.com/hcltech.com", careersUrl: "https://www.hcltech.com/careers", industry: "IT Services", companySize: "220,000+", headquarters: "Noida, India", remoteFriendly: true },
  { name: "Tech Mahindra", logoUrl: "https://logo.clearbit.com/techmahindra.com", careersUrl: "https://careers.techmahindra.com", industry: "IT Services", companySize: "150,000+", headquarters: "Pune, India", remoteFriendly: true },
  { name: "LTIMindtree", logoUrl: "https://logo.clearbit.com/ltimindtree.com", careersUrl: "https://www.ltimindtree.com/careers", industry: "IT Services", companySize: "80,000+", headquarters: "Mumbai, India", remoteFriendly: true },
  { name: "Mphasis", logoUrl: "https://logo.clearbit.com/mphasis.com", careersUrl: "https://www.mphasis.com/home/careers", industry: "IT Services", companySize: "35,000+", headquarters: "Bengaluru, India", remoteFriendly: true },
  { name: "Persistent Systems", logoUrl: "https://logo.clearbit.com/persistent.com", careersUrl: "https://careers.persistent.com", industry: "IT Services", companySize: "20,000+", headquarters: "Pune, India", remoteFriendly: true },

  // FINANCE & FINTECH
  { name: "JPMorgan Chase", logoUrl: "https://logo.clearbit.com/jpmorganchase.com", careersUrl: "https://careers.jpmorgan.com", industry: "Finance", companySize: "250,000+", headquarters: "New York, NY", remoteFriendly: false },
  { name: "Goldman Sachs", logoUrl: "https://logo.clearbit.com/goldmansachs.com", careersUrl: "https://www.goldmansachs.com/careers", industry: "Finance", companySize: "40,000+", headquarters: "New York, NY", remoteFriendly: false },
  { name: "Morgan Stanley", logoUrl: "https://logo.clearbit.com/morganstanley.com", careersUrl: "https://www.morganstanley.com/people-opportunities", industry: "Finance", companySize: "80,000+", headquarters: "New York, NY", remoteFriendly: false },
  { name: "American Express", logoUrl: "https://logo.clearbit.com/americanexpress.com", careersUrl: "https://aexp.eightfold.ai/careers", industry: "Finance", companySize: "70,000+", headquarters: "New York, NY", remoteFriendly: true },
  { name: "Visa", logoUrl: "https://logo.clearbit.com/visa.com", careersUrl: "https://www.visa.com/careers", industry: "Finance", companySize: "25,000+", headquarters: "San Francisco, CA", remoteFriendly: true },
  { name: "Mastercard", logoUrl: "https://logo.clearbit.com/mastercard.com", careersUrl: "https://careers.mastercard.com", industry: "Finance", companySize: "25,000+", headquarters: "Purchase, NY", remoteFriendly: true },
  { name: "BlackRock", logoUrl: "https://logo.clearbit.com/blackrock.com", careersUrl: "https://careers.blackrock.com", industry: "Finance", companySize: "15,000+", headquarters: "New York, NY", remoteFriendly: false },
  { name: "HSBC", logoUrl: "https://logo.clearbit.com/hsbc.com", careersUrl: "https://www.hsbc.com/careers", industry: "Finance", companySize: "200,000+", headquarters: "London, UK", remoteFriendly: false },
  { name: "Barclays", logoUrl: "https://logo.clearbit.com/barclays.com", careersUrl: "https://search.jobs.barclays", industry: "Finance", companySize: "80,000+", headquarters: "London, UK", remoteFriendly: false },

  // CYBERSECURITY
  { name: "Palo Alto Networks", logoUrl: "https://logo.clearbit.com/paloaltonetworks.com", careersUrl: "https://jobs.paloaltonetworks.com", industry: "Cybersecurity", companySize: "10,000+", headquarters: "Santa Clara, CA", remoteFriendly: true },
  { name: "CrowdStrike", logoUrl: "https://logo.clearbit.com/crowdstrike.com", careersUrl: "https://www.crowdstrike.com/careers", industry: "Cybersecurity", companySize: "5,000+", headquarters: "Austin, TX", remoteFriendly: true },
  { name: "Fortinet", logoUrl: "https://logo.clearbit.com/fortinet.com", careersUrl: "https://www.fortinet.com/corporate/careers", industry: "Cybersecurity", companySize: "10,000+", headquarters: "Sunnyvale, CA", remoteFriendly: false },
  { name: "Zscaler", logoUrl: "https://logo.clearbit.com/zscaler.com", careersUrl: "https://www.zscaler.com/careers", industry: "Cybersecurity", companySize: "5,000+", headquarters: "San Jose, CA", remoteFriendly: true },
  { name: "Okta", logoUrl: "https://logo.clearbit.com/okta.com", careersUrl: "https://www.okta.com/company/careers", industry: "Cybersecurity", companySize: "5,000+", headquarters: "San Francisco, CA", remoteFriendly: true }
];

export async function seedCuratedCompanies() {
  let seededCount = 0;
  for (const comp of CURATED_COMPANIES) {
    try {
      await prisma.company.upsert({
        where: { name: comp.name },
        update: {
          logoUrl: comp.logoUrl,
          careersUrl: comp.careersUrl,
          industry: comp.industry,
          companySize: comp.companySize,
          headquarters: comp.headquarters,
          remoteFriendly: comp.remoteFriendly
        },
        create: {
          name: comp.name,
          logoUrl: comp.logoUrl,
          careersUrl: comp.careersUrl,
          industry: comp.industry,
          companySize: comp.companySize,
          headquarters: comp.headquarters,
          remoteFriendly: comp.remoteFriendly
        }
      });
      seededCount++;
    } catch (e) {
      console.error(`Failed to seed company ${comp.name}:`, e);
    }
  }
  console.log(`Seeded ${seededCount} curated companies.`);
  return seededCount;
}
