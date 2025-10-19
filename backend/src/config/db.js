import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const JWT_SECRET = process.env.JWT_SECRET || "supersecret_dev_jwt_key";

// Only handle signals for graceful shutdown
const shutdown = async () => {
  try {
    console.log("🛑 Prisma disconnecting due to shutdown...");
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
