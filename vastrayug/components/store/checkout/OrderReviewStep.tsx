"use client";

import * as React from "react";
import Image from "next/image";
import { formatCurrency, cn } from "@/lib/utils";
import { type CartItem } from "@/store/cartStore";

interface OrderReviewStepProps {
  items: CartItem[];
  shippingAddress: any;
  shippingMethod: any;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export default function OrderReviewStep({
  items,
  shippingAddress,
  shippingMethod,
  subtotal,
  discount,
  tax,
  total,
}: OrderReviewStepProps) {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Shipment Summary */}
      <section className="border border-white/10 bg-deep-indigo/10 p-6 md:p-8">
        <h3 className="mb-6 font-heading text-lg uppercase tracking-widest text-stardust-white border-b border-white/5 pb-4">
          Shipment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nebula-gold mb-3">Delivery Address</h4>
            <div className="font-body text-sm text-eclipse-silver space-y-1">
              <p className="text-stardust-white font-medium">{shippingAddress.name}</p>
              <p>{shippingAddress.line1}</p>
              {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
              <p>Phone: +91 {shippingAddress.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nebula-gold mb-3">Shipping Method</h4>
            <div className="font-body text-sm text-eclipse-silver">
              <p className="text-stardust-white font-medium uppercase tracking-wider">{shippingMethod.name}</p>
              <p className="mt-1 italic">{shippingMethod.estimatedDays}</p>
              <p className="mt-1">{shippingMethod.price === 0 ? "Free Shipping" : formatCurrency(shippingMethod.price)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Item Review */}
      <section>
        <h3 className="mb-6 font-heading text-lg uppercase tracking-widest text-stardust-white">
          Review Artifacts ({items.length})
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 border-b border-white/5 pb-4 last:border-0">
              <div className="relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden bg-deep-indigo/30">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] text-white/20">VASTRA</div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <h4 className="font-heading text-sm text-stardust-white">{item.title}</h4>
                <p className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver mt-1">
                  Qty: {item.quantity} • {item.variant?.size && `Size: ${item.variant.size}`} {item.variant?.color && `• Color: ${item.variant.color}`}
                </p>
              </div>
              <div className="flex flex-col justify-center text-right">
                <span className="font-body text-sm text-stardust-white">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Totals Summary */}
      <section className="border-t border-white/10 pt-8">
        <div className="ml-auto max-w-xs space-y-4">
          <div className="flex justify-between font-body text-sm">
            <span className="text-eclipse-silver uppercase tracking-widest">Subtotal</span>
            <span className="text-stardust-white">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between font-body text-sm">
              <span className="text-mangal-red uppercase tracking-widest">Discount</span>
              <span className="text-mangal-red">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-body text-sm">
            <span className="text-eclipse-silver uppercase tracking-widest">Shipping</span>
            <span className="text-stardust-white">{shippingMethod.price === 0 ? "FREE" : formatCurrency(shippingMethod.price)}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-eclipse-silver uppercase tracking-widest">GST (Included)</span>
            <span className="text-stardust-white">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 font-heading text-xl">
            <span className="text-stardust-white uppercase tracking-widest">Total</span>
            <span className="text-nebula-gold">{formatCurrency(total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
