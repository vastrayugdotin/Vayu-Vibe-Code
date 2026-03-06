# Vastrayug — Development Phases

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final
> Cross-referenced from `prd_new.md` (Section 14) and `tech_stack.md`.

---

## Phase Summary

```
Phase 1 (MVP)          → Ship a working store. 1 month deadline.
Phase 2 (Content)      → Drive organic traffic + conversions via blog & promos.
Phase 3 (Analytics)    → Understand what's working. Full tracking pipeline.
Phase 4 (Enhancements) → Retention features, social login, SMS, reviews.
Phase 5 (Scale)        → Automation, internationalisation, server-side tracking.
```

---

## 🔴 Phase 1 — MVP *(Target: 1 Month)*

**Priority: High** | This is your launch version.

### What Gets Built

| Area | Detail |
|------|--------|
| **Storefront** | Full product browsing (listing + detail page), shopping cart, checkout |
| **Payment** | Razorpay integration — cards, UPI, net banking, wallets |
| **User Accounts** | Email + password registration/login only (no social login yet) |
| **Admin Panel** | Products, categories, sub-categories, order management (manual status updates) |
| **Landing Page** | Animated solar system banner — **pure CSS** (zero JS overhead, 60fps) |
| **Collections** | 3–4 Navagraha planetary collections (not all 9 yet) |
| **Order Tracking** | Manual — admin enters tracking number + provider + link per order |
| **Analytics** | GTM container + Meta Pixel base code injected (base setup only) |
| **Email** | SendGrid transactional emails: order confirmation, shipping update, password reset |

### Tech Stack Active in Phase 1

- `Next.js 14.2` — App Router, ISR/SSR/CSR per page type
- `Prisma 5.14.x` + `MySQL 8.0.x` on Hostinger
- `NextAuth.js 4.24.x` — Credentials provider only
- `Razorpay SDK 2.9.x`
- `SendGrid 8.1.x`
- `Zustand 4.5.x` — cart state, mini-cart, popup visibility
- `Tailwind CSS 3.4.x` — full brand token configuration
- `Cloudflare` — CDN + DNS + DDoS protection
- `Hostinger Object Storage` — S3-compatible, product/blog images

### Feature Flags (OFF at Phase 1 Launch)

```env
NEXT_PUBLIC_BLOG_ENABLED=false
NEXT_PUBLIC_WISHLIST_ENABLED=false
NEXT_PUBLIC_REVIEWS_ENABLED=false
NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=false
NEXT_PUBLIC_SMS_ENABLED=false
```

---

## 🟠 Phase 2 — Content & Engagement

**Priority: High**

### What Gets Built

| Area | Detail |
|------|--------|
| **Blog Engine** | Full blog frontend (listing page, post page, SEO schemas) + admin blog management |
| **Newsletter** | Email capture in footer/pop-ups → SendGrid → fires `Lead` Meta event |
| **Pop-up System** | Timed, scroll-depth, exit-intent pop-ups — fully managed from admin panel |
| **Coupon Management** | Percentage/flat discount, usage limits, per-user limits, date ranges, applicability |
| **Promotions** | Site-wide or collection-specific promotions (auto-apply or code-required) |
| **Announcement Bar** | Top-of-site promotional strip — text, link, and colour managed from admin |

### Feature Flag Change

```env
NEXT_PUBLIC_BLOG_ENABLED=true
```

> **Why High Priority:** The blog directly drives SEO organic traffic. Pop-ups and coupons drive conversions. Both are critical for the first months post-launch.

---

## 🟡 Phase 3 — Analytics & Tracking

**Priority: Medium**

### What Gets Built

