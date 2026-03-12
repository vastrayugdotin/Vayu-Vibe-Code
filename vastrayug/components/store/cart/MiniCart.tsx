"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import CartItem from "./CartItem";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-cosmic-black/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-[101] flex h-full w-full flex-col bg-void-black border-l border-white/10 shadow-2xl md:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-nebula-gold" />
                <h2 className="font-heading text-xl tracking-wide text-stardust-white uppercase">
                  Your Satchel ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-eclipse-silver transition-colors hover:text-stardust-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 rounded-full bg-white/5 p-8 text-white/20">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg text-stardust-white uppercase">
                    Your satchel is empty
                  </h3>
                  <p className="mb-8 font-body text-sm text-eclipse-silver">
                    Your cosmic alignment awaits. Explore the collections to begin.
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-nebula-gold text-cosmic-black font-semibold uppercase tracking-widest px-8"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} variant="compact" />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 bg-cosmic-black/50 p-6 backdrop-blur-md">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-body text-sm uppercase tracking-widest text-eclipse-silver">
                    Subtotal
                  </span>
                  <span className="font-heading text-xl text-stardust-white">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                <p className="mb-6 font-body text-[10px] text-center uppercase tracking-[0.2em] text-eclipse-silver">
                  Shipping & taxes calculated at checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/checkout" onClick={onClose}>
                    <Button className="w-full bg-stardust-white text-cosmic-black font-bold uppercase tracking-[0.2em] h-14 hover:bg-nebula-gold">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={onClose}>
                    <Button variant="outline" className="w-full border-white/10 text-stardust-white font-semibold uppercase tracking-[0.2em] h-12 hover:bg-white/5">
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
