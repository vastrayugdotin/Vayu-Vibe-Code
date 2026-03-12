import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

/**
 * GET /api/storefront/products
 * List products with filtering, sorting, and pagination.
 * Reference: docs/prompt.md Step 4.7
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // --- Parse Parameters ---
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    // --- Build Query ---
    const where: any = {
      status: ProductStatus.PUBLISHED,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (collection) {
      where.collections = {
        some: {
          collection: { slug: collection },
        },
      };
    }

    if (search && search.length >= 2) {
      where.OR = [
        { title: { contains: search } },
        { tags: { contains: search } },
        { emotionalIntention: { contains: search } },
      ];
    }

    // --- Sorting ---
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "featured") orderBy = { featured: "desc" };

    // --- Execute Query ---
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: {
            select: { name: true, slug: true },
          },
          collections: {
            include: {
              collection: {
                select: { name: true, slug: true },
              },
            },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("API Error [Products]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
