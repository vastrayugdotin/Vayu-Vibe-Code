"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    setIsApplyingCoupon(true);
    // Mock API call delay
    setTimeout(() => {
      setIsApplyingCoupon(false);
      alert(`Coupon ${couponCode} is invalid or expired.`); // Mock response
      setCouponCode("");
    }, 1000);
  };

  if (!mounted) return <div className="min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading text-heading-xl text-stardust-white mb-6">
          Your Cart is Empty
        </h1>
        <p className="font-body text-eclipse-silver mb-8 max-w-md">
          Looks like you haven&apos;t aligned with any cosmic artifacts yet.
          Explore our collections to find your match.
        </p>
        <Link
          href="/shop"
          className="bg-nebula-gold text-cosmic-black px-8 py-4 font-body font-semibold tracking-widest uppercase hover:bg-stardust-white transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99; // Free shipping threshold mock
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
      <h1 className="font-heading text-heading-xl text-stardust-white mb-10">
        Your Cart{" "}
        <span className="text-eclipse-silver text-2xl font-body ml-2">
          ({items.length} items)
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 border-t border-white/10 pt-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 sm:gap-6 py-6 border-b border-white/5 relative group"
            >
              {/* Product Image */}
              <div className="w-24 sm:w-32 aspect-[3/4] bg-deep-indigo/30 relative flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stardust-white/20">
                    <span className="text-xs uppercase">No Img</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link
                      href={`/shop/${item.productId}`}
                      className="hover:text-nebula-gold transition-colors block"
                    >
                      <h3 className="font-heading text-lg sm:text-xl text-stardust-white mb-1">
                        {item.title}
                      </h3>
                    </Link>
                    {item.variant?.size && (
                      <p className="font-body text-sm text-eclipse-silver mb-1">
                        Size: {item.variant.size}
                      </p>
                    )}
                    {item.variant?.color && (
                      <p className="font-body text-sm text-eclipse-silver">
                        Color: {item.variant.color}
                      </p>
                    )}
                  </div>
                  <span className="font-body font-medium text-stardust-white whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/20">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="p-2 text-stardust-white/70 hover:text-nebula-gold transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-body text-sm text-stardust-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-stardust-white/70 hover:text-nebula-gold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stardust-white/50 hover:text-mangal-red flex items-center gap-2 text-sm font-body transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-start mt-4">
            <button
              onClick={clearCart}
              className="text-sm font-body text-eclipse-silver hover:text-mangal-red underline underline-offset-4 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-void-black border border-white/10 p-6 md:p-8 sticky top-24">
            <h2 className="font-heading text-xl text-stardust-white mb-6 uppercase tracking-widest">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-white/10 font-body text-sm">
              <div className="flex justify-between text-eclipse-silver">
                <span>Subtotal</span>
                <span className="text-stardust-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-eclipse-silver">
                <span>Estimated Shipping</span>
                <span className="text-stardust-white">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-nebula-gold/80 italic">
                  Add {formatCurrency(999 - subtotal)} more to qualify for free
                  shipping.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-body text-lg text-stardust-white font-medium">
                Estimated Total
              </span>
              <span className="font-heading text-2xl text-nebula-gold">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-8">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE"
                className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-sm text-stardust-white font-body uppercase focus:outline-none focus:border-nebula-gold transition-colors"
              />
              <button
                type="submit"
                disabled={!couponCode || isApplyingCoupon}
                className="bg-white/10 text-stardust-white px-6 py-3 text-sm font-body font-medium uppercase hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplyingCoupon ? "..." : "Apply"}
              </button>
            </form>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-3 bg-nebula-gold text-cosmic-black font-body font-semibold tracking-widest uppercase py-4 hover:bg-stardust-white transition-colors duration-300"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-center text-eclipse-silver font-body mt-6">
              Taxes calculated at checkout. Shipping available across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
