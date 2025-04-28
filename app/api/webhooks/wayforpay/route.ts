// app/api/webhooks/wayforpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface WayForPayWebhookPayload {
  merchantAccount: string;
  orderReference: string;
  merchantSignature: string;
  amount: number;
  currency: string;
  authCode: string;
  cardPan: string;
  transactionStatus: "Approved" | "Declined" | "Expired" | string;
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
  let orderReferenceForResponse: string | null = null;

  try {
    // 1. Get the request body
    const payload = (await req.json()) as WayForPayWebhookPayload;
    orderReferenceForResponse = payload.orderReference; // Save for response in case of error
    console.log(
      "WayForPay Webhook: Parsed payload:",
      JSON.stringify(payload, null, 2),
    );

    // 2. Get the secret key
    const merchantSecretKey = process.env.WAYFORPAY_SECRET_KEY;
    if (!merchantSecretKey) {
      console.error("WayForPay Webhook: WAYFORPAY_SECRET_KEY is not set!");
      // Respond with an error, but not the standard WFP response, because we can't generate a signature
      return new NextResponse(
        "Server configuration error: Secret key missing",
        { status: 500 },
      );
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
      console.warn(
        `WayForPay Webhook: Invalid signature for order ${payload.orderReference}!`,
      );
      // Respond with the standard response, so WFP doesn't send it again
      return createWayForPayResponse(payload.orderReference, merchantSecretKey);
    }

    console.log(
      `WayForPay Webhook: Signature is valid for order ${payload.orderReference}.`,
    );

    // 4. Знайти замовлення в базі даних
    const order = await prisma.order.findUnique({
      where: { id: payload.orderReference },
    });

    if (!order) {
      console.warn(
        `WayForPay Webhook: Order not found for ID: ${payload.orderReference}`,
      );
      // Respond with the standard response, so WFP doesn't send it again
      return createWayForPayResponse(payload.orderReference, merchantSecretKey);
    }

    // 5. Process the transaction status and update the order
    if (order.status === OrderStatus.PENDING) {
      let newStatus: OrderStatus | null = null;
      let paidAt: Date | null = null;

      // Verify the transaction status
      if (payload.transactionStatus === "Approved") {
        // Verify the amount (important!)
        // Compare Decimal with Prisma with the number from WayForPay
        const orderAmount = new Decimal(order.amount);
        const receivedAmount = new Decimal(payload.amount);

        if (
          orderAmount.equals(receivedAmount) &&
          order.currency === payload.currency
        ) {
          newStatus = OrderStatus.SUCCEEDED;
          paidAt = new Date();
          console.log(
            `WayForPay Webhook: Order ${order.id} status changing to SUCCEEDED.`,
          );
        } else {
          // Amounts or currencies don't match! This is suspicious.
          console.error(
            `WayForPay Webhook: Amount or Currency mismatch for order ${order.id}!`,
          );
          console.error(`  -> Expected: ${order.amount} ${order.currency}`);
          console.error(`  -> Received: ${payload.amount} ${payload.currency}`);
          // Don't change the status to SUCCEEDED. You can change it to FAILED or leave PENDING.
          // Better to leave PENDING and figure it out manually, or enter a special status like 'MISMATCH'.
          console.log(
            `WayForPay Webhook: Order ${order.id} status remains PENDING due to amount/currency mismatch.`,
          );
          // You can also change it to FAILED:
          // newStatus = OrderStatus.FAILED;
        }
      } else if (["Declined", "Expired"].includes(payload.transactionStatus)) {
        // Add other statuses as needed
        newStatus = OrderStatus.FAILED;
        console.log(
          `WayForPay Webhook: Order ${order.id} status changing to FAILED due to status: ${payload.transactionStatus}. Reason: ${payload.reason} (Code: ${payload.reasonCode})`,
        );
      } else {
        console.log(
          `WayForPay Webhook: Received unhandled transaction status '${payload.transactionStatus}' for order ${order.id}. Order status remains PENDING.`,
        );
      }

      // Update the order if the status has changed
      if (newStatus) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: newStatus,
            paidAt: paidAt, // null for FAILED, Date for SUCCEEDED
            // You can save transaction details (optionally)
            // paymentDetails: JSON.stringify(payload), // Be careful with sensitive data!
          },
        });
        console.log(
          `WayForPay Webhook: Order ${order.id} updated successfully in DB.`,
        );
      }
    } else {
      console.log(
        `WayForPay Webhook: Order ${order.id} already has status ${order.status}. Webhook processing skipped.`,
      );
    }

    // 6. Send a response to WayForPay
    return createWayForPayResponse(payload.orderReference, merchantSecretKey);
  } catch (error) {
    console.error("WayForPay Webhook: Error processing webhook:", error);
    // Try to respond with the standard response, if there is an orderReference
    if (orderReferenceForResponse && process.env.WAYFORPAY_SECRET_KEY) {
      console.error(
        `WayForPay Webhook: Attempting to send 'accept' response for order ${orderReferenceForResponse} despite error.`,
      );
      return createWayForPayResponse(
        orderReferenceForResponse,
        process.env.WAYFORPAY_SECRET_KEY,
      );
    }
    // If the error occurred before getting the orderReference or the key is missing, return 500
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
