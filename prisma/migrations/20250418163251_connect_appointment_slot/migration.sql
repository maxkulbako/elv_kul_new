/*
  Warnings:

  - A unique constraint covering the columns `[availableSlotId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AvailableSlot" DROP CONSTRAINT "AvailableSlot_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "availableSlotId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_availableSlotId_key" ON "Appointment"("availableSlotId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_availableSlotId_fkey" FOREIGN KEY ("availableSlotId") REFERENCES "AvailableSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
