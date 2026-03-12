"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import VariantSelector from "./VariantSelector";
import CosmicMetadata from "./CosmicMetadata";
import AddToCartButton from "./AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: any;
  variants: any[];
  onVariantChange?: (variant: any) => void;
}

export default function ProductInfo({
  product,
  variants,
  onVariantChange,
}: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<any | null>(null);

  const hasDiscount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);

  const currentPrice = selectedVariant?.priceOverride
    ? Number(selectedVariant.priceOverride)
    : Number(product.price);

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    if (onVariantChange) {
      onVariantChange(variant);
    }
  };

  // Stock level logic
  const totalStock = variants.reduce((acc, curr) => acc + curr.stock, 0);
  const getStockStatus = () => {
    if (totalStock <= 0) return { label: "Out of Alignment", color: "text-mangal-red" };
    if (totalStock <= 10) return { label: "Low Alignment", color: "text-nebula-gold" };
    return { label: "In Alignment", color: "text-budh-emerald" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Price */}
      <div className="space-y-4">
        <h1 className="font-heading text-4xl uppercase tracking-wider text-stardust-white md:text-5xl">
          {product.title}
        </h1>

        <div className="flex items-center gap-4">
          <span className="font-body text-3xl font-medium text-nebula-gold">
            {formatCurrency(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="font-body text-xl text-eclipse-silver line-through decoration-mangal-red/40">
              {formatCurrency(Number(product.compareAtPrice))}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse",
            stockStatus.label === "In Alignment" ? "bg-budh-emerald" :
            stockStatus.label === "Low Alignment" ? "bg-nebula-gold" : "bg-mangal-red"
          )} />
          <span className={cn("font-body text-[10px] uppercase tracking-widest", stockStatus.color)}>
            {stockStatus.label} ({totalStock} available)
          </span>
        </div>
      </div>

      {/* Cosmic Metadata */}
      <CosmicMetadata
        planet={product.planet}
        zodiacSign={product.zodiacSign}
        lifePathNumber={product.lifePathNumber}
        emotionalIntention={product.emotionalIntention}
        className="border-y border-white/10 py-6"
      />

      {/* Short Description */}
      <div className="prose prose-invert max-w-none">
        <p className="font-body text-sm leading-relaxed text-eclipse-silver">
          {product.description?.length > 200
            ? `${product.description.substring(0, 200)}...`
            : product.description}
        </p>
      </div>

      {/* Size Selector */}
      <VariantSelector
        variants={variants}
        selectedVariantId={selectedVariant?.id}
        onSelect={handleVariantSelect}
      />

      {/* Add to Cart */}
      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
        disabled={totalStock <= 0}
        className="h-16 w-full uppercase tracking-[0.2em] font-bold"
      />
    </div>
  );
}
