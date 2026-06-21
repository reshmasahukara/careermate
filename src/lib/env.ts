const requiredEnvs = [
  "DATABASE_URL",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_APP_PASSWORD",
  "NEXT_PUBLIC_APP_URL"
];

export function validateEnv() {
  const missingEnvs = requiredEnvs.filter((envVar) => !process.env[envVar]);

  if (missingEnvs.length > 0) {
    const errorMsg = `❌ Invalid environment variables: Missing ${missingEnvs.join(", ")}`;
    console.error(errorMsg);
    
    // If we are in the build phase (e.g. Vercel deployment), throw to prevent deployment
    if (process.env.npm_lifecycle_event === "build" || process.env.VERCEL) {
      // Don't crash the entire runtime app if Vercel misses vars, but do fail the build
      if (process.env.npm_lifecycle_event === "build") {
        throw new Error(`Missing environment variables: ${missingEnvs.join(", ")}`);
      }
    }
  }
}

// Call it immediately so it runs at startup when imported
validateEnv();
