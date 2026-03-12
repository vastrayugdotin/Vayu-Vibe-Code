"use client";

import * as React from "react";
import { Heart, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  pushEcommerceEvent,
  pushPixelEvent,
  buildGa4Item,
} from "@/lib/datalayer";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

interface ProductInfoProps {
  product: any;
  variants: any[];
}

export default function ProductInfo({ product, variants }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<any | null>(
    null,
  );
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  // DataLayer mapping
  React.useEffect(() => {
    // Fire "view_item" event
    pushEcommerceEvent("view_item", {
      currency: "INR",
      value: Number(product.price),
      items: [buildGa4Item(product)],
    });

    // Fire Meta pixel event
    pushPixelEvent("ViewContent", {
      content_name: product.title,
      content_category: product.category?.name || "",
      content_ids: [product.id],
      content_type: "product",
      value: Number(product.price),
      currency: "INR",
    });
  }, [product]);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const isOutOfStock =
    variants.length === 0 || variants.every((v: any) => v.stock <= 0);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a size");
      return;
    }

    const price = Number(selectedVariant.priceOverride || product.price);

    pushEcommerceEvent("add_to_cart", {
      currency: "INR",
      value: price,
      items: [
        {
          ...buildGa4Item(product, {
            size: selectedVariant.size,
            colour: selectedVariant.colour,
            priceOverride: selectedVariant.priceOverride,
          }),
          quantity: 1,
        },
      ],
    });

    // Fire Meta AddToCart
    pushPixelEvent("AddToCart", {
      content_ids: [product.id],
      content_type: "product",
      value: price,
      currency: "INR",
    });

    // Add to Zustand Store
    addItem({
      productId: product.id,
      title: product.title,
      price: price,
      quantity: 1,
      image: product.images[0]?.url,
      variant: {
        size: selectedVariant.size,
        color: selectedVariant.colour || undefined,
      },
    });

    // Open MiniCart drawer
    openMiniCart();
  };

  const displayPrice = selectedVariant?.priceOverride || product.price;

  return (
    <div className="flex w-full flex-col pt-2 lg:w-[45%] lg:pt-8">
      <div className="mb-8 border-b border-white/10 pb-8">
        <h1 className="mb-4 font-heading text-heading-xl text-stardust-white">
          {product.title}
        </h1>

        <div className="flex items-end gap-4">
          <span className="font-body text-3xl font-medium text-stardust-white">
            {formatCurrency(Number(displayPrice))}
          </span>
          {hasDiscount && (
            <>
              <span className="mb-1 font-body text-xl line-through decoration-mangal-red/50 text-eclipse-silver">
                {formatCurrency(Number(product.compareAtPrice))}
              </span>
              <span className="mb-2 font-body text-sm font-semibold uppercase tracking-wider text-mangal-red">
                Save{" "}
                {formatCurrency(
                  Number(product.compareAtPrice) - Number(displayPrice),
                )}
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-eclipse-silver">
          Inclusive of all taxes.
        </p>
      </div>

      {/* Cosmic Metadata Grid */}
      <div className="mb-10 grid grid-cols-2 gap-4">
        <div className="flex flex-col border border-white/5 bg-void-black p-4">
          <span className="mb-1 font-body text-xs uppercase tracking-widest text-stardust-white/50">
            Ruling Planet
          </span>
          <span className="font-heading text-lg text-nebula-gold">
            {product.planet || "None"}
          </span>
        </div>
        <div className="flex flex-col border border-white/5 bg-void-black p-4">
          <span className="mb-1 font-body text-xs uppercase tracking-widest text-stardust-white/50">
            Zodiac Sign
          </span>
          <span className="font-heading text-lg text-stardust-white">
            {product.zodiacSign || "None"}
          </span>
        </div>
        <div className="flex flex-col border border-white/5 bg-void-black p-4">
          <span className="mb-1 font-body text-xs uppercase tracking-widest text-stardust-white/50">
            Life Path Number
          </span>
          <span className="font-heading text-lg text-stardust-white">
            {product.lifePathNumber || "None"}
          </span>
        </div>
        <div className="flex flex-col border border-white/5 bg-void-black p-4">
          <span className="mb-1 font-body text-xs uppercase tracking-widest text-stardust-white/50">
            Emotional Intention
          </span>
          <span className="truncate font-heading text-lg text-stardust-white">
            {product.emotionalIntention || "Alignment"}
          </span>
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-body text-sm uppercase tracking-widest text-stardust-white">
            Select Size
          </span>
          <button className="font-body text-sm text-eclipse-silver underline underline-offset-4 transition-colors hover:text-nebula-gold">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {variants.map((v) => {
            const outOfStock = v.stock <= 0;
            const isSelected = selectedVariant?.id === v.id;
            return (
              <button
                key={v.id}
                disabled={outOfStock}
                onClick={() => setSelectedVariant(v)}
                className={`
                      border py-3 font-body text-sm font-medium transition-colors
                      ${
                        outOfStock
                          ? "cursor-not-allowed border-white/5 bg-white/5 text-white/20"
                          : isSelected
                            ? "border-nebula-gold bg-nebula-gold text-cosmic-black"
                            : "border-white/20 text-stardust-white hover:border-nebula-gold/50 hover:text-nebula-gold"
                      }
                    `}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add to Cart Actions */}
      <div className="mb-10 flex gap-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-stardust-white py-4 font-body font-semibold uppercase tracking-widest text-cosmic-black transition-colors duration-300 hover:bg-nebula-gold disabled:bg-eclipse-silver"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`border p-4 transition-colors duration-300 ${
            isWishlisted
              ? "border-mangal-red text-mangal-red"
              : "border-white/20 text-stardust-white hover:border-mangal-red hover:text-mangal-red"
          }`}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`h-6 w-6 ${
              isWishlisted ? "fill-mangal-red text-mangal-red" : ""
            }`}
          />
        </button>
      </div>

      {/* Description */}
      <div className="mb-10">
        <h3 className="mb-4 font-body text-sm uppercase tracking-widest text-stardust-white">
          The Meaning
        </h3>
        <div
          className="prose prose-invert max-w-none font-body prose-p:mb-4 prose-p:leading-relaxed prose-p:text-eclipse-silver"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
        <div className="flex flex-col items-center gap-3 text-center">
          <Truck className="h-6 w-6 text-nebula-gold" />
          <span className="font-body text-xs uppercase tracking-wider text-stardust-white">
            Free Shipping
            <br />
            Above ₹999
          </span>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCcw className="h-6 w-6 text-nebula-gold" />
          <span className="font-body text-xs uppercase tracking-wider text-stardust-white">
            14-Day
            <br />
            Exchange Only
          </span>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldCheck className="h-6 w-6 text-nebula-gold" />
          <span className="font-body text-xs uppercase tracking-wider text-stardust-white">
            Premium
            <br />
            Quality
          </span>
        </div>
      </div>
    </div>
  );
}
