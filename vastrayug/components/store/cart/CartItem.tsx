"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;
  variant?: "default" | "compact";
}

export default function CartItem({ item, variant = "default" }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex gap-4 py-4 border-b border-white/5">
        <div className="relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-deep-indigo/20">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-stardust-white/20">
              VAYU
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-heading text-sm text-stardust-white line-clamp-1">
              {item.title}
            </h4>
            <p className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver">
              {item.variant?.size} {item.variant?.color && `/ ${item.variant.color}`}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border border-white/10 px-2 py-1">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="text-stardust-white/60 hover:text-nebula-gold"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-body text-xs text-stardust-white w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="text-stardust-white/60 hover:text-nebula-gold"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="font-body text-sm font-medium text-nebula-gold">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 py-8 border-b border-white/10 items-center">
      {/* Product Image & Title */}
      <div className="col-span-12 md:col-span-6 flex gap-6">
        <div className="relative aspect-[3/4] h-32 flex-shrink-0 overflow-hidden border border-white/10 bg-deep-indigo/20">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-stardust-white/20">
              VASTRAYUG
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <h3 className="font-heading text-xl text-stardust-white">
            {item.title}
          </h3>
          <div className="flex gap-4">
            <p className="font-body text-xs uppercase tracking-widest text-eclipse-silver">
              Size: <span className="text-stardust-white">{item.variant?.size}</span>
            </p>
            {item.variant?.color && (
              <p className="font-body text-xs uppercase tracking-widest text-eclipse-silver">
                Color: <span className="text-stardust-white">{item.variant.color}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-2 text-xs text-mangal-red/60 hover:text-mangal-red transition-colors mt-2"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove from alignment</span>
          </button>
        </div>
      </div>

      {/* Unit Price */}
      <div className="hidden md:flex col-span-2 justify-center font-body text-eclipse-silver">
        {formatCurrency(item.price)}
      </div>

      {/* Quantity Stepper */}
      <div className="col-span-6 md:col-span-2 flex justify-start md:justify-center">
        <div className="flex items-center gap-4 border border-white/10 px-4 py-2 bg-cosmic-black">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="text-stardust-white/60 hover:text-nebula-gold transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-body text-sm font-medium text-stardust-white min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="text-stardust-white/60 hover:text-nebula-gold transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="col-span-6 md:col-span-2 flex justify-end font-body font-semibold text-stardust-white text-lg">
        {formatCurrency(item.price * item.quantity)}
      </div>
    </div>
  );
}
