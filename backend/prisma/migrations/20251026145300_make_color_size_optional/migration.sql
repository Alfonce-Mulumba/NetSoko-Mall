/*
  Warnings:

  - You are about to drop the column `color` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the `MpesaPayment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,productId,colorId,sizeId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."MpesaPayment" DROP CONSTRAINT "MpesaPayment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MpesaPayment" DROP CONSTRAINT "MpesaPayment_userId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN     "colorId" TEXT,
ADD COLUMN     "sizeId" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- DropTable
DROP TABLE "public"."MpesaPayment";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productId_colorId_sizeId_key" ON "Cart"("userId", "productId", "colorId", "sizeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
