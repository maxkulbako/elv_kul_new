import { prisma } from "../../prisma";
import {
  OrderStatus,
  OrderType,
  AppointmentStatus,
  PackagePurchaseStatus,
} from "@prisma/client";
import { addDays } from "date-fns";
import { TxResult } from "@/types";

/**
 * Approves an order and updates the appointment and package purchase statuses.
 *
 * @param orderId - The ID of the order to approve.
 * @returns A promise that resolves to a TxResult object.
 */
export async function approveOrderTx(orderId: string): Promise<TxResult> {
  try {
    await prisma.$transaction(async (tx) => {
      /* ───────────────────── 1. Find order ───────────────────── */
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          appointment: true,
          packagePurchase: {
            include: { packageTemplate: true },
          },
        },
      });

      if (!order) throw new Error("Order not found");
      if (order.status !== OrderStatus.PENDING)
        throw new Error(`Order already ${order.status}`);

      /* ───────────────────── 2. Global order update ───────────────────── */
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.SUCCEEDED,
          paidAt: new Date(),
        },
      });

      /* ────────────── 3-A. SINGLE_SESSION logic ─────────────── */
      if (order.type === OrderType.SINGLE_SESSION) {
        if (!order.appointment) throw new Error("Linked appointment not found");

        if (
          order.appointment.status === AppointmentStatus.PENDING_PAYMENT ||
          order.appointment.status === AppointmentStatus.SCHEDULED
        ) {
          await tx.appointment.update({
            where: { id: order.appointment.id },
            data: { status: AppointmentStatus.PAID },
          });
        }
        return; // end of SINGLE_SESSION
      }

      /* ────────────── 3-B. PACKAGE logic ─────────────── */
      if (order.type === OrderType.PACKAGE) {
        const purchase = order.packagePurchase;
        if (!purchase) throw new Error("Linked packagePurchase not found");
        const template = purchase.packageTemplate;
        if (!template) throw new Error("Package template missing");

        /* 3-B-1. Activate package */
        const start = new Date();
        const end = addDays(start, template.validDays);

        await tx.packagePurchase.update({
          where: { id: purchase.id },
          data: {
            status: PackagePurchaseStatus.ACTIVE,
            startDate: start,
            endDate: end,
            sessionsUsed: 0,
          },
        });

        /* 3-B-2. Find pending appointments that fall into the package's range */
        const pendingAppointments = await tx.appointment.findMany({
          where: {
            clientId: order.userId,
            status: AppointmentStatus.PENDING_PAYMENT,
            date: { gte: start, lte: end },
          },
          orderBy: { date: "asc" },
          include: { order: true },
        });

        let remaining = template.sessionsTotal - purchase.sessionsUsed;

        for (const appt of pendingAppointments) {
          if (remaining <= 0) break;

          /* move payment to package */
          await tx.appointment.update({
            where: { id: appt.id },
            data: {
              status: AppointmentStatus.PAID_FROM_PACKAGE,
              packagePurchaseId: purchase.id,
            },
          });

          /* old order becomes cancelled */
          if (appt.order && appt.order.status === OrderStatus.PENDING) {
            await tx.order.update({
              where: { id: appt.order.id },
              data: { status: OrderStatus.SUPERSEDED_BY_PACKAGE },
            });
          }

          remaining -= 1;
        }

        /* 3-B-3. Write new sessionsUsed */
        await tx.packagePurchase.update({
          where: { id: purchase.id },
          data: {
            sessionsUsed: template.sessionsTotal - remaining,
          },
        });
      }
    });

    return { success: true, message: "Order approved" };
  } catch (err) {
    console.error("approveOrderTx error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
