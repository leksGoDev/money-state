import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const logLevels: Array<"query" | "info" | "warn" | "error"> = ["error"];

  if (process.env.NODE_ENV === "development") {
    logLevels.push("warn");
  }

  if (process.env.PRISMA_LOG_QUERY === "true") {
    logLevels.push("query");
  }

  return new PrismaClient({
    log: logLevels,
  });
}

export const prisma = globalForPrisma.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
