import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, shippingAddress, shippingMethodId, guestEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    // 1. Calculate Total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: { product: true },
      });

      if (!variant || !variant.isActive) {
        return NextResponse.json(
          { success: false, message: `Product variant ${item.productVariantId} not found` },
          { status: 404 },
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${variant.product.title}` },
          { status: 400 },
        );
      }

      const price = Number(variant.priceOverride || variant.product.price);
      subtotal += price * item.quantity;

      orderItems.push({
        variant,
        quantity: item.quantity,
        price,
      });
    }

    // Shipping cost logic (matching frontend)
    const shippingCost = subtotal > 999 ? 0 : 99;
    const total = subtotal + shippingCost;

    // 2. Create Razorpay Order
    const orderNumber = `VY-${nanoid(8).toUpperCase()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // in paise
      currency: "INR",
      receipt: orderNumber,
    });

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        orderNumber,
        amount: total,
        currency: "INR",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
