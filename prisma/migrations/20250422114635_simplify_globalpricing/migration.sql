/*
  Warnings:

  - You are about to drop the column `durationDays` on the `GlobalPricing` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `GlobalPricing` table. All the data in the column will be lost.
  - You are about to drop the column `packagePrice` on the `GlobalPricing` table. All the data in the column will be lost.
  - You are about to drop the column `packageSize` on the `GlobalPricing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalPricing" DROP COLUMN "durationDays",
DROP COLUMN "name",
DROP COLUMN "packagePrice",
DROP COLUMN "packageSize";
