/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `pricingType` on the `Appointment` table. All the data in the column will be lost.
  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `templateId` on the `PackagePurchase` table. All the data in the column will be lost.
  - The `status` column on the `PackagePurchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[orderId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `PackagePurchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `packageTemplateId` to the `PackagePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionsTotal` to the `PackagePurchase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'PENDING_PAYMENT', 'PAID', 'PAID_FROM_PACKAGE', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "PackagePurchaseStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('PACKAGE', 'SINGLE_SESSION');

-- DropForeignKey
ALTER TABLE "PackagePurchase" DROP CONSTRAINT "PackagePurchase_templateId_fkey";

-- DropIndex
DROP INDEX "Appointment_packagePurchaseId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "paymentStatus",
DROP COLUMN "price",
DROP COLUMN "pricingType",
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "priceApplied" DECIMAL(65,30),
DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "PackagePurchase" DROP COLUMN "templateId",
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "packageTemplateId" TEXT NOT NULL,
ADD COLUMN     "sessionsTotal" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PackagePurchaseStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientSpecialPrice" DECIMAL(65,30);

-- DropEnum
DROP TYPE "SessionStatus";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "OrderType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_orderId_key" ON "Appointment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PackagePurchase_orderId_key" ON "PackagePurchase"("orderId");

-- CreateIndex
CREATE INDEX "PackagePurchase_clientId_status_idx" ON "PackagePurchase"("clientId", "status");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePurchase" ADD CONSTRAINT "PackagePurchase_packageTemplateId_fkey" FOREIGN KEY ("packageTemplateId") REFERENCES "PackageTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePurchase" ADD CONSTRAINT "PackagePurchase_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
