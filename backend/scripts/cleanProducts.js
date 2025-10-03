// scripts/cleanProducts.js
import { prisma } from "../src/config/db.js";

async function main() {
  console.log("🧹 Cleaning products...");

  await prisma.orderItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productSize.deleteMany({});
  const deletedProducts = await prisma.product.deleteMany({});

  console.log(`✅ Deleted ${deletedProducts.count} products and related data`);
}

main()
  .catch((e) => {
    console.error("❌ Error cleaning products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
