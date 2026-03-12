import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/storefront/collections
 * Fetch all active collections.
 * Reference: docs/prompt.md Step 4.7
 */
export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error("API Error [Collections]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
