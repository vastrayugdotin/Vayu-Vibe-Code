import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * DELETE /api/storefront/cart/[itemId]
 * Remove a single item from the cart.
 * Reference: docs/prompt.md Step 4.8g
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getSession();
    const sessionId = req.headers.get("x-session-id");
    const userId = session?.user?.id;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, message: "Session alignment required" },
        { status: 401 }
      );
    }

    const { itemId } = params;

    // Verify item belongs to user/session cart before deletion
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: userId ? { userId } : { sessionId },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: "Artifact not found in satchel" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Artifact removed from satchel",
    });
  } catch (error) {
    console.error("API Error [Cart DELETE]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
