import { prisma } from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@netsoko.com" },
    update: {},
    create: {
      name: "Default Admin",
      email: "admin@netsoko.com",
      phone: "+254700000000",
      password: hashedPassword,
      role: "admin",
      is_verified: true,
    },
  });

  console.log("🌱 Seed completed.");
}