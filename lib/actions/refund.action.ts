import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PackagePurchaseStatus,
  AppointmentStatus,
  OrderType,
} from "@prisma/client";
import { getSingleSessionPrice } from "@/lib/utils/getSingleSessionPrice"; // ← невеликий helper (див. нижче)
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { TxResult } from "@/types";

/**
 * Marks Order as REFUNDED and correctly converts all related sessions.
 *
 *  1. Order              →  REFUNDED
 *  2. PackagePurchase    →  REFUNDED
 *  3. Appointment’s
 *     • COMPLETED → COMPLETED_AND_REFUNDED
 *     • PAID_FROM_PACKAGE → PENDING_PAYMENT + new SINGLE_SESSION Order
 *
 * All is executed atomically within a single transaction.
 */
export async function refundPackageOrderTx(
  orderId: string,
  opts?: { reason?: string; system?: boolean },
): Promise<TxResult> {
  if (!orderId) return { success: false, message: "orderId is required" };

  try {
    return await prisma.$transaction(async (tx) => {
      /* ──────────────────────────────────────────
           1. Load Order + PackagePurchase + Appointment’s
        ────────────────────────────────────────── */
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          packagePurchase: {
            include: {
              appointmentsUsedIn: true,
            },
          },
        },
      });

      // basic validations
      if (!order) return { success: false, message: "Order not found" };
      if (order.type !== OrderType.PACKAGE)
        return { success: false, message: "Order is not of type PACKAGE" };

      // already REFUNDED?
      if (order.status === OrderStatus.REFUNDED)
        return { success: true, message: "Order already refunded" };

      /* ──────────────────────────────────────────
           2. Update Order
        ────────────────────────────────────────── */
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.REFUNDED,
          refundAt: new Date(),
          refundReason: opts?.reason ?? "PACKAGE_REFUND",
        },
      });

      /* ──────────────────────────────────────────
           3. Update PackagePurchase
        ────────────────────────────────────────── */
      const packagePurchase = order.packagePurchase;
      if (!packagePurchase)
        throw new Error(`PackagePurchase for order ${orderId} not found`);

      await tx.packagePurchase.update({
        where: { id: packagePurchase.id },
        data: {
          status: PackagePurchaseStatus.REFUNDED,
        },
      });

      /* ──────────────────────────────────────────
           4. Process each appointment
        ────────────────────────────────────────── */
      for (const appt of packagePurchase.appointmentsUsedIn) {
        // a) already completed → mark as COMPLETED_AND_REFUNDED
        if (appt.status === AppointmentStatus.COMPLETED) {
          await tx.appointment.update({
            where: { id: appt.id },
            data: { status: AppointmentStatus.COMPLETED_AND_REFUNDED },
          });
          continue;
        } else if (appt.status === AppointmentStatus.PAID_FROM_PACKAGE) {
          // b) future or awaiting payment → convert back to PENDING_PAYMENT

          //  i. determine the price of a single session
          const singlePrice = await getSingleSessionPrice(tx, appt.clientId);

          // ii. create a new Order for the session
          const newOrder = await tx.order.create({
            data: {
              userId: appt.clientId,
              type: OrderType.SINGLE_SESSION,
              amount: singlePrice,
              currency: "UAH",
              status: OrderStatus.PENDING,
              appointment: { connect: { id: appt.id } },
            },
          });

          // iii. update appointment
          await tx.appointment.update({
            where: { id: appt.id },
            data: {
              status: AppointmentStatus.PENDING_PAYMENT,
              packagePurchaseId: null,
              priceApplied: singlePrice,
              orderId: newOrder.id,
            },
          });
        }
      }

      /* ──────────────────────────────────────────
           5. Revalidate UI (можна винести поза транзакцію – тут ОК)
        ────────────────────────────────────────── */
      revalidatePath("/client/appointments");
      revalidatePath("/client/orders");

      return {
        success: true,
        message: `Package refunded. Processed ${packagePurchase.appointmentsUsedIn.length} appointments`,
      };
    });
  } catch (err) {
    console.error("refundOrderTx error:", err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Unexpected error during refund",
    };
  }
}

/**
 * Returns the money for a single session.
 * Works only with Order.type === SINGLE_SESSION && status === SUCCEEDED.
 *
 * 1. Order → REFUNDED, sets refundAt + reason
 * 2. Appointment:
 *    • if already COMPLETED → COMPLETED_AND_REFUNDED
 *    • otherwise → CANCELLED
 * 3. Releases the availableSlot if it was reserved
 */

export async function refundSingleSessionTx(
  orderId: string,
  opts?: { reason?: string; system?: boolean },
): Promise<TxResult> {
  try {
    // ── 1. Get order + appointment ────────────────────────────────────────────
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        appointment: { include: { availableSlot: true } },
      },
    });

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    // ── 2. Checks for permission / status ──────────────────────────────────────────────
    if (order.type !== "SINGLE_SESSION") {
      return { success: false, message: "Not a single-session order" };
    }
    if (order.status !== "SUCCEEDED") {
      return { success: false, message: "Order is not in SUCCEEDED status" };
    }

    if (!opts?.system) {
      // simple owner check (can be removed if needed)
      const session = await auth();
      if (order.userId !== session?.user?.id) {
        return { success: false, message: "Forbidden" };
      }
    }

    const appointment = order.appointment;
    if (!appointment) {
      // Very unlikely, but let's check
      return { success: false, message: "Linked appointment not found" };
    }

    // ── 3. Transaction ────────────────────────────────────────────────────────────
    await prisma.$transaction(async (tx) => {
      // 3.1 Order → REFUNDED
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.REFUNDED,
          refundAt: new Date(),
          refundReason: opts?.reason ?? null,
        },
      });

      // 3.2 Determine the new status for Appointment
      const newApptStatus: AppointmentStatus =
        appointment.status === AppointmentStatus.COMPLETED
          ? AppointmentStatus.COMPLETED_AND_REFUNDED
          : AppointmentStatus.CANCELLED;

      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: newApptStatus,
          availableSlotId: null,
          updatedAt: new Date(),
        },
      });

      // 3.3 Release the slot if it was reserved
      if (appointment.availableSlotId) {
        await tx.availableSlot.update({
          where: { id: appointment.availableSlotId },
          data: { appointmentId: null },
        });
      }
    });

    return { success: true, message: "Refund processed successfully" };
  } catch (err) {
    console.error("refundSingleSessionTx error:", err);
    return { success: false, message: "Refund failed" };
  }
}
