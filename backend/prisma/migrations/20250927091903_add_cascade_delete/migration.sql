/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_expires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verification_expires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_OrderProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSize" DROP CONSTRAINT "ProductSize_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrderProducts" DROP CONSTRAINT "_OrderProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrderProducts" DROP CONSTRAINT "_OrderProducts_B_fkey";

-- DropIndex
DROP INDEX "public"."Product_name_key";

-- DropIndex
DROP INDEX "public"."User_phone_key";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "countryCode",
DROP COLUMN "reset_password_expires",
DROP COLUMN "reset_password_token",
DROP COLUMN "verification_expires";

-- DropTable
DROP TABLE "public"."_OrderProducts";

-- CreateTable
CREATE TABLE "public"."OrderProduct" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderProduct" ADD CONSTRAINT "OrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
