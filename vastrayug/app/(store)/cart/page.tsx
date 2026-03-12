"use client";

import * as React from "react";
import Link from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import CartItem from "@/components/store/cart/CartItem";
import OrderSummary from "@/components/store/cart/OrderSummary";
import CouponInput from "@/components/store/cart/CouponInput";
import { pushEcommerceEvent } from "@/lib/datalayer";

/**
 * CartPage — Step 4.8b
 * Full cart page (CSR). Fires view_cart on mount.
 * Reference: prd_new.md §6.2, tracking_events.md §4.7
 */
export default function CartPage() {
  const { items, getTotalItems } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch for persistent store
  React.useEffect(() => {
    setMounted(true);

    // 4.8b: Fire view_cart DataLayer event
    if (items.length > 0) {
      pushEcommerceEvent("view_cart", {
        currency: "INR",
        value: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.title,
          price: item.price,
          quantity: item.quantity,
          item_variant: item.variant?.size,
        })),
      });
    }
  }, [items]);

  if (!mounted) return <div className="min-h-[60vh] bg-void-black" />;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-8 rounded-full bg-white/5 p-12 text-white/10">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <h1 className="mb-4 font-heading text-3xl text-stardust-white uppercase tracking-widest md:text-4xl">
          Your Satchel is Empty
        </h1>
        <p className="mb-10 max-w-md font-body text-eclipse-silver">
          The cosmos is vast, but your satchel remains light. Explore our collections to find your planetary alignment.
        </p>
        <Link href="/shop">
          <Button className="h-14 bg-stardust-white px-10 font-bold uppercase tracking-[0.2em] text-cosmic-black hover:bg-nebula-gold transition-colors">
            Explore Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-8">
        <h1 className="font-heading text-4xl text-stardust-white uppercase tracking-[0.2em] md:text-5xl">
          Your <span className="italic font-accent text-nebula-gold">Satchel</span>
        </h1>
        <span className="font-body text-sm text-eclipse-silver uppercase tracking-widest">
          {getTotalItems()} Artifacts
        </span>
      </div>

      <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
        {/* Items List */}
        <div className="flex-1">
          <div className="hidden border-b border-white/10 pb-4 md:grid md:grid-cols-12 md:gap-4">
            <div className="col-span-6 font-body text-[10px] uppercase tracking-[0.2em] text-eclipse-silver">Artifact</div>
            <div className="col-span-2 text-center font-body text-[10px] uppercase tracking-[0.2em] text-eclipse-silver">Price</div>
            <div className="col-span-2 text-center font-body text-[10px] uppercase tracking-[0.2em] text-eclipse-silver">Quantity</div>
            <div className="col-span-2 text-right font-body text-[10px] uppercase tracking-[0.2em] text-eclipse-silver">Total</div>
          </div>

          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-10">
            <Link href="/shop" className="text-sm font-body text-eclipse-silver hover:text-nebula-gold transition-colors underline underline-offset-8">
              ← Continue exploring the cosmos
            </Link>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="w-full lg:w-[400px]">
          <div className="sticky top-32 space-y-8 border border-white/10 bg-deep-indigo/10 p-8 shadow-2xl backdrop-blur-sm">
            <OrderSummary />

            <CouponInput />

            <div className="pt-4">
              <Link href="/checkout">
                <Button className="group h-16 w-full bg-stardust-white font-bold uppercase tracking-[0.2em] text-cosmic-black hover:bg-nebula-gold transition-all">
                  <span>Proceed to Alignment</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-nebula-gold animate-pulse" />
                <span className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver">
                  Secured by cosmic encryption
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-nebula-gold animate-pulse" />
                <span className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver">
                  Free returns within 14 moon cycles
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
