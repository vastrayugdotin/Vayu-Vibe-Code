"use client";

import * as React from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/store/cartStore";

interface CouponInputProps {
  className?: string;
}

/**
 * CouponInput — Step 4.8e
 * Handles coupon code validation and application.
 * Reference: prd_new.md §6.2
 */
export default function CouponInput({ className }: CouponInputProps) {
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { applyCoupon, removeCoupon, couponCode, discount } = useCartStore();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    try {
      // Step 4.8e: Call validation logic
      // For Phase 1, we implement a simple validation or call the (to be created) API
      const res = await fetch("/api/storefront/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        applyCoupon(data.code, data.discountAmount);
        toast.success(`Coupon "${data.code}" aligned! Saved ${data.discountAmount} INR.`);
        setCode("");
      } else {
        toast.error(data.message || "This cosmic code is invalid or expired.");
      }
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error("Failed to validate code. Connection lost.");
    } finally {
      setIsLoading(false);
    }
  };

  if (couponCode) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between border border-budh-emerald/20 bg-budh-emerald/5 p-3 rounded-sm">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-widest text-budh-emerald">
              Aligned Code
            </span>
            <span className="font-heading text-sm text-stardust-white uppercase tracking-wider">
              {couponCode} (-₹{discount})
            </span>
          </div>
          <button
            onClick={() => {
              removeCoupon();
              toast.success("Coupon removed from satchel.");
            }}
            className="text-xs text-mangal-red hover:underline underline-offset-4"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className={className}>
      <div className="flex flex-col gap-2">
        <label className="font-body text-[10px] uppercase tracking-[0.2em] text-eclipse-silver">
          Apply Cosmic Code
        </label>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="COSMOS20"
            className="h-12 bg-void-black border-white/10 uppercase tracking-widest text-xs"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!code || isLoading}
            isLoading={isLoading}
            variant="outline"
            className="h-12 px-6 border-white/10 text-stardust-white hover:bg-white/5 uppercase tracking-widest text-[10px]"
          >
            Apply
          </Button>
        </div>
      </div>
    </form>
  );
}
