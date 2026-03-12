import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * POST /api/webhooks/razorpay
 * Razorpay webhook handler to update order status based on events.
 * Reference: docs/prompt.md Step 4.9h
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, message: "Missing signature" }, { status: 400 });
    }

    // 1. Verify Webhook Signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error("[Razorpay Webhook] Invalid signature");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventName, payload } = event;

    console.log(`[Razorpay Webhook] Received event: ${eventName}`);

    const payment = payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    // 2. Handle Events
    switch (eventName) {
      case "payment.captured":
        // Order might have already been updated by verify-payment route,
        // but this acts as a failsafe for asynchronous completion.
        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            razorpayPaymentId: payment.id,
            status: OrderStatus.PROCESSING,
          },
        });
        break;

      case "payment.failed":
        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: PaymentStatus.FAILED,
            status: OrderStatus.CANCELLED,
            notes: `Payment failed: ${payment.error_description || "Unknown error"}`,
          },
        });
        break;

      // Handle other events if necessary (e.g., refunds)
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Razorpay Webhook] Error processing webhook:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
