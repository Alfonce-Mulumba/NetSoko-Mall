/*
  Warnings:

  - You are about to drop the column `deliveryAddress` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "deliveryAddress",
ADD COLUMN     "deliveryAddressId" INTEGER;

-- CreateTable
CREATE TABLE "public"."DeliveryAddress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DeliveryAddress" ADD CONSTRAINT "DeliveryAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "public"."DeliveryAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
