// backend/src/config/db.js
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// JWT secret (fallback to safe default in dev only)
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret_dev_jwt_key";

// Helper to gracefully shutdown Prisma on process end (optional but production-friendly)
const shutdown = async () => {
  try {
    await prisma.$disconnect();
    // console.log("Prisma disconnected");
  } catch (e) {
    // console.error("Error disconnecting Prisma", e);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
