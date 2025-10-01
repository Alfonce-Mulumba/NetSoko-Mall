import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const JWT_SECRET = process.env.JWT_SECRET || "supersecret_dev_jwt_key";

const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } catch (e) {
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
