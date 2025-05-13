-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'COMPLETED_AND_REFUNDED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refundAt" TIMESTAMP(3);
