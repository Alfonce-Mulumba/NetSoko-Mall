// src/config/db.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Create a new Prisma Client
export const prisma = new PrismaClient();

// For JWT secret
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Test the connection
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL with Prisma");
  } catch (err) {
    console.error("❌ Prisma connection error:", err.message);
  }
})();
