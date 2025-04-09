/*
  Warnings:

  - Added the required column `pricingType` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('GLOBAL_SINGLE', 'GLOBAL_PACKAGE', 'CLIENT_SINGLE', 'CLIENT_PACKAGE');

-- DropIndex
DROP INDEX "ClientPricing_clientId_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "pricingType" "PricingType" NOT NULL;

-- AlterTable
ALTER TABLE "ClientPricing" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "packageSize" INTEGER,
ADD COLUMN     "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "GlobalPricing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "singlePrice" DECIMAL(65,30) NOT NULL,
    "packagePrice" DECIMAL(65,30),
    "packageSize" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientPricing_clientId_isActive_idx" ON "ClientPricing"("clientId", "isActive");
