import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
  planet?: string | null;
  limit?: number;
  className?: string;
}

/**
 * RelatedProducts — Step 4.6n
 * Renders a horizontal scroll strip of products from the same category or planet.
 * Reference: prd_new.md §6.1
 */
export default async function RelatedProducts({
  currentProductId,
  categoryId,
  planet,
  limit = 4,
  className,
}: RelatedProductsProps) {
  // 1. Fetch related products server-side
  const products = await prisma.product.findMany({
    where: {
      id: { not: currentProductId },
      status: "PUBLISHED",
      OR: [
        { planet: planet as any },
        { categoryId: categoryId },
      ],
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      category: true,
      variants: {
        select: { stock: true },
      },
    },
  });

  if (products.length === 0) return null;

  // 2. Format products for the ProductCard component
  const formattedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: Number(p.price),
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img: any) => ({
      url: img.url,
      alt: img.altText || p.title,
      is_primary: img.isPrimary,
    })),
    category: {
      name: p.category?.name || "Uncategorized",
      slug: p.category?.slug || "uncategorized",
    },
    planet: p.planet,
    zodiac_sign: p.zodiacSign,
    stock: p.variants.reduce((acc, v) => acc + v.stock, 0),
  }));

  return (
    <section className={cn("mt-24 w-full", className)}>
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-stardust-white">
            Celestial Pairings
          </h2>
          <p className="font-body text-sm text-eclipse-silver">
            Complete your cosmic alignment with these related artifacts.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
          {formattedProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] w-[280px] snap-start md:w-full"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
