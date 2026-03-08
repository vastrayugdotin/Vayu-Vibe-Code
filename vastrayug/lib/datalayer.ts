// ─────────────────────────────────────────────────────────────
// Vastrayug — DataLayer & Analytics Helpers
// Reference: tracking_events.md §2.4, §3, §5.3
//
// Central module for all analytics event pushes:
//   • GA4 via GTM DataLayer
//   • Meta Pixel via fbq()
//
// All functions are SSR-safe (no-op when window is undefined).
// ─────────────────────────────────────────────────────────────

import type { Decimal } from "@prisma/client/runtime/library";

// ── Types ────────────────────────────────────────────────────

/** GA4 e-commerce item shape per Google's recommended schema. */
export interface Ga4Item {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  // Vastrayug cosmic extensions (GA4 custom dimensions)
  item_planet?: string;
  item_zodiac?: string;
  item_collection?: string;
}

/** Payload for pushEvent — event name + arbitrary key-value data. */
export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

/** Payload for pushEcommerceEvent — typed ecommerce object. */
export interface EcommercePayload {
  currency?: string;
  value?: number;
  transaction_id?: string;
  affiliation?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  shipping_tier?: string;
  payment_type?: string;
  item_list_id?: string;
  item_list_name?: string;
  items?: Ga4Item[];
  [key: string]: unknown;
}

/**
 * Minimal product shape expected by buildGa4Item.
 * Matches the fields available after a Prisma query with
 * `include: { category: true, subCategory: true, collections: { include: { collection: true } } }`.
 */
export interface Ga4ProductInput {
  id: string;
  title: string;
  price: Decimal | number;
  planet?: string | null;
  zodiacSign?: string | null;
  category?: { name: string } | null;
  subCategory?: { name: string } | null;
  collections?: Array<{ collection: { name: string } }> | null;
}

/** Optional variant to merge into the GA4 item. */
export interface Ga4VariantInput {
  size: string;
  colour?: string | null;
  priceOverride?: Decimal | number | null;
}

// ── GA4 DataLayer Helpers ────────────────────────────────────

/**
 * Push a generic event to the GTM DataLayer.
 *
 * @example
 *   pushEvent({ event: 'login', method: 'email' })
 */
export function pushEvent(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Push a GA4 e-commerce event to the DataLayer.
 * Clears the previous `ecommerce` object first (GA4 recommendation).
 *
 * @example
 *   pushEcommerceEvent('view_item', {
 *     currency: 'INR',
 *     value: 1999,
 *     items: [buildGa4Item(product)],
 *   })
 */
export function pushEcommerceEvent(
  event: string,
  ecommerce: EcommercePayload,
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce data
  window.dataLayer.push({ event, ecommerce });
}

// ── Meta Pixel Helper ────────────────────────────────────────

/**
 * Fire a Meta Pixel standard event via `fbq('track', ...)`.
 * No-op if the Pixel script hasn't loaded or during SSR.
 *
 * @example
 *   pushPixelEvent('Purchase', { value: 1999, currency: 'INR' })
 */
export function pushPixelEvent(
  event: string,
  data?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, data);
}

// ── GA4 Item Builder ─────────────────────────────────────────

/**
 * Map a Prisma Product (with included relations) to a GA4 e-commerce item.
 * Optionally accepts a variant to set `item_variant` and override price.
 *
 * @example
 *   const item = buildGa4Item(product)
 *   const itemWithVariant = buildGa4Item(product, selectedVariant)
 */
export function buildGa4Item(
  product: Ga4ProductInput,
  variant?: Ga4VariantInput,
): Ga4Item {
  const item: Ga4Item = {
    item_id: product.id,
    item_name: product.title,
    item_category: product.category?.name ?? "Uncategorized",
    price: Number(variant?.priceOverride ?? product.price),
  };

  if (product.subCategory?.name) {
    item.item_category2 = product.subCategory.name;
  }

  if (variant) {
    item.item_variant = variant.colour
      ? `${variant.size} / ${variant.colour}`
      : variant.size;
  }

  if (product.planet) {
    item.item_planet = product.planet;
  }

  if (product.zodiacSign) {
    item.item_zodiac = product.zodiacSign;
  }

  if (product.collections?.length) {
    item.item_collection = product.collections[0].collection.name;
  }

  return item;
}
