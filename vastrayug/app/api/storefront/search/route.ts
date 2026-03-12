import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

/**
 * GET /api/storefront/search
 * Full-text search across product title, tags, emotional_intention.
 * Reference: docs/prompt.md Step 4.7
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Using Prisma's full-text search feature (requires previewFeatures = ["fullTextSearch", "fullTextIndex"])
    // Note: @@fulltext index must be defined in schema.prisma
    const products = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [
          {
            title: {
              search: q,
            },
          },
          {
            tags: {
              search: q,
            },
          },
          {
            emotionalIntention: {
              search: q,
            },
          },
        ],
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("API Error [Search]:", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
