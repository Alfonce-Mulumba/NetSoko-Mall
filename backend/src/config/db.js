import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

// ✅ Create Prisma client
export const prisma = new PrismaClient({
  log: ["query", "error", "warn", "info"], // optional: logs all queries and errors
});

// ✅ JWT secret
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret_dev_jwt_key";

// ✅ Graceful shutdown
const shutdown = async (signal) => {
  try {
    console.log(`🛑 Prisma disconnecting due to ${signal || "exit"}...`);
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");
  } catch (e) {
    console.error("❌ Error disconnecting Prisma:", e);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("exit", () => shutdown("exit"));

// ✅ Optional: catch unhandled rejections to prevent silent crashes
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
