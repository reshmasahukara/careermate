import { PrismaClient } from "@prisma/client";
import "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const isDbConfigured = (): boolean => {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Database operations will fail if they require a real connection.");
    return false;
  }
  return true;
};
