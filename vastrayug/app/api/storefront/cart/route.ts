import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { addToCartSchema, updateCartItemSchema } from "@/lib/validations";

/**
 * GET /api/storefront/cart
 * Fetch the current user's or session's cart with items and variant data.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.headers.get("x-session-id");
    const userId = session?.user?.id;

    if (!userId && !sessionId) {
      return NextResponse.json({ success: true, data: null });
    }

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
        coupon: true,
      },
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error("API Error [Cart GET]:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch cart" }, { status: 500 });
  }
}

/**
 * POST /api/storefront/cart
 * Add an item to the cart. Validates stock availability.
 * Reference: docs/prompt.md Step 4.8g
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.headers.get("x-session-id");
    const userId = session?.user?.id;

    if (!userId && !sessionId) {
      return NextResponse.json({ success: false, message: "Session alignment required" }, { status: 401 });
    }

    const body = await req.json();
    const result = addToCartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.errors[0].message }, { status: 400 });
    }

    const { productVariantId, quantity } = result.data;

    // 1. Validate Stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant || !variant.isActive) {
      return NextResponse.json({ success: false, message: "Artifact is currently unavailable" }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ success: false, message: "Insufficient cosmic alignment (out of stock)" }, { status: 400 });
    }

    // 2. Find or Create Cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { sessionId },
      });
    }

    // 3. Add or Update Item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        return NextResponse.json({ success: false, message: "Total quantity exceeds available stock" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Artifact added to satchel" });
  } catch (error) {
    console.error("API Error [Cart POST]:", error);
    return NextResponse.json({ success: false, message: "Failed to update satchel" }, { status: 500 });
  }
}

/**
 * PATCH /api/storefront/cart
 * Update item quantity in the cart.
 * Reference: docs/prompt.md Step 4.8g
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = req.headers.get("x-session-id");
    const userId = session?.user?.id;

    if (!userId && !sessionId) {
      return NextResponse.json({ success: false, message: "Session alignment required" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateCartItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.errors[0].message }, { status: 400 });
    }

    const { cartItemId, quantity } = result.data;

    // Verify item belongs to user/session cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: userId ? { userId } : { sessionId },
      },
      include: { productVariant: true },
    });

    if (!cartItem) {
      return NextResponse.json({ success: false, message: "Artifact not found in satchel" }, { status: 404 });
    }

    // Validate Stock
    if (cartItem.productVariant.stock < quantity) {
      return NextResponse.json({ success: false, message: "Insufficient stock for this alignment" }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: "Satchel alignment updated" });
  } catch (error) {
    console.error("API Error [Cart PATCH]:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
