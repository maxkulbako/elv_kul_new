-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "files" TEXT[],
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "telegram" TEXT;