| Area | Detail |
|------|--------|
| **Full GA4 DataLayer Events** | All 13 events: `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase` etc. with full item arrays per GA4 e-commerce schema |
| **Meta Pixel Standard Events** | All 8 events: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`, `Search` with `content_ids`, `value`, `currency` |
| **Tag-Friendly Markup Audit** | All interactive elements get `data-gtm-action`, `data-gtm-category`, `data-gtm-label`, `data-product-id`, `data-product-name`, `data-product-price` attributes |
| **Performance Optimisation Pass** | Lighthouse score >90, LCP <1.2s, WebP/AVIF image audit, lazy loading review |

### GA4 Events Reference

| Event | Trigger |
|-------|---------|
| `page_view` | Every page load / route change |
| `view_item` | Product detail page viewed |
| `view_item_list` | Category / collection page viewed |
| `select_item` | Product clicked from a listing |
| `add_to_cart` | Item added to cart |
| `remove_from_cart` | Item removed from cart |
| `view_cart` | Cart page viewed |
| `begin_checkout` | Checkout initiated |
| `add_shipping_info` | Shipping step completed |
| `add_payment_info` | Payment step reached |
| `purchase` | Order confirmed — includes transaction ID, revenue, tax, shipping, items array |
| `sign_up` | New user registration |
| `login` | User login |
| `search` | Search query submitted |

> **Why a Separate Phase:** Real traffic and stable product pages are needed before investing in full analytics plumbing. Tag markup auditing requires the UI to be mostly finalised.

---

## 🔵 Phase 4 — Enhancements

**Priority: Medium**

### What Gets Built

| Area | Detail |
|------|--------|
| **Google Social Login** | `GoogleProvider` in NextAuth — already scaffolded in `lib/auth.ts` (commented out), just needs enabling |
| **SMS Notifications via Twilio** | `NEXT_PUBLIC_SMS_ENABLED=true` — 4 triggers: Order Placed, Shipped, Out for Delivery, Delivered |
| **Product Reviews** | User submission + admin moderation (pending → approved / rejected) |
| **Wishlist** | Logged-in users can save and manage products |
| **Advanced Filters** | Filter by ruling planet, zodiac sign, life path number on listing pages |
| **Search Autocomplete** | Real-time suggestions as user types — by product name, planet, zodiac, collection |
| **Admin Dashboard Analytics** | Revenue charts, top products, order trends using `recharts 2.12.x` |
| **Admin RBAC** | Full Role-Based Access Control: Super Admin / Content Manager / Order Manager |

### SMS Trigger Messages (Twilio)

| Trigger | Message |
|---------|---------|
| Order Placed | `"Your Vastrayug order #{orderNumber} has been placed. Track it at vastrayug.in/account"` |
| Shipped | `"Your order #{orderNumber} has shipped. Tracking: {trackingUrl}"` |
| Out for Delivery | `"Your Vastrayug order #{orderNumber} is out for delivery today. 🌟"` |
| Delivered | `"Your Vastrayug order #{orderNumber} has been delivered. Wear your cosmic identity."` |

### Feature Flag Changes

```env
NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=true
NEXT_PUBLIC_SMS_ENABLED=true
NEXT_PUBLIC_REVIEWS_ENABLED=true
NEXT_PUBLIC_WISHLIST_ENABLED=true
```

> **Note:** Most Phase 4 features are already scaffolded in the codebase (`lib/twilio.ts`, `GoogleProvider` code stub, feature flags). Phase 4 is primarily enabling + wiring up UI — not rewriting logic.

---

## ⚪ Phase 5 — Scale & Iterate

**Priority: Low** *(Post product-market fit)*

### What Gets Built

| Area | Detail |
|------|--------|
| **Shipping Provider API Integration** | Delhivery / DTDC real-time tracking — replaces manual admin tracking updates |
| **Meta Conversions API (server-side)** | Server-side event deduplication with hashed email + phone for iOS privacy compliance |
| **Multi-currency Support** | Beyond INR — for international customers |
| **Internationalisation (i18n)** | Multi-language support; English-only at launch |
| **A/B Testing Infrastructure** | Test UI variants, offer placements, CTA copy |
| **Personalisation** | Product recommendations driven by zodiac sign, ruling planet, life path number |

### Technologies Deferred to Phase 5 (or later)

| Technology | Reason Deferred | When to Add |
|-----------|----------------|-------------|
| **Facebook OAuth** | Requires separate Meta App review and approval | Future post-Phase 4 |
| **Meta Conversions API** | Requires hashed user data pipeline | Phase 5 |
| **Shipping Provider APIs** (Delhivery, DTDC) | Manual tracking adequate at launch | Phase 5 |
| **Multi-currency** | INR only at launch | Phase 5 |
| **i18n** | English only at launch | Phase 5 |
| **Redis** | No caching layer needed at launch scale | If 1k+ concurrent users hit DB bottlenecks |
| **Elasticsearch** | Prisma full-text search adequate | If product catalogue exceeds 50k items |
| **Stripe** | Razorpay covers all Indian payment methods | If international expansion |
| **Next.js 15** | Breaking caching changes; await GA stabilisation | After v15.1+ stable |
| **A/B Testing** | No infrastructure at launch | Phase 5 |

---

## Rendering Strategy Per Page (Phase 1 Baseline)

| Page | Strategy | Reason |
|------|----------|--------|
| Home / Landing | **ISR** (revalidate: 3600) | Marketing content; CDN-cacheable |
| Product Listing | **ISR** (revalidate: 300) | Frequently updated but cacheable |
| Product Detail | **ISR** (revalidate: 60) + `generateStaticParams` | SEO + fresh stock data |
| Blog Listing | **ISR** (revalidate: 3600) | Content rarely changes |
| Blog Post | **ISR** (revalidate: 3600) + `generateStaticParams` | SEO-critical |
| Cart | **CSR** | Session-specific; never cached |
| Checkout | **SSR** | User-specific; real-time |
| Account / Orders | **SSR** | Auth-protected, user-specific |
| Admin Panel | **CSR** | Auth-protected; no public indexing |

---

*Phases defined in `prd_new.md` Section 14. Tech versions locked in `tech_stack.md`.*
