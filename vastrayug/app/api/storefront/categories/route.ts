import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/storefront/categories
 * Fetch full category + sub-category tree.
 * Reference: docs/prompt.md Step 4.7
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        subCategories: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("API Error [Categories]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
