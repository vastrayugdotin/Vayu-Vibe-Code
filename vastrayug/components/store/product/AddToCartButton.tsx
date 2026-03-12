"use client";

import * as React from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import {
  pushEcommerceEvent,
  pushPixelEvent,
  buildGa4Item,
} from "@/lib/datalayer";

interface AddToCartButtonProps {
  product: any;
  selectedVariant: any;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  selectedVariant,
  disabled,
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a size first", {
        id: "select-size-error",
      });
      return;
    }

    setIsAdding(true);

    try {
      const price = Number(selectedVariant.priceOverride || product.price);

      // 1. Update Zustand Cart Store
      addItem({
        productId: product.id,
        title: product.title,
        price: price,
        quantity: 1,
        image: product.images?.[0]?.url,
        variant: {
          size: selectedVariant.size,
          color: selectedVariant.colour || undefined,
        },
      });

      // 2. Fire GA4 DataLayer Event
      pushEcommerceEvent("add_to_cart", {
        currency: "INR",
        value: price,
        items: [
          {
            ...buildGa4Item(product, {
              size: selectedVariant.size,
              colour: selectedVariant.colour,
              priceOverride: selectedVariant.priceOverride,
            }),
            quantity: 1,
          },
        ],
      });

      // 3. Fire Meta Pixel Event
      pushPixelEvent("AddToCart", {
        content_ids: [product.id],
        content_type: "product",
        value: price,
        currency: "INR",
        content_name: product.title,
        content_category: product.category?.name,
      });

      // 4. Show Success Notification
      toast.success(`${product.title} added to your cosmic satchel.`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to align artifact. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      isLoading={isAdding}
      className={className}
      data-gtm-action="add_to_cart"
      data-gtm-category="product"
      data-gtm-label={product.title}
    >
      {!isAdding && <ShoppingBag className="mr-2 h-4 w-4" />}
      {isAdding ? "Aligning..." : "Add to Satchel"}
    </Button>
  );
}
