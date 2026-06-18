import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Checks if the database URL environment variable is set.
 * If not set, our server actions and endpoints will automatically route
 * database calls to the memory-buffered mock DB to ensure the app is fully functional out-of-the-box.
 */
export const isDbConfigured = (): boolean => {
  return !!process.env.DATABASE_URL;
};
