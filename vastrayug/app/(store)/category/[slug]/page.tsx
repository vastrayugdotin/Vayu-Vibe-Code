import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/store/product/ProductGrid";

export const revalidate = 300; // ISR: Revalidate every 5 minutes

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

  if (!category) {
    return { title: "Category Not Found | Vastrayug" };
  }

  const title =
    category.metaTitle || `${category.name} | Cosmic Apparel | Vastrayug`;
  const description =
    category.metaDescription ||
    category.description ||
    `Shop the premium ${category.name} collection at Vastrayug. Cosmic-inspired fashion blending astrology and luxury.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://vastrayug.in/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://vastrayug.in/category/${category.slug}`,
      type: "website",
      ...(category.imageUrl && {
        images: [{ url: category.imageUrl, alt: category.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(category.imageUrl && { images: [category.imageUrl] }),
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

  if (!category) {
    notFound();
  }

  // Parse search parameters
  const planetFilter = searchParams.planet as string | undefined;
  const sortParam = searchParams.sort as string | undefined;

  // Construct prisma where clause
  const whereClause: any = {
    status: "PUBLISHED",
    categoryId: category.id,
  };
  if (planetFilter) whereClause.planet = planetFilter;

  // Construct prisma order clause
  let orderByClause: any = { createdAt: "desc" };
  if (sortParam === "price-asc") orderByClause = { price: "asc" };
  if (sortParam === "price-desc") orderByClause = { price: "desc" };
  if (sortParam === "featured") orderByClause = { featured: "desc" };

  // Fetch filtered category products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      category: true,
    },
  });

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
  }));

  // Structured Data
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vastrayug.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://vastrayug.in/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `https://vastrayug.in/category/${category.slug}`,
      },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    description: category.description || `Products in ${category.name}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 font-heading text-display-sm text-stardust-white md:text-display-md">
            {category.name}
          </h1>
          {category.description ? (
            <p className="font-body text-lg text-eclipse-silver">
              {category.description}
            </p>
          ) : (
            <p className="font-body text-lg text-eclipse-silver">
              Explore our premium collection of {category.name.toLowerCase()}{" "}
              aligned with your cosmic frequency.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full flex-shrink-0 lg:w-64">
            <div className="sticky top-24 border border-white/5 bg-void-black p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl uppercase tracking-widest text-stardust-white">
                  Filters
                </h2>
                <a
                  href={`/category/${category.slug}`}
                  className="font-body text-xs uppercase tracking-widest text-eclipse-silver underline underline-offset-4 hover:text-nebula-gold"
                >
                  Clear
                </a>
              </div>

              <div className="space-y-8 font-body">
                {/* Planets Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stardust-white">
                    Ruling Planet
                  </h3>
                  <div className="space-y-3">
                    {[
                      "SUN",
                      "MOON",
                      "MARS",
                      "MERCURY",
                      "JUPITER",
                      "VENUS",
                      "SATURN",
                      "RAHU",
                      "KETU",
                    ].map((planet) => {
                      const isActive = planetFilter === planet;
                      return (
                        <a
                          key={planet}
                          href={`/category/${
                            category.slug
                          }?${new URLSearchParams({
                            ...(sortParam && { sort: sortParam }),
                            planet,
                          }).toString()}`}
                          className="group flex cursor-pointer items-center gap-3"
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                              isActive
                                ? "border-nebula-gold bg-nebula-gold"
                                : "border-white/20 group-hover:border-nebula-gold"
                            }`}
                          >
                            {isActive && (
                              <span className="block h-2 w-2 bg-cosmic-black" />
                            )}
                          </div>
                          <span
                            className={`text-sm transition-colors ${
                              isActive
                                ? "text-stardust-white"
                                : "text-eclipse-silver group-hover:text-stardust-white"
                            }`}
                          >
                            {planet.charAt(0) + planet.slice(1).toLowerCase()}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <span className="font-body text-sm text-eclipse-silver">
                Showing {products.length} products
              </span>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm uppercase tracking-wider text-eclipse-silver">
                  Sort by:
                </span>
                <form action={`/category/${category.slug}`} method="GET">
                  {planetFilter && (
                    <input type="hidden" name="planet" value={planetFilter} />
                  )}
                  <select
                    name="sort"
                    defaultValue={sortParam || "newest"}
                    onChange={(e) => e.target.form?.submit()}
                    className="cursor-pointer border-none bg-transparent font-body text-sm uppercase tracking-wider text-stardust-white outline-none focus:ring-0"
                  >
                    <option value="newest" className="bg-cosmic-black">
                      Newest Arrivals
                    </option>
                    <option value="featured" className="bg-cosmic-black">
                      Featured
                    </option>
                    <option value="price-asc" className="bg-cosmic-black">
                      Price: Low to High
                    </option>
                    <option value="price-desc" className="bg-cosmic-black">
                      Price: High to Low
                    </option>
                  </select>
                </form>
              </div>
            </div>

            {/* Grid Component */}
            <ProductGrid products={formattedProducts} />
          </main>
        </div>
      </div>
    </>
  );
}
