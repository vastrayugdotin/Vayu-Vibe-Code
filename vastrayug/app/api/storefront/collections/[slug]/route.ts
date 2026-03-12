import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

/**
 * GET /api/storefront/collections/[slug]
 * Fetch single collection + its published products.
 * Reference: docs/prompt.md Step 4.7
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const collection = await prisma.collection.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        products: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              where: {
                status: ProductStatus.PUBLISHED,
              },
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                category: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    // Flatten the products from the junction table
    const products = collection.products
      .filter((pc) => pc.product) // Filter out nulls if where clause excluded them
      .map((pc) => pc.product);

    return NextResponse.json({
      success: true,
      data: {
        ...collection,
        products,
      },
    });
  } catch (error) {
    console.error(`API Error [Collection ${params.slug}]:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
