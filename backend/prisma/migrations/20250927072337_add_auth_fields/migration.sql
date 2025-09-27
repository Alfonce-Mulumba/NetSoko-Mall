-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "reset_password_expires" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "verification_expires" TIMESTAMP(3);
