import { prisma } from "@/lib/prisma";
import { OrderStatus, AppointmentStatus } from "@prisma/client";
import { cancelAppointmentTx } from "./appointment.action";
import { TxResult } from "@/types";
import { auth } from "@/auth";

export async function cancelPendingOrderTx(
  orderId: string,
  opts?: {
    /** true → missing owner check (call from webhook/cron) */
    system?: boolean;
    /** Text for Order.failureReason (ignored if repayUrl) */
    failureReason?: string;
    /** If provided, the order remains PENDING, just write the URL */
    repayUrl?: string;
    /** If full failure – should we cancel the appointment */
    forceCancelAppointment?: boolean;
  },
): Promise<TxResult> {
  if (!orderId) return { success: false, message: "orderId is required" };

  /* ───────────────────────── authorization (for non-system) ─────────────────── */
  if (!opts?.system) {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }
    // Check that this user is the owner of the order
    const owner = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });
    if (owner?.userId !== session.user.id) {
      return { success: false, message: "Forbidden" };
    }
  }

  /* ───────────────────────── main logic ──────────────────────────────── */
  try {
    // get basic info (appointment may be needed later)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { appointment: true },
    });
    if (!order) return { success: false, message: "Order not found" };
    if (order.status !== OrderStatus.PENDING) {
      return {
        success: false,
        message: `Order already ${order.status}, nothing to cancel`,
      };
    }

    /* ---------- 1. transaction on Order ----------------------------------- */
    await prisma.$transaction(async (tx) => {
      if (opts?.repayUrl) {
        /* payment Declined, but WayForPay gives a link to repeat → */
        await tx.order.update({
          where: { id: orderId },
          data: {
            repayUrl: opts.repayUrl,
            failureReason: opts.failureReason ?? null,
            /* status remains PENDING! */
          },
        });
      } else {
        /* usual payment failure → change to FAILED */
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.FAILED,
            failureReason: opts?.failureReason ?? "Payment failed",
          },
        });
      }
    });

    /* ---------- 2. (outside transaction) optionally cancel the appointment ---------- */
    if (
      !opts?.repayUrl && // if allowed to repeat payment – the appointment remains
      opts?.forceCancelAppointment &&
      order.appointment &&
      order.appointment.status === AppointmentStatus.PENDING_PAYMENT
    ) {
      await cancelAppointmentTx(order.appointment.id, {
        cancelledBy: "SYSTEM",
        reason: "PAYMENT_FAILED",
      });
    }

    return { success: true, message: "Order updated successfully" };
  } catch (err) {
    console.error("cancelPendingOrderTx error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
