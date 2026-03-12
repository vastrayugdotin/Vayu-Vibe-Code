import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/store/product/ProductGrid";
import FilterSidebar from "@/components/store/product/FilterSidebar";
import ActiveFilters from "@/components/store/product/ActiveFilters";
import SortDropdown from "@/components/store/product/SortDropdown";
import Pagination from "@/components/store/product/Pagination";
import CollectionHero from "@/components/store/collection/CollectionHero";

export const revalidate = 300;

export async function generateStaticParams() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!collection) return { title: "Collection Not Found | Vastrayug" };

  const title = collection.metaTitle || `${collection.name} | Cosmic Apparel | Vastrayug`;
  return {
    title,
    description: collection.metaDescription || collection.description || `Shop the premium ${collection.name} collection at Vastrayug.`,
    alternates: { canonical: `https://vastrayug.in/collection/${collection.slug}` },
    openGraph: {
      title,
      description: collection.metaDescription || collection.description,
      url: `https://vastrayug.in/collection/${collection.slug}`,
      type: "website",
      ...(collection.imageUrl && { images: [{ url: collection.imageUrl, alt: collection.name }] }),
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!collection) notFound();

  // --- Parse Parameters ---
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const categories = (searchParams.category as string)?.split(",") || [];
  const planets = (searchParams.planet as string)?.split(",") || [];
  const zodiacs = (searchParams.zodiac as string)?.split(",") || [];
  const sizes = (searchParams.size as string)?.split(",") || [];
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 100000;
  const sort = (searchParams.sort as string) || "newest";

  // --- Build Prisma Query ---
  const where: any = {
    status: "PUBLISHED",
    collections: { some: { collectionId: collection.id } },
    price: { gte: minPrice, lte: maxPrice },
  };

  if (categories.length > 0) where.category = { slug: { in: categories } };
  if (planets.length > 0) where.planet = { in: planets.map(p => p.toUpperCase()) };
  if (zodiacs.length > 0) where.zodiacSign = { in: zodiacs.map(z => z.toUpperCase()) };

  if (sizes.length > 0) {
    where.variants = {
      some: {
        size: { in: sizes },
        isActive: true,
      }
    };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "popularity") orderBy = { orderItems: { _count: "desc" } };

  // --- Fetch Data ---
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        collections: { include: { collection: true }, take: 1 },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Format products for ProductCard
  const formattedProducts = products.map((p) => ({
    ...p,
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
    collection_name: p.collections[0]?.collection.name,
  }));

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.name,
    description: collection.description,
    url: `https://vastrayug.in/collection/${collection.slug}`,
    itemListElement: formattedProducts.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://vastrayug.in/shop/${product.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionHero
        name={collection.name}
        description={collection.description}
        type={collection.type}
        planet={collection.planet}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          <FilterSidebar />

          <main className="flex-1">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
              <span className="font-body text-sm text-eclipse-silver">
                Showing <span className="text-stardust-white font-medium">{formattedProducts.length}</span> of {totalCount} results
              </span>
              <SortDropdown />
            </div>

            <ActiveFilters />
            <ProductGrid products={formattedProducts} />
            <Pagination totalPages={totalPages} currentPage={page} />
          </main>
        </div>
      </div>
    </>
  );
}
