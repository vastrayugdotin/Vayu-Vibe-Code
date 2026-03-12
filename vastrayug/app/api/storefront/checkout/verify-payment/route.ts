import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/sendgrid";
import { formatCurrency } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderNumber,
      items,
      shippingAddress,
      guestEmail
    } = body;

    // 1. Verify Signature
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // 2. Process Order in DB (Transaction)
    const order = await prisma.$transaction(async (tx) => {
      // Re-fetch variants to get fresh prices and update stock
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.productVariantId },
          include: { product: true },
        });

        if (!variant) throw new Error("Variant not found during verification");

        const price = Number(variant.priceOverride || variant.product.price);
        subtotal += price * item.quantity;

        // Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: variant.productId,
          productVariantId: variant.id,
          productTitleSnapshot: variant.product.title,
          variantSnapshot: { size: variant.size, colour: variant.colour } as any,
          unitPrice: price,
          quantity: item.quantity,
          lineTotal: price * item.quantity,
        });
      }

      const shippingCost = subtotal > 999 ? 0 : 99;
      const total = subtotal + shippingCost;

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id,
          guestEmail: session ? undefined : guestEmail,
          shippingAddressId: shippingAddress.id || undefined,
          shippingAddressJson: shippingAddress,
          subtotal,
          shippingCost,
          total,
          status: "PROCESSING",
          paymentStatus: "PAID",
          razorpayOrderId,
          razorpayPaymentId,
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              status: "PLACED",
              note: "Payment verified successfully",
            },
          },
        },
        include: {
          items: true
        }
      });

      // 4.9h: Clear the cart in DB for authenticated users
      if (session?.user?.id) {
        await tx.cart.deleteMany({
          where: { userId: session.user.id }
        });
      }

      return newOrder;
    });

    // 3. Send Confirmation Email (Step 4.9h)
    // Fetch template ID from settings
    const emailSettingsRaw = await prisma.settings.findUnique({ where: { key: "email_templates" } });
    const emailTemplates = emailSettingsRaw ? JSON.parse(emailSettingsRaw.value) : {};
    const templateId = emailTemplates.order_confirm;

    if (templateId) {
      const recipientEmail = session?.user?.email || guestEmail;
      if (recipientEmail) {
        await sendTransactionalEmail(
          recipientEmail,
          templateId,
          {
            orderNumber: order.orderNumber,
            customerName: shippingAddress.name,
            totalAmount: formatCurrency(Number(order.total)),
            items: order.items.map(item => ({
              title: item.productTitleSnapshot,
              quantity: item.quantity,
              price: formatCurrency(Number(item.unitPrice))
            }))
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: { orderId: order.id },
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
