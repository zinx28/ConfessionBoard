import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ["query", "info", "warn", "error"],
});

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected!");
  } catch (err) {
    console.error("Prisma connection failed:", err);
    process.exit(1);
  }
};
