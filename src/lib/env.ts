const requiredEnvs = [
  "DATABASE_URL",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_APP_PASSWORD",
  "NEXT_PUBLIC_APP_URL"
];

export function validateEnv() {
  // Skip environment validation during the Next.js static build phase
  if (process.env.npm_lifecycle_event === "build") {
    return;
  }

  const missingEnvs = requiredEnvs.filter((envVar) => !process.env[envVar]);

  if (missingEnvs.length > 0) {
    console.error(
      `❌ Invalid environment variables: Missing ${missingEnvs.join(", ")}`
    );
    throw new Error(`Missing environment variables: ${missingEnvs.join(", ")}`);
  }
}

// Call it immediately so it throws at startup when imported
validateEnv();
