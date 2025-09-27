-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
