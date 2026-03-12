"use client";

import * as React from "react";
import { pushEcommerceEvent, pushPixelEvent } from "@/lib/datalayer";

interface OrderConfirmationAnalyticsProps {
  order: any;
}

/**
 * OrderConfirmationAnalytics — Step 4.9g
 * Client-side component to fire purchase events on mount.
 * Reference: tracking_events.md §4.11, §5.5
 */
export default function OrderConfirmationAnalytics({ order }: OrderConfirmationAnalyticsProps) {
  React.useEffect(() => {
    if (!order) return;

    // 1. Fire GA4 purchase DataLayer event
    pushEcommerceEvent("purchase", {
      transaction_id: order.orderNumber,
      affiliation: "Vastrayug",
      value: Number(order.total),
      tax: Number(order.taxAmount),
      shipping: Number(order.shippingCost),
      currency: "INR",
      coupon: order.couponCodeSnapshot || undefined,
      items: order.items.map((item: any) => ({
        item_id: item.productId,
        item_name: item.productTitleSnapshot,
        price: Number(item.unitPrice),
        quantity: item.quantity,
        item_variant: (item.variantSnapshot as any)?.size,
      })),
    });

    // 2. Fire Meta Purchase pixel event
    pushPixelEvent("Purchase", {
      value: Number(order.total),
      currency: "INR",
      content_ids: order.items.map((i: any) => i.productId),
      content_type: "product",
    });
  }, [order]);

  return null;
}
