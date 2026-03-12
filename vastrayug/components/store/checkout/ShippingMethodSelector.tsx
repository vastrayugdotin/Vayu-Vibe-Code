"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Reliable delivery across India",
    price: 99,
    estimatedDays: "5-7 business days",
  },
  {
    id: "express",
    name: "Cosmic Express",
    description: "Priority handling and faster transit",
    price: 199,
    estimatedDays: "2-3 business days",
  },
];

interface ShippingMethodSelectorProps {
  selectedId: string;
  onSelect: (method: ShippingMethod) => void;
  subtotal: number;
}

export default function ShippingMethodSelector({
  selectedId,
  onSelect,
  subtotal,
}: ShippingMethodSelectorProps) {
  // Free shipping logic for standard
  const methods = METHODS.map((m) => {
    if (m.id === "standard" && subtotal > 999) {
      return { ...m, price: 0, description: "Free for orders over ₹999" };
    }
    return m;
  });

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg uppercase tracking-widest text-stardust-white">
        Shipping Method
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method)}
            className={cn(
              "relative flex items-center justify-between border p-5 text-left transition-all duration-300",
              selectedId === method.id
                ? "border-nebula-gold bg-nebula-gold/5"
                : "border-white/10 bg-void-black hover:border-white/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  selectedId === method.id
                    ? "border-nebula-gold bg-nebula-gold"
                    : "border-white/20 bg-transparent"
                )}
              >
                {selectedId === method.id && <div className="h-2 w-2 rounded-full bg-cosmic-black" />}
              </div>
              <div>
                <p className="font-body text-sm font-bold text-stardust-white uppercase tracking-wider">
                  {method.name}
                </p>
                <p className="font-body text-xs text-eclipse-silver mt-1">{method.description}</p>
                <p className="font-body text-[10px] text-nebula-gold mt-1 uppercase tracking-tighter italic">
                  Est. Delivery: {method.estimatedDays}
                </p>
              </div>
            </div>
            <span className="font-body text-sm font-medium text-stardust-white">
              {method.price === 0 ? "FREE" : formatCurrency(method.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
