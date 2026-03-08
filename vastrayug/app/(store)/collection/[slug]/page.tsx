import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/store/product/ProductGrid";
import CollectionHero from "@/components/store/collection/CollectionHero";

export const revalidate = 300; // ISR: Revalidate every 5 minutes

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

  if (!collection) {
    return { title: "Collection Not Found | Vastrayug" };
  }

  const title =
    collection.metaTitle || `${collection.name} | Cosmic Apparel | Vastrayug`;
  const description =
    collection.metaDescription ||
    collection.description ||
    `Shop the premium ${collection.name} collection at Vastrayug. Cosmic-inspired fashion blending astrology and luxury.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://vastrayug.in/collection/${collection.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://vastrayug.in/collection/${collection.slug}`,
      type: "website",
      ...(collection.imageUrl && {
        images: [{ url: collection.imageUrl, alt: collection.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(collection.imageUrl && { images: [collection.imageUrl] }),
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
    include: {
      products: {
        include: {
          product: {
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
    notFound();
  }

  // Parse search parameters
  const categoryFilter = searchParams.category as string | undefined;
  const sortParam = searchParams.sort as string | undefined;

  // The products are loaded via the junction table ProductCollection
  // We extract and filter them in memory since they are already joined
  let products = collection.products
    .map((pc) => pc.product)
    .filter((p) => p.status === "PUBLISHED");

  if (categoryFilter) {
    products = products.filter((p) => p.category?.slug === categoryFilter);
  }

  // Apply sorting
  if (sortParam === "price-asc") {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortParam === "price-desc") {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortParam === "featured") {
    products.sort((a, b) =>
      a.featured === b.featured ? 0 : a.featured ? -1 : 1,
    );
  } else {
    // Default to newest
    products.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // Format products for ProductCard
  const formattedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.altText || p.title,
      is_primary: img.isPrimary,
    })),
    category: {
      name: p.category?.name || "Uncategorized",
      slug: p.category?.slug || "uncategorized",
    },
  }));

  // Determine dynamic accent color for Planetary Collections
  // Default to nebula-gold logic
  let accentBorder = "border-nebula-gold";
  let accentText = "text-nebula-gold";

  if (collection.type === "PLANETARY" && collection.planet) {
    switch (collection.planet) {
      case "SUN":
        accentBorder = "border-surya-gold";
        accentText = "text-surya-gold";
        break;
      case "MOON":
        accentBorder = "border-chandra-pearl";
        accentText = "text-chandra-pearl";
        break;
      case "MARS":
        accentBorder = "border-mangal-red";
        accentText = "text-mangal-red";
        break;
      case "MERCURY":
        accentBorder = "border-budh-emerald";
        accentText = "text-budh-emerald";
        break;
      case "JUPITER":
        accentBorder = "border-guru-yellow";
        accentText = "text-guru-yellow";
        break;
      case "VENUS":
        accentBorder = "border-shukra-blush";
        accentText = "text-shukra-blush";
        break;
      case "SATURN":
        accentBorder = "border-shani-indigo";
        accentText = "text-shani-indigo";
        break;
      case "RAHU":
        accentBorder = "border-rahu-violet";
        accentText = "text-rahu-violet";
        break;
      case "KETU":
        accentBorder = "border-ketu-maroon";
        accentText = "text-ketu-maroon";
        break;
    }
  }

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
        name: "Collections",
        item: "https://vastrayug.in/collection",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.name,
        item: `https://vastrayug.in/collection/${collection.slug}`,
      },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.name,
    description: collection.description || `Products in ${collection.name}`,
    url: `https://vastrayug.in/collection/${collection.slug}`,
    itemListElement: formattedProducts.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://vastrayug.in/shop/${product.slug}`,
    })),
  };

  // Generate unique categories inside this collection for sidebar filter mapping
  const collectionCategories = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category!.slug, p.category!]),
    ).values(),
  );

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

      <CollectionHero
        name={collection.name}
        description={collection.description}
        type={collection.type}
        planet={collection.planet}
        accentTextClass={accentText}
        accentBgClass={accentText.replace("text-", "bg-")}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full flex-shrink-0 lg:w-64">
            <div className="sticky top-24 border border-white/5 bg-void-black p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl uppercase tracking-widest text-stardust-white">
                  Filters
                </h2>
                <a
                  href={`/collection/${collection.slug}`}
                  className="font-body text-xs uppercase tracking-widest text-eclipse-silver underline underline-offset-4 hover:text-nebula-gold"
                >
                  Clear
                </a>
              </div>

              <div className="space-y-8 font-body">
                {/* Categories Filter specific to this collection */}
                {collectionCategories.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stardust-white">
                      Category
                    </h3>
                    <div className="space-y-3">
                      {collectionCategories.map((cat) => {
                        const isActive = categoryFilter === cat.slug;
                        return (
                          <a
                            key={cat.slug}
                            href={`/collection/${
                              collection.slug
                            }?${new URLSearchParams({
                              ...(sortParam && { sort: sortParam }),
                              category: cat.slug,
                            }).toString()}`}
                            className="group flex cursor-pointer items-center gap-3"
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                                isActive
                                  ? `${accentBorder} ${accentText.replace(
                                      "text-",
                                      "bg-",
                                    )}`
                                  : "border-white/20 group-hover:border-white/50"
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
                              {cat.name}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                <form action={`/collection/${collection.slug}`} method="GET">
                  {categoryFilter && (
                    <input
                      type="hidden"
                      name="category"
                      value={categoryFilter}
                    />
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
