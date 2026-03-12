"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface OrderSummaryProps {
  className?: string;
  showCheckoutButton?: boolean;
}

/**
 * OrderSummary — Step 4.8f
 * Displays breakdown: Subtotal, Discount, Shipping, Tax, Total.
 * Reference: prd_new.md §6.2
 */
export default function OrderSummary({ className }: OrderSummaryProps) {
  const { getSubtotal, discount, getTotalPrice } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : 99; // Basic shipping logic
  const tax = subtotal * 0.12; // 12% GST estimate
  const total = getTotalPrice() + shipping;

  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-xl uppercase tracking-widest text-stardust-white">
        Order Summary
      </h2>

      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex justify-between font-body text-sm">
          <span className="text-eclipse-silver uppercase tracking-widest">Subtotal</span>
          <span className="text-stardust-white">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between font-body text-sm">
            <span className="text-budh-emerald uppercase tracking-widest">Discount</span>
            <span className="text-budh-emerald">- {formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-body text-sm">
          <span className="text-eclipse-silver uppercase tracking-widest">Shipping</span>
          <span className="text-stardust-white">
            {shipping === 0 ? (
              <span className="text-budh-emerald">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between font-body text-sm">
          <span className="text-eclipse-silver uppercase tracking-widest">Estimated Tax (12%)</span>
          <span className="text-stardust-white">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between font-heading text-lg">
        <span className="text-stardust-white uppercase tracking-widest">Total</span>
        <span className="text-nebula-gold">{formatCurrency(total)}</span>
      </div>

      {shipping > 0 && (
        <p className="mt-4 font-body text-[10px] text-nebula-gold/80 italic leading-relaxed text-center">
          Add {formatCurrency(1000 - subtotal)} more for Free Shipping alignment.
        </p>
      )}
    </div>
  );
}
