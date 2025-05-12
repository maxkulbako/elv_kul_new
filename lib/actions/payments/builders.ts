import { Decimal } from "@prisma/client/runtime/library";
import type { Order } from "@prisma/client";

export interface ProductArrays {
  names: string[];
  counts: number[];
  prices: Decimal[];
}

export function buildProductArrays(
  order: Order & {
    packagePurchase?: { packageTemplate: { name: string } } | null;
    appointment?: { date: Date } | null;
  },
): ProductArrays {
  if (order.type === "PACKAGE" && order.packagePurchase) {
    return {
      names: [`Package: ${order.packagePurchase.packageTemplate.name}`],
      counts: [1],
      prices: [order.amount],
    };
  }
  if (order.type === "SINGLE_SESSION" && order.appointment) {
    return {
      names: [`Session: ${order.appointment.date.toISOString()}`],
      counts: [1],
      prices: [order.amount],
    };
  }
  // fallback
  return {
    names: ["Therapy Service"],
    counts: [1],
    prices: [order.amount],
  };
}

export function formatDecimalArray(arr: Decimal[]): string[] {
  return arr.map((d) => d.toFixed(2));
}
