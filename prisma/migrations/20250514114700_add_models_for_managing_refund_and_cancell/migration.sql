-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'PAYMENT_FAILED';

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'SUPERSEDED_BY_PACKAGE';

-- AlterEnum
ALTER TYPE "PackagePurchaseStatus" ADD VALUE 'REFUNDED';
