"use client";

import * as React from "react";
import Link from "next/link";
import ProductCard from "@/components/store/product/ProductCard";

type ImageType = {
  url: string;
  alt: string;
  is_primary: boolean;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  images: ImageType[];
  category: { name: string; slug: string };
  planet?: string | null;
  zodiac_sign?: string | null;
  stock: number;
};

interface FeaturedProductsProps {
  products: any[]; // Since prisma data comes mixed, we will typecast or adapt below
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Adapt Prisma data to match the strict ProductCard props
  const adaptedProducts: Product[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: Number(p.price),
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img: any) => ({
      url: img.url,
      alt: img.alt || p.title,
      is_primary: img.isPrimary,
    })),
    category: {
      name: p.category?.name || "Uncategorized",
      slug: p.category?.slug || "uncategorized",
    },
    planet: p.planet,
    zodiac_sign: p.zodiacSign,
    stock: p.stock || 0,
  }));

  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Small buffer for pixel rounding issues
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  React.useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [adaptedProducts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of container width

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!adaptedProducts || adaptedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-24">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="border-b-2 border-nebula-gold pb-2 font-heading text-3xl text-stardust-white md:text-4xl">
          Celestial Arrivals
        </h2>
        <Link
          href="/shop"
          className="font-body text-sm uppercase tracking-wider text-nebula-gold transition-colors hover:text-stardust-white"
        >
          Shop All
        </Link>
      </div>

      <div className="group relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-[40%] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cosmic-black/80 border border-eclipse-silver/20 text-stardust-white shadow-xl backdrop-blur-sm transition-all hover:border-nebula-gold hover:text-nebula-gold md:flex"
            aria-label="Scroll left"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Products Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollState}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {adaptedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-[85vw] flex-none snap-start sm:w-[45vw] md:w-[30vw] lg:w-[23vw]"
            >
              <ProductCard
                product={product}
                priority={index < 4} // Preload images for first few cards
              />
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-[40%] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cosmic-black/80 border border-eclipse-silver/20 text-stardust-white shadow-xl backdrop-blur-sm transition-all hover:border-nebula-gold hover:text-nebula-gold md:flex"
            aria-label="Scroll right"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
