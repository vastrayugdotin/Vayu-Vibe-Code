# Tracking Events — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final Pre-Development  
> Cross-referenced from `prd_new.md` (Section 9) and `prisma/schema.prisma`.

---

## Table of Contents

1. [Tracking IDs & Configuration](#1-tracking-ids--configuration)
2. [Script Installation — Next.js](#2-script-installation--nextjs)
3. [DataLayer Architecture](#3-datalayer-architecture)
4. [GA4 E-Commerce Events](#4-ga4-e-commerce-events)
5. [Meta Pixel Events](#5-meta-pixel-events)
6. [Tag-Friendly Markup Conventions](#6-tag-friendly-markup-conventions)
7. [Implementation File Map](#7-implementation-file-map)
8. [Phase Rollout](#8-phase-rollout)

---

## 1. Tracking IDs & Configuration

| Service | ID | Status |
|---------|-----|--------|
| **Google Tag Manager** | `GTM-TWDX4B9R` | ✅ Live |
| **Google Analytics 4** | `G-WJ6E42CKNK` | ✅ Live |
| **Meta Pixel** | `PLACEHOLDER_META_PIXEL_ID` | ⏳ To be added before launch |

> All IDs are also stored in the `Settings` table and configurable from `/admin/settings` → Analytics tab:
> - `Settings.gtm_container_id` = `GTM-TWDX4B9R`
> - `Settings.meta_pixel_id` = `PLACEHOLDER_META_PIXEL_ID`

**GA4 is loaded via GTM** (recommended). The GTM container fires the GA4 configuration tag internally — no separate GA4 `<Script>` tag is needed in `layout.tsx`. GTM is the single script entry point.

---

## 2. Script Installation — Next.js

### 2.1 GTM Script (`app/(store)/layout.tsx`)

GTM is injected in the root storefront layout. Both the `<head>` and `<body>` snippets are required per Google's specification.

```tsx
// app/(store)/layout.tsx
import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID // 'GTM-TWDX4B9R'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ── Google Tag Manager (head) ── */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body>
        {/* ── Google Tag Manager (noscript body) ── */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  )
}
```

### 2.2 Environment Variables (`.env`)

```bash
NEXT_PUBLIC_GTM_ID=GTM-TWDX4B9R
NEXT_PUBLIC_GA4_ID=G-WJ6E42CKNK
NEXT_PUBLIC_META_PIXEL_ID=PLACEHOLDER_META_PIXEL_ID
```

### 2.3 GTM Container Setup (in GTM Dashboard)

Inside the GTM container `GTM-TWDX4B9R`, configure the following tags:

| Tag | Type | Trigger |
|-----|------|---------|
| GA4 Configuration | Google Tag — GA4 | All Pages |
| GA4 E-Commerce Events | GA4 Event | Custom DataLayer events (see Section 4) |
| Meta Pixel Base Code | Custom HTML | All Pages |
| Meta Pixel Standard Events | Custom HTML | Custom DataLayer events (see Section 5) |

> **GA4 Configuration tag** uses Measurement ID: `G-WJ6E42CKNK`

### 2.4 DataLayer Initialisation (`lib/datalayer.ts`)

The `dataLayer` array must be initialised before GTM loads. This is handled by the GTM snippet itself (`w[l]=w[l]||[]`). All push calls use this global helper:

```typescript
// lib/datalayer.ts

export function pushEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...payload })
}

// Clear ecommerce object before each push (GA4 recommendation)
export function pushEcommerceEvent(eventName: string, ecommerce: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null }) // Clear previous ecommerce data
  window.dataLayer.push({ event: eventName, ecommerce })
}
```

---

## 3. DataLayer Architecture

### 3.1 Item Object Shape (GA4 Ecommerce Item)

Constructed from `Product` + `ProductVariant` + `Category` models:

```typescript
// lib/datalayer.ts — buildGa4Item()
interface Ga4Item {
  item_id: string           // Product.id (CUID)
  item_name: string         // Product.title
  item_category: string     // Category.name
  item_category2?: string   // SubCategory.name (optional)
  item_variant?: string     // ProductVariant.size + colour  e.g. "M / Black"
  price: number             // ProductVariant.priceOverride ?? Product.price
  quantity?: number         // for cart/order events
  // Vastrayug cosmic extensions (custom dimensions in GA4)
  item_planet?: string      // NavagrahaPlanet enum value
  item_zodiac?: string      // ZodiacSign enum value
  item_collection?: string  // Collection.name
}
```

### 3.2 Type Declarations (`types/datalayer.d.ts`)

```typescript
interface Window {
  dataLayer: Record<string, unknown>[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}
```

---

## 4. GA4 E-Commerce Events

All events follow the [GA4 recommended e-commerce schema](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce).

---

### `page_view`
**Trigger:** Every route change in the Next.js app.  
**Component:** `app/(store)/layout.tsx` — router `pathname` effect.

```typescript
pushEvent('page_view', {
  page_path: window.location.pathname,
  page_title: document.title,
})
```

> GTM fires this automatically via the GA4 Configuration tag on `gtm.js` load and `gtm.historyChange` for SPA route changes.

---

### `view_item`
**Trigger:** Product Detail Page (PDP) mounted.  
**Component:** `app/(store)/shop/[slug]/page.tsx`  
**DB Models:** `Product`, `ProductVariant`, `Category`, `Collection`

```typescript
pushEcommerceEvent('view_item', {
  currency: 'INR',
  value: product.price,          // Product.price (Decimal → number)
  items: [buildGa4Item(product)],
})
```

---

### `view_item_list`
**Trigger:** Any product listing page mounted (shop, category, collection, search results).  
**Component:** `ProductGrid`  
**DB Models:** `Product[]`, `Category`

```typescript
pushEcommerceEvent('view_item_list', {
  item_list_id: listId,          // e.g. 'category_oversized-tees' | 'collection_saturn'
  item_list_name: listName,      // e.g. 'Oversized Tees' | 'Saturn — Shani Collection'
  items: products.map(buildGa4Item),
})
```

---

### `select_item`
**Trigger:** User clicks a `ProductCard` from any listing page.  
**Component:** `ProductCard` (`onClick` handler)

```typescript
pushEcommerceEvent('select_item', {
  item_list_id: listId,
  item_list_name: listName,
  items: [buildGa4Item(product)],
})
```

---

### `add_to_cart`
**Trigger:** "Add to Cart" button clicked and cart API succeeds.  
**Component:** `AddToCartButton`  
**DB Models:** `Cart`, `CartItem`, `ProductVariant`

```typescript
pushEcommerceEvent('add_to_cart', {
  currency: 'INR',
  value: selectedVariant.priceOverride ?? product.price,
  items: [{ ...buildGa4Item(product, selectedVariant), quantity }],
})
```

---

### `remove_from_cart`
**Trigger:** Cart item removed.  
**Component:** `CartItem` (remove button)  
**DB Models:** `CartItem`

```typescript
pushEcommerceEvent('remove_from_cart', {
  currency: 'INR',
  value: lineTotal,
  items: [{ ...buildGa4Item(product, variant), quantity }],
})
```

---

### `view_cart`
**Trigger:** Cart page (`/cart`) mounted.  
**Component:** `CartPage`  
**DB Models:** `Cart`, `CartItem`

```typescript
pushEcommerceEvent('view_cart', {
  currency: 'INR',
  value: cart.grandTotal,
  items: cart.items.map(item => ({ ...buildGa4Item(item.product, item.variant), quantity: item.quantity })),
})
```

---

### `begin_checkout`
**Trigger:** User reaches Step 1 of checkout (address entry).  
**Component:** `CheckoutPage` — Step 1 mount  
**DB Models:** `Cart`, `CartItem`, `Coupon`

```typescript
pushEcommerceEvent('begin_checkout', {
  currency: 'INR',
  value: cart.grandTotal,
  coupon: cart.couponCode ?? undefined,  // Coupon.code if applied
  items: cart.items.map(item => ({ ...buildGa4Item(item.product, item.variant), quantity: item.quantity })),
})
```

---

### `add_shipping_info`
**Trigger:** User completes Step 2 (shipping method selected).  
**Component:** `CheckoutPage` — Step 2 complete

```typescript
pushEcommerceEvent('add_shipping_info', {
  currency: 'INR',
  value: cart.grandTotal,
  shipping_tier: selectedShippingMethod, // e.g. 'Standard' | 'Express'
  items: cart.items.map(...),
})
```

---

### `add_payment_info`
**Trigger:** User reaches Step 3 (payment step — Razorpay modal about to open).  
**Component:** `CheckoutPage` — Step 3 mount / `RazorpayButton` pre-click

```typescript
pushEcommerceEvent('add_payment_info', {
  currency: 'INR',
  value: cart.grandTotal,
  payment_type: 'Razorpay',
  items: cart.items.map(...),
})
```

---

### `purchase`
**Trigger:** Order confirmed — `OrderConfirmationPage` mounted after successful payment.  
**Component:** `app/(store)/order-confirmation/[orderId]/page.tsx`  
**DB Models:** `Order`, `OrderItem`

```typescript
pushEcommerceEvent('purchase', {
  transaction_id: order.orderNumber,     // Order.order_number  e.g. 'VY-20260306-001'
  affiliation: 'Vastrayug',
  value: Number(order.total),            // Order.total
  tax: Number(order.taxAmount),          // Order.tax_amount
  shipping: Number(order.shippingCost),  // Order.shipping_cost
  currency: 'INR',
  coupon: order.couponCodeSnapshot ?? undefined,  // Order.coupon_code_snapshot
  items: order.items.map(item => ({
    item_id: item.productId,             // OrderItem.product_id
    item_name: item.productTitleSnapshot,// OrderItem.product_title_snapshot
    price: Number(item.unitPrice),       // OrderItem.unit_price
    quantity: item.quantity,             // OrderItem.quantity
  })),
})
```

---

### `sign_up`
**Trigger:** New user registration completes successfully.  
**Component:** Registration form success handler  
**DB Models:** `User` (role = `CUSTOMER`)

```typescript
pushEvent('sign_up', {
  method: 'email',    // 'email' | 'google' (Phase 4)
})
```

---

### `login`
**Trigger:** User successfully logs in.  
**Component:** Login form success / NextAuth `signIn` callback

```typescript
pushEvent('login', {
  method: 'email',    // 'email' | 'google' (Phase 4)
})
```

---

### `search`
**Trigger:** User submits a search query.  
**Component:** `SearchBar` — `onSubmit`

```typescript
pushEvent('search', {
  search_term: query,  // raw search input string
})
```

---

## 5. Meta Pixel Events

**Pixel ID:** `PLACEHOLDER_META_PIXEL_ID` — replace with live ID before launch.

### 5.1 Pixel Base Code (via GTM — Custom HTML Tag, All Pages)

```html
<!-- Meta Pixel Base Code — configured in GTM Custom HTML tag -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PLACEHOLDER_META_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=PLACEHOLDER_META_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
```

> **Replace `PLACEHOLDER_META_PIXEL_ID` before launch.**

### 5.2 Standard Event Reference

| Meta Event | GA4 Equivalent | Trigger | Key Parameters |
|------------|---------------|---------|----------------|
| `PageView` | `page_view` | Every page load (base code) | — |
| `ViewContent` | `view_item` | PDP mounted | `content_ids`, `content_type: 'product'`, `value`, `currency: 'INR'` |
| `AddToCart` | `add_to_cart` | Cart API success | `content_ids`, `content_type: 'product'`, `value`, `currency: 'INR'` |
| `InitiateCheckout` | `begin_checkout` | Checkout Step 1 | `value`, `currency: 'INR'`, `num_items` |
| `AddPaymentInfo` | `add_payment_info` | Checkout Step 3 | `value`, `currency: 'INR'` |
| `Purchase` | `purchase` | Order confirmation page | `value`, `currency: 'INR'`, `content_ids`, `content_type: 'product'` |
| `Lead` | — | Newsletter subscribe | — |
| `Search` | `search` | Search query submitted | `search_string` |

### 5.3 Pixel Event Push Helper (`lib/datalayer.ts`)

```typescript
export function pushPixelEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', eventName, params)
}
```

### 5.4 Implementation Examples

```typescript
// ViewContent — PDP
pushPixelEvent('ViewContent', {
  content_ids: [product.id],
  content_type: 'product',
  value: Number(product.price),
  currency: 'INR',
})

// AddToCart
pushPixelEvent('AddToCart', {
  content_ids: [product.id],
  content_type: 'product',
  value: Number(selectedVariant.priceOverride ?? product.price),
  currency: 'INR',
})

// Purchase — Order.total (Decimal → number)
pushPixelEvent('Purchase', {
  value: Number(order.total),
  currency: 'INR',
  content_ids: order.items.map(i => i.productId),
  content_type: 'product',
})

// Lead — newsletter
pushPixelEvent('Lead')
```

> **Event Deduplication (Phase 5):** When Meta Conversions API (server-side) is added, every client-side Pixel event must include an `eventID` that matches the server-side event. Add `eventID: crypto.randomUUID()` to all pixel calls and pass it to the API.

---

## 6. Tag-Friendly Markup Conventions

All interactive elements must carry meaningful `data-*` attributes to enable GTM trigger configuration without code changes (PRD Section 9.4).

### 6.1 Product Card

```html
<div
  data-product-id="{Product.id}"
  data-product-name="{Product.title}"
  data-product-category="{Category.name}"
  data-product-price="{Product.price}"
  data-product-planet="{Product.planet}"
  data-product-collection="{Collection.name}"
  data-gtm-action="select_item"
  data-gtm-category="product"
  data-gtm-label="{Product.title}"
>
```

### 6.2 Buttons & CTAs

```html
<!-- Add to Cart -->
<button
  id="btn-add-to-cart-{productId}"
  data-gtm-action="add_to_cart"
  data-gtm-category="cart"
  data-gtm-label="{Product.title}"
>

<!-- Begin Checkout -->
<button
  id="btn-begin-checkout"
  data-gtm-action="begin_checkout"
  data-gtm-category="checkout"
>

<!-- Newsletter Subscribe -->
<button
  id="btn-newsletter-subscribe"
  data-gtm-action="newsletter_subscribe"
  data-gtm-category="engagement"
>
```

### 6.3 Forms

```html
<!-- Search form -->
<form id="form-site-search" data-gtm-category="search">
  <input id="input-search-query" name="q" type="search" />
</form>

<!-- Newsletter form -->
<form id="form-newsletter" data-gtm-category="lead">
  <input id="input-newsletter-email" type="email" />
</form>
```

---

## 7. Implementation File Map

| File | Responsibility |
|------|---------------|
| `lib/datalayer.ts` | `pushEvent`, `pushEcommerceEvent`, `pushPixelEvent`, `buildGa4Item` helpers |
| `types/datalayer.d.ts` | `window.dataLayer`, `window.fbq` type declarations |
| `app/(store)/layout.tsx` | GTM `<Script>` head + noscript body injection; `page_view` on route change |
| `components/store/product/ProductCard.tsx` | `select_item` — `data-*` attributes + click handler |
| `app/(store)/shop/[slug]/page.tsx` | `view_item` on mount |
| `components/store/product/AddToCartButton.tsx` | `add_to_cart` + Meta `AddToCart` on API success |
| `components/store/cart/CartItem.tsx` | `remove_from_cart` on remove |
| `app/(store)/cart/page.tsx` | `view_cart` on mount |
| `app/(store)/checkout/page.tsx` | `begin_checkout`, `add_shipping_info`, `add_payment_info` |
| `app/(store)/order-confirmation/[orderId]/page.tsx` | `purchase` + Meta `Purchase` on mount |
| `components/store/layout/Navbar.tsx` (SearchBar) | `search` + Meta `Search` on submit |
| `app/(store)/shop/page.tsx` + listing pages | `view_item_list` on mount |
| `components/store/layout/NewsletterForm.tsx` | Meta `Lead` on subscribe success |
| `components/store/home/SolarSystemBanner.tsx` | `sign_up` / `login` events deferred to auth handlers |

---

## 8. Phase Rollout

| Feature | Phase |
|---------|-------|
| GTM container script installed (`GTM-TWDX4B9R`) | **Phase 1** |
| `page_view` DataLayer event | **Phase 1** |
| GA4 Configuration tag in GTM (`G-WJ6E42CKNK`) | **Phase 1** |
| Meta Pixel base code in GTM (`PLACEHOLDER_META_PIXEL_ID`) | **Phase 1** |
| `sign_up`, `login` events | **Phase 1** |
| Full GA4 e-commerce DataLayer events (all 11 events) | **Phase 3** |
| Meta Pixel standard events with all parameters | **Phase 3** |
| Tag-friendly markup audit across all components | **Phase 3** |
| Google social login `login` event (`method: 'google'`) | **Phase 4** |
| Pixel `eventID` deduplication for Conversions API | **Phase 5** |
| Meta Conversions API (server-side events) | **Phase 5** |

---

*Replace `PLACEHOLDER_META_PIXEL_ID` with the live Pixel ID before Phase 1 launch. All other IDs (`GTM-TWDX4B9R`, `G-WJ6E42CKNK`) are confirmed and ready.*
