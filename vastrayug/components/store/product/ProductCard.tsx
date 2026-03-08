import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number | any;
    compare_at_price?: number | any | null;
    images: { url: string; alt: string; is_primary: boolean }[];
    category: { name: string; slug: string };
    planet?: string | null;
    zodiac_sign?: string | null;
    stock: number;
  };
  priority?: boolean; // For LCP optimization on first few cards
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary) || product.images[0]
      : null;
  const hoverImage =
    product.images && product.images.length > 1
      ? product.images[1]
      : primaryImage;

  const isOutOfStock = product.stock <= 0;

  const price = Number(product.price);
  const compareAtPrice = product.compare_at_price
    ? Number(product.compare_at_price)
    : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  // Calculate discount percentage
  const discountPercentage =
    hasDiscount && compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return (
    <div
      className="group relative flex h-full w-full flex-col overflow-hidden border border-white/5 bg-void-black transition-colors duration-500 hover:border-nebula-gold/30"
      data-product-id={product.id}
      data-product-name={product.title}
      data-product-category={product.category.name}
      data-product-price={price}
      data-gtm-action="select_item"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
        {isOutOfStock ? (
          <span className="border border-white/10 bg-cosmic-black/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-stardust-white backdrop-blur-sm">
            Sold Out
          </span>
        ) : hasDiscount ? (
          <span className="bg-mangal-red px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-stardust-white">
            {discountPercentage}% OFF
          </span>
        ) : null}

        {/* Planet Badge */}
        {product.planet && (
          <span className="border border-nebula-gold/20 bg-nebula-gold/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-nebula-gold backdrop-blur-sm">
            {product.planet}
          </span>
        )}
      </div>

      {/* Wishlist Toggle */}
      <button
        className="absolute right-3 top-3 z-20 rounded-full bg-cosmic-black/40 p-2 text-stardust-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-cosmic-black/80 hover:text-mangal-red group-hover:opacity-100 focus:opacity-100"
        aria-label="Add to Wishlist"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image Gallery */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block w-full overflow-hidden bg-deep-indigo/30 aspect-[3/4]"
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt || product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute inset-0 scale-105 object-cover object-center opacity-0 transition-all duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stardust-white/20">
            <span className="font-heading text-sm uppercase tracking-widest">
              Vastrayug
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-0 left-0 z-20 w-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          <button
            className="w-full bg-nebula-gold py-3 font-body text-sm font-semibold uppercase tracking-widest text-cosmic-black transition-colors hover:bg-stardust-white disabled:bg-eclipse-silver disabled:text-stardust-white"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Quick Add"}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="z-10 flex flex-1 flex-col bg-void-black p-4 md:p-5">
        <div className="mb-2 flex items-start justify-between gap-4">
          <Link
            href={`/shop/${product.slug}`}
            className="flex-1 transition-colors hover:text-nebula-gold"
          >
            <h3 className="line-clamp-2 font-heading text-lg leading-tight text-stardust-white">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <span className="font-body font-medium text-stardust-white">
            {formatCurrency(price)}
          </span>
          {hasDiscount && compareAtPrice && (
            <span className="font-body text-sm text-eclipse-silver line-through decoration-mangal-red/50">
              {formatCurrency(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
