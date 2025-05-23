// app/api/webhooks/wayforpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { OrderType } from "@prisma/client";
import { approveOrderTx } from "@/lib/actions/payments/payments.action";
import { cancelPendingOrderTx } from "@/lib/actions/cancelPendingOrderTx";
import {
  refundSingleSessionTx,
  refundPackageOrderTx,
} from "@/lib/actions/refund.action";

enum WayForPayTransactionStatus {
  IN_PROCESSING = "InProcessing",
  APPROVED = "Approved",
  DECLINED = "Declined",
  EXPIRED = "Expired",
  REFUNDED = "Refunded",
}

interface WayForPayWebhookPayload {
  merchantAccount: string;
  orderReference: string;
  merchantSignature: string;
  amount: number;
  currency: string;
  authCode: string;
  cardPan: string;
  transactionStatus: WayForPayTransactionStatus;
  reasonCode: number;
  reason: string;
  email?: string;
  phone?: string;
  createdDate?: number;
  processingDate?: number;
  cardType?: string;
  issuerBankCountry?: string;
  issuerBankName?: string;
  recToken?: string;
  fee?: number;
  paymentSystem?: string;
  repayUrl?: string;
}

function generateResponseSignature(
  orderReference: string,
  status: "accept",
  time: number,
  secretKey: string,
): string {
  const signatureString = [orderReference, status, time].join(";");
  return crypto
    .createHmac("md5", secretKey)
    .update(signatureString, "utf-8")
    .digest("hex");
}

// Create a response for WayForPay
function createWayForPayResponse(
  orderReference: string,
  secretKey: string,
): NextResponse {
  const responseTime = Math.floor(Date.now() / 1000);
  const status = "accept";
  const signature = generateResponseSignature(
    orderReference,
    status,
    responseTime,
    secretKey,
  );
  const responseBody = {
    orderReference: orderReference,
    status: status,
    time: responseTime,
    signature: signature,
  };
  console.log(
    "WayForPay Webhook: Sending response:",
    JSON.stringify(responseBody, null, 2),
  );
  return NextResponse.json(responseBody);
}

export async function POST(req: NextRequest) {
  console.log("WayForPay Webhook: Received request");

  // 1. Get the request body
  let payload: WayForPayWebhookPayload;
  try {
    payload = await req.json();
  } catch (error) {
    console.error("WayForPay Webhook: Error parsing request body:", error);
    return new NextResponse("Bad JSON", { status: 400 });
  }

  const orderId = payload.orderReference; // Save for response in case of error
  console.log(
    "WayForPay Webhook: Parsed payload:",
    JSON.stringify(payload, null, 2),
  );

  // 2. Get the secret key
  const merchantSecretKey = process.env.WAYFORPAY_SECRET_KEY;
  if (!merchantSecretKey) {
    console.error("WayForPay Webhook: WAYFORPAY_SECRET_KEY is not set!");
    // Respond with an error, but not the standard WFP response, because we can't generate a signature
    return new NextResponse("Server configuration error: Secret key missing", {
      status: 500,
    });
  }

  // 3. Verify the request signature (according to the documentation)
  // String: merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
  const fieldsForSignature = [
    payload.merchantAccount,
    payload.orderReference,
    payload.amount.toString(), // Amount as a string
    payload.currency,
    payload.authCode,
    payload.cardPan,
    payload.transactionStatus,
    payload.reasonCode.toString(), // Reason code as a string
  ];
  const incomingSignatureString = fieldsForSignature.join(";");

  const calculatedSignature = crypto
    .createHmac("md5", merchantSecretKey)
    .update(incomingSignatureString, "utf-8")
    .digest("hex");

  console.log("WayForPay Webhook: Comparing signatures");
  console.log(`  -> Received:   ${payload.merchantSignature}`);
  console.log(`  -> Calculated: ${calculatedSignature}`);
  console.log(`  -> Based on string: "${incomingSignatureString}"`);

  if (calculatedSignature !== payload.merchantSignature) {
    console.warn(`WayForPay Webhook: Invalid signature for order ${orderId}!`);
    // Respond with the standard response, so WFP doesn't send it again
    return createWayForPayResponse(orderId, merchantSecretKey);
  }

  console.log(`WayForPay Webhook: Signature is valid for order ${orderId}.`);

  // 4. Find the order in the database
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true, status: true, amount: true, currency: true },
  });

  if (!order) {
    console.warn(`WayForPay Webhook: Order not found for ID: ${orderId}`);
    // Respond with the standard response, so WFP doesn't send it again
    return createWayForPayResponse(orderId, merchantSecretKey);
  }

  // 5. Process the transaction status and update the order
  try {
    switch (payload.transactionStatus) {
      /* ---------- APPROVED ---------- */
      case WayForPayTransactionStatus.APPROVED: {
        /* check amount + currency */
        if (
          order.currency === payload.currency &&
          order.amount.equals?.(payload.amount) // Decimal support
        ) {
          await approveOrderTx(orderId);
        } else {
          await cancelPendingOrderTx(orderId, {
            failureReason: "Amount/currency mismatch",
            forceCancelAppointment: true,
            system: true,
          });
        }
        break;
      }

      /* ---------- DECLINED ---------- */
      case WayForPayTransactionStatus.DECLINED: {
        await cancelPendingOrderTx(orderId, {
          failureReason: payload.reason,
          repayUrl: payload.repayUrl,
          forceCancelAppointment: false,
          system: true,
        });
        break;
      }

      /* ---------- EXPIRED ---------- */
      case WayForPayTransactionStatus.EXPIRED: {
        await cancelPendingOrderTx(orderId, {
          failureReason: "Expired",
          forceCancelAppointment: true,
          system: true,
        });
        break;
      }

      /* ---------- REFUNDED ---------- */
      case WayForPayTransactionStatus.REFUNDED: {
        if (order.type === OrderType.PACKAGE) {
          await refundPackageOrderTx(orderId, {
            reason: payload.reason,
            system: true,
          });
        } else {
          await refundSingleSessionTx(orderId, {
            reason: payload.reason,
            system: true,
          });
        }
        break;
      }

      /* ---------- IN_PROCESSING / other ---------- */
      default:
        /* nothing to do, remains PENDING */
        break;
    }
  } catch (err) {
    console.error("WFP webhook internal error", err);
    /* always respond with «accept» – WFP will believe us, and we will see the log */
  }

  /* 3.5 always respond to WayForPay */
  return createWayForPayResponse(orderId, merchantSecretKey);
}
