-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "stock" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
