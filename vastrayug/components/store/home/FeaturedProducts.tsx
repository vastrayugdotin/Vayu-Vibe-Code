"use client";

import * as React from "react";
import Link from "next/link";
import ProductCard from "@/components/store/product/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  React.useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mb-24 px-4 md:px-0">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-heading-lg text-stardust-white mb-2">
            Celestial Arrivals
          </h2>
          <p className="font-body text-eclipse-silver">
            The latest drops, aligned with the current cosmic transit.
          </p>
        </div>
        <Link
          href="/shop"
          className="group hidden items-center gap-2 font-body text-sm uppercase tracking-widest text-nebula-gold transition-colors hover:text-stardust-white md:flex"
        >
          <span>View All</span>
          <span className="h-[1px] w-8 bg-nebula-gold transition-colors group-hover:bg-stardust-white" />
        </Link>
      </div>

      <div className="group relative">
        {/* Scroll Controls */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-6 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-cosmic-black/80 text-stardust-white backdrop-blur-md transition-all hover:border-nebula-gold hover:text-nebula-gold md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-6 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-cosmic-black/80 text-stardust-white backdrop-blur-md transition-all hover:border-nebula-gold hover:text-nebula-gold md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollState}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[85vw] flex-none snap-start sm:w-[45vw] md:w-[30vw] lg:w-[23vw]"
            >
              <ProductCard
                product={{
                  ...product,
                  price: Number(product.price),
                  compare_at_price: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                  images: product.images.map((img: any) => ({
                    url: img.url,
                    alt: img.altText || product.title,
                    is_primary: img.isPrimary,
                  })),
                  category: {
                    name: product.category?.name || "Uncategorized",
                    slug: product.category?.slug || "uncategorized",
                  }
                }}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
