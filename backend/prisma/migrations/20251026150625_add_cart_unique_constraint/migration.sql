/*
  Warnings:

  - The `colorId` column on the `Cart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sizeId` column on the `Cart` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "colorId",
ADD COLUMN     "colorId" INTEGER,
DROP COLUMN "sizeId",
ADD COLUMN     "sizeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productId_colorId_sizeId_key" ON "Cart"("userId", "productId", "colorId", "sizeId");
