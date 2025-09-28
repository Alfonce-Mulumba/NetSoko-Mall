// prisma/seed.js
import { prisma } from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  // Default admin
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

  console.log("✅ Admin ready");

  // Running Shoes
  await prisma.product.upsert({
    where: { name: "Running Shoes" },
    update: {},
    create: {
      name: "Running Shoes",
      description: "Comfortable running shoes for daily wear.",
      price: 50,
      stock: 100,
      category: "Shoes",
      images: {
        create: [
          { url: "https://via.placeholder.com/300x300?text=Running+Shoes+1" },
          { url: "https://via.placeholder.com/300x300?text=Running+Shoes+2" },
        ],
      },
      sizes: {
        create: [
          { size: "38", stock: 20 },
          { size: "40", stock: 30 },
          { size: "42", stock: 50 },
        ],
      },
    },
  });

  // Laptop Pro
  await prisma.product.upsert({
    where: { name: "Laptop Pro" },
    update: {},
    create: {
      name: "Laptop Pro",
      description: "High performance laptop.",
      price: 1200,
      stock: 50,
      category: "Laptops",
      images: {
        create: [
          { url: "https://via.placeholder.com/300x300?text=Laptop+Front" },
          { url: "https://via.placeholder.com/300x300?text=Laptop+Side" },
        ],
      },
      sizes: {
        create: [{ size: "15-inch", stock: 25 }, { size: "17-inch", stock: 25 }],
      },
    },
  });

  // Smartphone X
  await prisma.product.upsert({
    where: { name: "Smartphone X" },
    update: {},
    create: {
      name: "Smartphone X",
      description: "Latest smartphone with AI features.",
      price: 800,
      stock: 200,
      category: "Mobile Phones",
      images: {
        create: [
          { url: "https://placehold.com/300x300?text=Smartphone+Front" },
          { url: "https://placehold.com/300x300?text=Smartphone+Back" },
        ],
      },
      sizes: {
        create: [{ size: "128GB", stock: 120 }, { size: "256GB", stock: 80 }],
      },
    },
  });

  console.log("✅ Products with images & sizes seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
