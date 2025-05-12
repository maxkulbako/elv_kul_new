"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { getWfpConfig } from "./config";
import { buildProductArrays, formatDecimalArray } from "./builders";
import { buildSignatureString, computeSignature } from "./signature";

export type WayForPayFormParams = {
  merchantAccount: string;
  merchantAuthType: string;
  merchantDomainName: string;
  merchantSignature: string;
  orderReference: string;
  orderDate: string;
  amount: string;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: string[];
  returnUrl: string;
  serviceUrl: string;
};

export async function getWayForPayPaymentFormParams(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  if (!orderId) {
    return { success: false, message: "Order ID is required." };
  }

  const cfg = getWfpConfig();
  if (!cfg) {
    return { success: false, message: "Payment gateway misconfiguration." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      packagePurchase: {
        include: { packageTemplate: { select: { name: true } } },
      },
      appointment: { select: { date: true } },
    },
  });
  if (!order) {
    return { success: false, message: "Order not found." };
  }
  if (order.userId !== session.user.id) {
    return { success: false, message: "Order does not belong to you." };
  }
  if (order.status !== "PENDING") {
    return {
      success: false,
      message: `Order in status ${order.status}, cannot pay.`,
    };
  }

  const { names, counts, prices } = buildProductArrays(order);
  const priceStrs = formatDecimalArray(prices);
  const amountStr = order.amount.toFixed(2);
  const currency = "UAH";
  const orderDate = Math.floor(order.createdAt.getTime() / 1000).toString();

  const attrs = [
    cfg.merchantAccount,
    cfg.domain,
    order.id,
    orderDate,
    amountStr,
    currency,
  ];
  const sigStr = buildSignatureString(attrs, names, counts, priceStrs);
  const signature = computeSignature(sigStr, cfg.secretKey);

  const svcUrl = cfg.ngrokUrl
    ? `${cfg.ngrokUrl}/api/webhooks/wayforpay`
    : `${cfg.appUrl}/api/webhooks/wayforpay`;
  const retUrl = `${cfg.appUrl}/client/payment-result?orderId=${order.id}`;

  const params: WayForPayFormParams = {
    merchantAccount: cfg.merchantAccount,
    merchantAuthType: "SimpleSignature",
    merchantDomainName: cfg.domain,
    merchantSignature: signature,
    orderReference: order.id,
    orderDate,
    amount: amountStr,
    currency,
    productName: names,
    productCount: counts,
    productPrice: priceStrs,
    returnUrl: retUrl,
    serviceUrl: svcUrl,
  };

  return {
    success: true,
    message: "Params generated",
    params,
  };
}
