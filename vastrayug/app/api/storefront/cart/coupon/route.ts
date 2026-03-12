import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyCouponSchema } from "@/lib/validations";

/**
 * POST /api/storefront/cart/coupon
 * Validates a coupon code and returns the discount amount.
 * Reference: docs/prompt.md Step 4.8e
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = applyCouponSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { code } = result.data;

    // 1. Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code, isActive: true },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "This cosmic code is invalid." },
        { status: 404 }
      );
    }

    // 2. Check validity dates
    const now = new Date();
    if (coupon.validFrom > now) {
      return NextResponse.json(
        { success: false, message: "This code's alignment hasn't begun yet." },
        { status: 400 }
      );
    }
    if (coupon.validUntil < now) {
      return NextResponse.json(
        { success: false, message: "This code's energy has faded from our realm." },
        { status: 400 }
      );
    }

    // 3. Check usage limits
    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "This code has reached its maximum alignment." },
        { status: 400 }
      );
    }

    // Note: Per-user limits and first-order checks would happen during checkout/order creation
    // as we need to know the specific user/history.

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      // For simplicity in the client, we just return the values;
      // actual calculation happens in the store or at checkout.
      // In a real scenario, we might calculate the discount based on the provided cart subtotal.
      message: "Coupon aligned successfully."
    });
  } catch (error) {
    console.error("API Error [Coupon POST]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
