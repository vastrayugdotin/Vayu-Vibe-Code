import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/store/product/ProductGrid";
import FilterSidebar from "@/components/store/product/FilterSidebar";
import ActiveFilters from "@/components/store/product/ActiveFilters";
import SortDropdown from "@/components/store/product/SortDropdown";
import Pagination from "@/components/store/product/Pagination";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Category Not Found | Vastrayug" };

  const title = category.metaTitle || `${category.name} | Cosmic Apparel | Vastrayug`;
  return {
    title,
    description: category.metaDescription || category.description || `Shop the premium ${category.name} collection at Vastrayug.`,
    alternates: { canonical: `https://vastrayug.in/category/${category.slug}` },
    openGraph: {
      title,
      description: category.metaDescription || category.description,
      url: `https://vastrayug.in/category/${category.slug}`,
      type: "website",
      ...(category.imageUrl && { images: [{ url: category.imageUrl, alt: category.name }] }),
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  // --- Parse Parameters ---
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const planets = (searchParams.planet as string)?.split(",") || [];
  const zodiacs = (searchParams.zodiac as string)?.split(",") || [];
  const sizes = (searchParams.size as string)?.split(",") || [];
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 100000;
  const sort = (searchParams.sort as string) || "newest";

  // --- Build Prisma Query ---
  const where: any = {
    status: "PUBLISHED",
    categoryId: category.id,
    price: { gte: minPrice, lte: maxPrice },
  };

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
    name: category.name,
    description: category.description,
    url: `https://vastrayug.in/category/${category.slug}`,
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
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 font-heading text-display-sm text-stardust-white md:text-display-md">
            {category.name}
          </h1>
          <p className="font-body text-lg text-eclipse-silver leading-relaxed">
            {category.description || `Explore our premium collection of ${category.name.toLowerCase()} aligned with your cosmic frequency.`}
          </p>
        </div>

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
