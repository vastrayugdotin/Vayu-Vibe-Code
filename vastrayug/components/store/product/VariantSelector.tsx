"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: any[];
  selectedVariantId?: string;
  onSelect: (variant: any) => void;
  className?: string;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  className,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="font-body text-xs uppercase tracking-[0.2em] text-stardust-white">
          Select Size
        </span>
        <button className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver underline underline-offset-4 transition-colors hover:text-nebula-gold">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={cn(
                "flex h-12 items-center justify-center border font-body text-sm transition-all duration-300",
                {
                  "border-nebula-gold bg-nebula-gold text-cosmic-black font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)]":
                    isSelected,
                  "border-white/10 text-stardust-white hover:border-white/40":
                    !isSelected && !isOutOfStock,
                  "border-white/5 bg-white/5 text-white/20 cursor-not-allowed":
                    isOutOfStock,
                }
              )}
            >
              {variant.size}
            </button>
          );
        })}
      </div>

      {variants.find(v => v.id === selectedVariantId)?.stock <= 5 && variants.find(v => v.id === selectedVariantId)?.stock > 0 && (
        <p className="font-body text-[10px] text-nebula-gold animate-pulse italic">
          Only {variants.find(v => v.id === selectedVariantId).stock} artifacts remaining in this alignment.
        </p>
      )}
    </div>
  );
}
