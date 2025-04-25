/*
  Warnings:

  - You are about to drop the column `isBooked` on the `AvailableSlot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `AvailableSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AvailableSlot" DROP COLUMN "isBooked";

-- CreateIndex
CREATE UNIQUE INDEX "AvailableSlot_appointmentId_key" ON "AvailableSlot"("appointmentId");
