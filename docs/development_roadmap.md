# Development Roadmap — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Ready to Execute
> This is the master development guide. Every step references the exact document that defines it.
> Current codebase state: **docs + schema only — no code written yet.**

---

## Table of Contents

1. [Document Inventory](#1-document-inventory)
2. [Missing Files & Data Required Before Starting](#2-missing-files--data-required-before-starting)
3. [Pre-Development Setup](#3-pre-development-setup)
4. [Phase 1 — MVP](#4-phase-1--mvp-target-1-month)
5. [Phase 2 — Content & Engagement](#5-phase-2--content--engagement)
6. [Phase 3 — Analytics & Tracking](#6-phase-3--analytics--tracking)
7. [Phase 4 — Enhancements](#7-phase-4--enhancements)
8. [Phase 5 — Scale & Iterate](#8-phase-5--scale--iterate)
9. [Deployment Checklist](#9-deployment-checklist)

---

## 1. Document Inventory

All planning documents are complete. Here is every file and its role in development:

| File | Location | Role | Used In |
|------|----------|------|---------|
| `prd_new.md` | `docs/` | Master product requirements — features, flows, data models | All phases |
| `tech_stack.md` | `docs/` | All package versions, config code, env vars, auth, payments | All phases |
| `schema.prisma` | `prisma/` | Single source of truth for all database models | All phases |
| `_schema.md` | `docs/` | Human-readable schema reference with column notes | All phases |
| `component_architecture.md` | `docs/` | Directory structure, component tree, API routes, state | All phases |
| `admin_panel_spec.md` | `docs/` | Every admin screen, form field, API route, RBAC | Phase 1–4 |
| `phases.md` | `docs/` | Phase scope, feature flags, tech stack per phase | All phases |
| `tracking_events.md` | `docs/` | GTM/GA4/Meta Pixel events, DataLayer helpers, script install | Phase 1, 3 |
| `seo_blog_strategy.md` | `docs/` | SEO architecture, JSON-LD schemas, keyword strategy, blog content | Phase 1, 2, 3 |
| `Brand_values_and_vision.md` | `docs/` | Brand voice, palette, Navagraha framework, persona profiles | All phases (copy & design) |
| `PRD.md` | `docs/` | Earlier PRD version — superseded by `prd_new.md` | Reference only |

---

## 2. Missing Files & Data Required Before Starting

> These are **blockers** (🔴) and **non-blockers** (🟡) you need to collect before or during development.

### 🔴 Blockers — Required Before Phase 1 Can Go Live

| What's Missing | Where Defined | Action Required |
|---------------|--------------|-----------------|
| **Razorpay API Keys** (Key ID + Key Secret) | `tech_stack.md §6`, `tracking_events.md` | Log in to [razorpay.com](https://razorpay.com), create a Live account, activate it. Copy `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`. |
| **SendGrid API Key** | `tech_stack.md §7` | Log in to [sendgrid.com](https://sendgrid.com), create an API key with Mail Send permission. Verify `orders@vastrayug.in` as sender domain. Copy `SENDGRID_API_KEY`. |
| **Database Connection String** | `tech_stack.md §4` | From Hostinger hPanel → MySQL → create database `vastrayug_db`. Copy the connection string into `DATABASE_URL`. |
| **Hostinger Object Storage credentials** | `tech_stack.md §9` | From hPanel → Object Storage → create bucket `vastrayug-assets`. Copy endpoint, access key, secret key into `STORAGE_*` env vars. |
| **NextAuth Secret** | `tech_stack.md §5` | Run `openssl rand -base64 32` → paste into `NEXTAUTH_SECRET`. |
| **`NEXTAUTH_URL`** | `tech_stack.md §15` | Set to `https://vastrayug.in` for production; `http://localhost:3000` for local dev. |

### 🟡 Non-Blockers — Collect Before Launch, Not Before Build

| What's Missing | Action Required | Latest By |
|---------------|-----------------|-----------|
| **Meta Pixel ID** | Obtain from Meta Business Manager → Events Manager → Create Pixel. Replace `PLACEHOLDER_META_PIXEL_ID` in `tracking_events.md` and set `NEXT_PUBLIC_META_PIXEL_ID` env var. | Before Phase 1 goes live |
| **SendGrid Email Template IDs** | Build 7 email templates in SendGrid Dynamic Templates. Copy template IDs into `Settings` table via admin panel. | Before Phase 1 goes live |
| **Cloudflare Account + DNS setup** | Add `vastrayug.in` to Cloudflare. Point Hostinger nameservers to Cloudflare. Set SSL to Full (strict). | Before Phase 1 goes live |
| **Razorpay Webhook Secret** | In Razorpay dashboard → Webhooks → create endpoint `https://vastrayug.in/api/webhooks/razorpay` → copy webhook secret into `RAZORPAY_WEBHOOK_SECRET`. | Before Phase 1 goes live |
| **Google OAuth Credentials** | Google Cloud Console → Create OAuth 2.0 Client ID. Needed for Phase 4 only, but scaffold env var now. | Before Phase 4 |
| **Twilio Account SID + Auth Token + Phone Number** | Sign up at twilio.com. Needed for Phase 4 only. | Before Phase 4 |

### 📄 Files That Still Need To Be Created

| File | Contents | When Needed |
|------|----------|-------------|
| `.env.example` | All env vars with placeholder values — committed to git | Before first commit |
| `.env.local` | Real secrets — never committed | Before local dev |
| `prisma/seed.ts` | Seed script: super admin, categories, collections, settings defaults | Phase 1 — before first `prisma db seed` |
| `email_templates/` | SendGrid dynamic template HTML for 7 transactional emails | Before Phase 1 goes live |
| `public/brand/logo.png` | Brand logo file (PNG, transparent background) | Phase 1 |
| `public/brand/favicon.ico` | Favicon | Phase 1 |
| `public/brand/og-default.jpg` | Default Open Graph image (1200×630px) | Phase 1 |

---

## 3. Pre-Development Setup

**Complete these steps once before writing any code. Reference: `tech_stack.md`.**

### Step 3.1 — Initialise the Next.js Project

```bash
# In your project root
npx create-next-app@14.2 ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

> Do NOT use Next.js 15 — `tech_stack.md §2` locks on version `14.2.x`.

### Step 3.2 — Install All Dependencies

Install the exact versions from `tech_stack.md §13` (package.json). Key packages:

```bash
# Core
npm install prisma@5.14.x @prisma/client@5.14.x
npm install next-auth@4.24.x @auth/prisma-adapter

# UI + Forms
npm install @tanstack/react-query@5.x react-hook-form@7.51.x zod@3.23.x
npm install zustand@4.5.x @tiptap/react@2.4.x @tiptap/pm @tiptap/starter-kit
npm install react-dropzone@14.x recharts@2.12.x
npm install lucide-react@0.378.x react-hot-toast@2.4.x
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-dropdown-menu

# Backend
npm install razorpay@2.9.x @sendgrid/mail@8.1.x bcryptjs
npm install @aws-sdk/client-s3@3.x

# Tailwind plugins
npm install -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio @tailwindcss/container-queries

# Types
npm install -D @types/bcryptjs
```

### Step 3.3 — Configure Tailwind

Copy the full `tailwind.config.ts` from `tech_stack.md §3` — it contains every brand colour token, font variable, animation keyframe, and plugin. Do not use a bare Tailwind config.

### Step 3.4 — Configure Fonts

Copy the `next/font/google` setup from `tech_stack.md §3`:
- `Cormorant_Garamond` → `--font-cormorant` (headings)
- `Inter` → `--font-inter` (body)
- `Playfair_Display` → `--font-playfair-display` (accent/taglines)

### Step 3.5 — Initialise Prisma

```bash
npx prisma init --datasource-provider mysql
```

Then **replace the generated `schema.prisma`** entirely with `prisma/schema.prisma`. This schema is complete and production-ready — do not modify it without updating `_schema.md` first.

```bash
# Verify schema is valid
npx prisma validate

# Generate Prisma Client
npx prisma generate
```

### Step 3.6 — Create `.env.local`

Using `tech_stack.md §15` as the complete reference, create `.env.local` with all variables. Minimum for local dev:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/vastrayug_dev"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GTM_ID="GTM-TWDX4B9R"
NEXT_PUBLIC_GA4_ID="G-WJ6E42CKNK"
NEXT_PUBLIC_META_PIXEL_ID="PLACEHOLDER_META_PIXEL_ID"
RAZORPAY_KEY_ID="rzp_test_xxxx"
RAZORPAY_KEY_SECRET="xxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxx"
SENDGRID_API_KEY="SG.xxxx"
SENDGRID_FROM_EMAIL="orders@vastrayug.in"
STORAGE_ENDPOINT="https://..."
STORAGE_ACCESS_KEY="xxxx"
STORAGE_SECRET_KEY="xxxx"
STORAGE_BUCKET_NAME="vastrayug-assets"
STORAGE_PUBLIC_URL="https://..."
STORAGE_PUBLIC_HOSTNAME="..."
# Feature flags
NEXT_PUBLIC_BLOG_ENABLED=false
NEXT_PUBLIC_WISHLIST_ENABLED=false
NEXT_PUBLIC_REVIEWS_ENABLED=false
NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=false
NEXT_PUBLIC_SMS_ENABLED=false
```

### Step 3.7 — Run First Migration & Seed

```bash
# Create DB + apply all migrations
npx prisma migrate dev --name init

# Seed: super admin + categories + collections + settings defaults
npx prisma db seed
```

The seed script (`prisma/seed.ts`) must create:
- Super Admin: `vastrayug.in@gmail.com` / `admin` (bcrypt, 12 rounds) — per `admin_panel_spec.md §3`
- 7 categories: Oversized Tees, Hoodies, Co-ord Sets, Joggers, Jackets, Kurtas, Accessories — per `admin_panel_spec.md §7.2`
- 9 collections (4 planetary + 5 Vibe) — per `admin_panel_spec.md §8.3`
- Default Settings keys — per `admin_panel_spec.md §16`

### Step 3.8 — Configure `next.config.mjs`

Copy from `tech_stack.md §10` — sets up `next/image` remote patterns for Hostinger storage + Google avatars.

---

## 4. Phase 1 — MVP *(Target: 1 Month)*

**Reference documents for this phase:**
- `prd_new.md` §5, §6, §8.1–8.5, §8.10, §11, §12, §13.1–13.5
- `component_architecture.md` — full directory structure + storefront + admin components
- `admin_panel_spec.md` §1–10, §16, §18–20
- `tech_stack.md` — entire document
- `tracking_events.md` §1, §2 (GTM script installation only)
- `seo_blog_strategy.md` §2, §3, §7.2, §7.3, §8 (Phase 1 checklist)

---

### Step 4.1 — Project Foundation

**Build in this order — dependencies first:**

- [ ] `app/layout.tsx` — Root layout: font variables, GTM `<Script>` (from `tracking_events.md §2.1`)
- [ ] `app/globals.css` — Base CSS reset, `@font-face` variable declarations
- [ ] `middleware.ts` — Auth gate for `/admin/*` and `/account/*` (from `tech_stack.md §5`)
- [ ] `lib/prisma.ts` — Prisma client singleton (from `tech_stack.md §4`)
- [ ] `lib/auth.ts` — NextAuth config with CredentialsProvider + RBAC helpers (from `tech_stack.md §5`)
- [ ] `lib/datalayer.ts` — `pushEvent`, `pushEcommerceEvent`, `pushPixelEvent`, `buildGa4Item` (from `tracking_events.md §2.4`)
- [ ] `lib/razorpay.ts` — Razorpay client (from `tech_stack.md §6`)
- [ ] `lib/sendgrid.ts` — SendGrid helper (from `tech_stack.md §7`)
- [ ] `lib/storage.ts` — S3 upload helper (from `tech_stack.md §9`)
- [ ] `lib/validations/` — Zod schemas for all forms (from `admin_panel_spec.md §6.2`)
- [ ] `types/datalayer.d.ts` — `window.dataLayer`, `window.fbq` type declarations (from `tracking_events.md §3.2`)
- [ ] `types/index.ts` — Global TypeScript types

---

### Step 4.2 — API Auth Routes

- [ ] `app/api/auth/[...nextauth]/route.ts` — NextAuth handler

---

### Step 4.3 — Storefront Layout Shell

**Reference: `component_architecture.md §3.1`, `prd_new.md §5`**

- [ ] `app/(store)/layout.tsx` — StorefrontLayout: AnnouncementBar + Navbar + children + Footer + popup mount point
- [ ] `components/store/layout/Navbar.tsx` — Logo, NavLinks, SearchBar, WishlistIcon, CartIcon, UserMenu
- [ ] `components/store/layout/Footer.tsx` — Links, socials, NewsletterForm
- [ ] `components/store/layout/AnnouncementBar.tsx` — Fetches active bar from `/api/storefront/announcements/active`

---

### Step 4.4 — Shared UI Primitives

**Reference: `component_architecture.md §6.1`**

Build these first — everything else depends on them:

- [ ] `components/ui/Button.tsx`
- [ ] `components/ui/Input.tsx`
- [ ] `components/ui/Select.tsx`
- [ ] `components/ui/Badge.tsx`
- [ ] `components/ui/Spinner.tsx`
- [ ] `components/ui/Dialog.tsx` (Radix)
- [ ] `components/ui/Switch.tsx` (Radix)
- [ ] `components/ui/Tabs.tsx` (Radix)
- [ ] `components/ui/Tooltip.tsx` (Radix)

---

### Step 4.5 — Home Page

**Reference: `prd_new.md §4.6`, `component_architecture.md §4.1`**

- [ ] `app/(store)/page.tsx` — Home page (ISR, revalidate: 3600)
- [ ] `components/store/home/SolarSystemBanner.tsx` — Pure CSS `@keyframes` orbit animation for 9 Navagraha planets. Tailwind animation tokens used (`orbit-slow`, `orbit-med`, `orbit-fast` from `tech_stack.md §3`). `prefers-reduced-motion` static fallback.
- [ ] `components/store/home/FeaturedCollections.tsx` — Grid of active featured collections
- [ ] `components/store/home/FeaturedProducts.tsx` — Products where `featured = true`
- [ ] `components/store/home/BrandStorySection.tsx` — Static brand copy from `Brand_values_and_vision.md §3`

---

### Step 4.6 — Product Catalogue (Storefront)

**Reference: `prd_new.md §6.1`, `component_architecture.md §4.2–4.3`, `seo_blog_strategy.md §2, §3`**

- [ ] `app/(store)/shop/page.tsx` — All products listing (ISR, revalidate: 300)
- [ ] `app/(store)/shop/[slug]/page.tsx` — PDP with `generateStaticParams` (ISR, revalidate: 60)
- [ ] `app/(store)/category/[slug]/page.tsx` — Category listing
- [ ] `app/(store)/collection/[slug]/page.tsx` — Collection listing with Navagraha hero
- [ ] `components/store/product/ProductGrid.tsx`
- [ ] `components/store/product/ProductCard.tsx` — with all `data-gtm-*` + `data-product-*` attributes (from `tracking_events.md §6.1`)
- [ ] `components/store/product/FilterSidebar.tsx` — Category, size, colour, price range filters
- [ ] `components/store/product/SortDropdown.tsx`
- [ ] `components/store/product/ProductGallery.tsx` — Image + thumbnail + zoom
- [ ] `components/store/product/ProductInfo.tsx` — Title, price, stock, size selector
- [ ] `components/store/product/CosmicMetadata.tsx` — Planet/zodiac/life path badges
- [ ] `components/store/product/VariantSelector.tsx`
- [ ] `components/store/product/AddToCartButton.tsx` — fires `add_to_cart` DataLayer event
- [ ] `components/store/product/RelatedProducts.tsx`
- [ ] `components/store/product/CollectionHero.tsx` — Planet-specific accent colour from `Brand_values_and_vision.md §9`

**SEO (for each page type):**
- [ ] `generateMetadata()` in each page — `meta_title`, `meta_description`, OG tags, canonical
- [ ] `Product` JSON-LD on PDP (from `seo_blog_strategy.md §3.2`)
- [ ] `BreadcrumbList` JSON-LD on PDP + category + collection (from `seo_blog_strategy.md §3.4`)
- [ ] `ItemList` JSON-LD on listing pages (from `seo_blog_strategy.md §3.5`)

---

### Step 4.7 — Public API Routes (Storefront)

**Reference: `component_architecture.md §7.4`**

- [ ] `GET /api/storefront/products` — list with filters
- [ ] `GET /api/storefront/products/[slug]` — single product
- [ ] `GET /api/storefront/categories` — category + sub-category tree
- [ ] `GET /api/storefront/collections` — active collections list
- [ ] `GET /api/storefront/collections/[slug]` — collection + products
- [ ] `GET /api/storefront/search` — full-text search (Prisma `@@fulltext` on `title, tags, emotional_intention`)
- [ ] `GET /api/storefront/announcements/active` — active announcement bar
- [ ] `POST /api/storefront/newsletter` — subscribe → `NewsletterSubscriber` create

---

### Step 4.8 — Cart

**Reference: `prd_new.md §6.2`, `component_architecture.md §4.4`**

- [ ] `store/cartStore.ts` — Zustand cart state (guest: localStorage; logged-in: DB sync)
- [ ] `app/(store)/cart/page.tsx` — Cart page (CSR). Fires `view_cart` on mount.
- [ ] `components/store/cart/MiniCart.tsx` — Slide-out drawer from navbar
- [ ] `components/store/cart/CartItem.tsx` — Fires `remove_from_cart`
- [ ] `components/store/cart/CouponInput.tsx` — Real-time validation
- [ ] `components/store/cart/OrderSummary.tsx`

**Cart API routes:**
- [ ] `GET /api/storefront/cart` — fetch cart by session/user
- [ ] `POST /api/storefront/cart` — add item
- [ ] `PATCH /api/storefront/cart` — update quantity
- [ ] `DELETE /api/storefront/cart/[itemId]` — remove item

---

### Step 4.9 — Checkout & Payment

**Reference: `prd_new.md §6.3–6.4`, `component_architecture.md §4.5`, `tech_stack.md §6`**

- [ ] `app/(store)/checkout/page.tsx` — Multi-step checkout (SSR, auth-optional)
- [ ] `components/store/checkout/CheckoutProgress.tsx` — Step indicator
- [ ] `components/store/checkout/AddressForm.tsx` — react-hook-form + zod validation
- [ ] `components/store/checkout/ShippingMethodSelector.tsx` — from `Settings.shipping_config`
- [ ] `components/store/checkout/RazorpayButton.tsx` — Razorpay Checkout JS widget (config from `tech_stack.md §6`)
- [ ] `components/store/checkout/OrderReviewStep.tsx`
- [ ] `app/(store)/order-confirmation/[orderId]/page.tsx` — fires `purchase` DataLayer + Meta `Purchase`

**Checkout API routes:**
- [ ] `POST /api/storefront/checkout/create-order` — create Razorpay order
- [ ] `POST /api/storefront/checkout/verify-payment` — verify signature → create `Order` in DB → clear cart → send confirmation email
- [ ] `POST /api/webhooks/razorpay` — Razorpay webhook handler with signature verification (from `tech_stack.md §6`)

---

### Step 4.10 — User Auth (Storefront)

**Reference: `prd_new.md §6.6`, `tech_stack.md §5`**

- [ ] `app/(store)/(auth)/login/page.tsx` — login form
- [ ] `app/(store)/(auth)/register/page.tsx` — registration (always assigns `role = CUSTOMER`)
- [ ] `app/(store)/(auth)/forgot-password/page.tsx`
- [ ] `app/(store)/(auth)/reset-password/page.tsx`
- [ ] `app/(store)/account/layout.tsx` — account sidebar
- [ ] `app/(store)/account/page.tsx` — profile + password change
- [ ] `app/(store)/account/orders/page.tsx` — order history
- [ ] `app/(store)/account/addresses/page.tsx`

**Account API routes:**
- [ ] `GET /api/storefront/orders/[id]/track` — order tracking for logged-in user
- [ ] `POST /api/storefront/auth/register`
- [ ] `PATCH /api/storefront/auth/change-password`

---

### Step 4.11 — Admin Panel Foundation

**Reference: `admin_panel_spec.md §1–3, §19–20`, `component_architecture.md §5.1`**

- [ ] `app/(admin)/admin/layout.tsx` — Auth gate + AdminLayout (sidebar + topbar)
- [ ] `components/admin/layout/AdminLayout.tsx`
- [ ] `components/admin/layout/AdminSidebar.tsx` — Role-filtered nav links (RBAC from `admin_panel_spec.md §3`)
- [ ] `components/admin/layout/AdminTopbar.tsx` — User menu + default password banner
- [ ] `components/admin/layout/DefaultPasswordBanner.tsx` — Persistent warning until password changed
- [ ] `components/admin/layout/AdminBreadcrumb.tsx`

**Admin shared components (from `admin_panel_spec.md §19.2`):**
- [ ] `components/admin/shared/DataTable.tsx` — sortable, filterable, paginated, bulk select
- [ ] `components/admin/shared/FormField.tsx`
- [ ] `components/admin/shared/ImageUploader.tsx` — react-dropzone + preview
- [ ] `components/admin/shared/RichTextEditor.tsx` — Tiptap wrapper
- [ ] `components/admin/shared/SlugField.tsx` — auto-generate + manual override
- [ ] `components/admin/shared/StatusBadge.tsx`
- [ ] `components/admin/shared/ConfirmDialog.tsx`
- [ ] `components/admin/shared/MetricCard.tsx`
- [ ] `components/admin/shared/EmptyState.tsx`
- [ ] `components/admin/shared/PageHeader.tsx`
- [ ] `components/admin/shared/MultiSelect.tsx`

---

### Step 4.12 — Admin: Dashboard

**Reference: `admin_panel_spec.md §5`**

- [ ] `app/(admin)/admin/dashboard/page.tsx`
- [ ] `components/admin/dashboard/MetricsRow.tsx` — Orders, Revenue, Active Users, Pending, Low Stock cards
- [ ] `components/admin/dashboard/RecentOrdersTable.tsx` — last 10 orders
- [ ] `components/admin/dashboard/LowStockAlerts.tsx`
- [ ] `components/admin/dashboard/QuickActions.tsx`
- [ ] `GET /api/admin/dashboard/stats` handler

---

### Step 4.13 — Admin: Product Management

**Reference: `admin_panel_spec.md §6`, `component_architecture.md §5.3`**

- [ ] `app/(admin)/admin/products/page.tsx` — product list
- [ ] `app/(admin)/admin/products/new/page.tsx`
- [ ] `app/(admin)/admin/products/[id]/page.tsx`
- [ ] `ProductForm` with all 7 sections (Basic Info, Pricing, Images, Variants, Categorisation, Cosmic Metadata, SEO)
- [ ] `POST /api/admin/upload` — image upload to Hostinger S3

**Admin product API routes (from `admin_panel_spec.md §18`):**
- [ ] `GET/POST /api/admin/products`
- [ ] `GET/PUT/DELETE /api/admin/products/[id]`
- [ ] `POST /api/admin/products/bulk`

---

### Step 4.14 — Admin: Category & Collection Management

**Reference: `admin_panel_spec.md §7–8`**

- [ ] `app/(admin)/admin/categories/page.tsx` — two-panel layout (category left, sub-category right)
- [ ] `app/(admin)/admin/collections/page.tsx`
- [ ] `app/(admin)/admin/collections/[id]/page.tsx` — with conditional fields per `CollectionType`
- [ ] Category/Sub-Category API routes
- [ ] Collection API routes

---

### Step 4.15 — Admin: Order Management

**Reference: `admin_panel_spec.md §9`**

- [ ] `app/(admin)/admin/orders/page.tsx` — list with quick-filter tabs
- [ ] `app/(admin)/admin/orders/[id]/page.tsx` — two-column detail view
- [ ] `components/admin/orders/StatusTimeline.tsx` — from `OrderStatusHistory`
- [ ] `components/admin/orders/StatusUpdateForm.tsx` — controlled state machine transitions
- [ ] `components/admin/orders/ShippingInfoEditor.tsx`
- [ ] Order API routes (list, detail, status update, tracking, exchange)

**On status update → trigger:**
1. `Order.status` update
2. `OrderStatusHistory` insert
3. SendGrid email for SHIPPED / OUT_FOR_DELIVERY / DELIVERED
4. `AdminActivityLog` insert

---

### Step 4.16 — Admin: User Management

**Reference: `admin_panel_spec.md §10`**

- [ ] `app/(admin)/admin/users/page.tsx`
- [ ] `app/(admin)/admin/users/[id]/page.tsx` — profile + role promotion (SUPER_ADMIN only) + order history tab
- [ ] `app/(admin)/admin/profile/page.tsx` — own profile + password change for all admin roles
- [ ] User API routes (list, detail, status toggle, role update)

---

### Step 4.17 — Admin: Settings

**Reference: `admin_panel_spec.md §16`**

- [ ] `app/(admin)/admin/settings/page.tsx` — tabbed: Store Info, Shipping, Tax, Payment, Email, Analytics
- [ ] `GET/PUT /api/admin/settings` handler

---

### Step 4.18 — SEO Infrastructure

**Reference: `seo_blog_strategy.md §2, §3, §8`**

- [ ] `app/sitemap.ts` — auto-generated sitemap (products + collections + categories)
- [ ] `app/robots.ts` — Next.js robots config
- [ ] `components/shared/JsonLd.tsx` — server component to inject JSON-LD
- [ ] `Organization` JSON-LD in root `app/layout.tsx`
- [ ] `Product` JSON-LD in `app/(store)/shop/[slug]/page.tsx`
- [ ] `BreadcrumbList` on product, category, collection pages
- [ ] `ItemList` on listing pages

---

### Step 4.19 — Phase 1 QA & Launch Prep

- [ ] Run `npx prisma migrate deploy` on Hostinger production DB
- [ ] Run `npx prisma db seed` for super admin + categories + collections + settings
- [ ] Change default admin password immediately on first login
- [ ] Set `RAZORPAY_KEY_ID` to live keys (not test)
- [ ] Verify Razorpay webhook signature is working
- [ ] Verify SendGrid sender domain is authenticated (SPF + DKIM)
- [ ] Set Meta Pixel ID (replace `PLACEHOLDER_META_PIXEL_ID`)
- [ ] Verify GTM container `GTM-TWDX4B9R` is firing on all pages
- [ ] Lighthouse audit — Performance > 90 on mobile
- [ ] Solar system banner 60fps check on mid-range Android device
- [ ] Test full purchase flow end-to-end (Razorpay test mode → live mode)

---

## 5. Phase 2 — Content & Engagement

**Priority: High** | Start immediately after Phase 1 goes live.

**Reference documents:**
- `prd_new.md §7, §8.6–8.9`
- `admin_panel_spec.md §11–15, §20`
- `seo_blog_strategy.md §5, §6, §9, §10`
- `phases.md §Phase 2`

**Feature flag to flip at Phase 2 launch:** `NEXT_PUBLIC_BLOG_ENABLED=true`

### Step 5.1 — Blog Engine (Frontend)

- [ ] `app/(store)/blog/page.tsx` — Blog listing (ISR, revalidate: 3600) with category/tag filters
- [ ] `app/(store)/blog/[slug]/page.tsx` — Blog post page (`generateStaticParams`, ISR, revalidate: 3600)
- [ ] `app/(store)/blog/category/[slug]/page.tsx` — Blog category archive page
- [ ] `components/store/blog/BlogListingPage.tsx`
- [ ] `components/store/blog/BlogPostCard.tsx`
- [ ] `components/store/blog/BlogPostPage.tsx` — Rich text render + Author + Tags + Social Share
- [ ] `components/store/blog/SocialShare.tsx` — WhatsApp, X, Facebook, Pinterest, copy link
- [ ] `components/store/blog/RelatedPosts.tsx`
- [ ] `components/store/blog/BlogCTA.tsx` — in-post collection CTA component
- [ ] `Article` JSON-LD in blog post page (`seo_blog_strategy.md §3.3`)
- [ ] `ItemList` JSON-LD on blog listing page (`seo_blog_strategy.md §3.5`)
- [ ] Blog sitemap added to `app/sitemap.ts`

**Public blog API routes:**
- [ ] `GET /api/storefront/blog/posts` — paginated, filtered by category/tag
- [ ] `GET /api/storefront/blog/posts/[slug]`

### Step 5.2 — Blog Engine (Admin)

**Reference: `admin_panel_spec.md §11`**

- [ ] `app/(admin)/admin/blog/page.tsx` — post list
- [ ] `app/(admin)/admin/blog/new/page.tsx`
- [ ] `app/(admin)/admin/blog/[id]/page.tsx` — full Tiptap editor + SEO fields
- [ ] `app/(admin)/admin/blog/categories/page.tsx` — inline CRUD
- [ ] `app/(admin)/admin/blog/tags/page.tsx` — inline CRUD
- [ ] Blog admin API routes (posts CRUD, categories CRUD, tags CRUD)

**Initial content to publish at Phase 2 launch (from `seo_blog_strategy.md §6`):**
- 4 Navagraha planet deep dives (Sun, Moon, Saturn, Jupiter — matching Phase 1 collections)
- 2 Vibe collection stories (The Sovereign, The Reborn)
- 1 brand story post ("The Story Behind Vastrayug")

### Step 5.3 — Newsletter Integration

- [ ] `components/store/layout/NewsletterForm.tsx` — email input → `POST /api/storefront/newsletter`
- [ ] API handler: create `NewsletterSubscriber` record → `pushPixelEvent('Lead')`
- [ ] SendGrid list add on subscribe

### Step 5.4 — Popup System

**Reference: `prd_new.md §6.7`, `component_architecture.md §4.8`, `admin_panel_spec.md §14`**

- [ ] `hooks/usePopup.ts` — fetch active popups + client-side trigger evaluation (delay / scroll / exit-intent)
- [ ] `components/store/popups/PopupManager.tsx`
- [ ] `components/store/popups/PopupModal.tsx` — Radix Dialog rendering `content_json`
- [ ] `GET /api/storefront/popups` — active, non-expired popups

**Admin popup management:**
- [ ] `app/(admin)/admin/popups/` pages + API routes

### Step 5.5 — Coupon & Promotion Management

**Reference: `admin_panel_spec.md §12–13`**

- [ ] `app/(admin)/admin/coupons/` pages + API routes — includes usage report
- [ ] `app/(admin)/admin/promotions/` pages + API routes
- [ ] Update cart/checkout API to apply coupon validation rules

### Step 5.6 — Announcement Bar Management

**Reference: `admin_panel_spec.md §15`**

- [ ] `app/(admin)/admin/announcements/page.tsx` — form with live preview
- [ ] Announcement bar API routes (create, toggle active — enforce one-active constraint at API level)

---

## 6. Phase 3 — Analytics & Tracking

**Priority: Medium** | Complete after Phase 2 blog SEO baseline is established.

**Reference documents:**
- `tracking_events.md` — entire document
- `seo_blog_strategy.md §8 (Phase 3 checklist)`
- `phases.md §Phase 3`

### Step 6.1 — Full GA4 DataLayer Events

Implement all 11 e-commerce events from `tracking_events.md §4`:

- [ ] `page_view` — route change listener in `app/(store)/layout.tsx`
- [ ] `view_item` — PDP on mount
- [ ] `view_item_list` — all listing pages on mount
- [ ] `select_item` — ProductCard onClick
- [ ] `add_to_cart` — AddToCartButton on success
- [ ] `remove_from_cart` — CartItem remove
- [ ] `view_cart` — CartPage on mount
- [ ] `begin_checkout` — Checkout Step 1
- [ ] `add_shipping_info` — Checkout Step 2 complete
- [ ] `add_payment_info` — Checkout Step 3
- [ ] `purchase` — OrderConfirmationPage on mount (includes `transactionId`, `value`, `tax`, `shipping`, `items[]`)

### Step 6.2 — Meta Pixel Standard Events

Implement all 8 pixel events from `tracking_events.md §5`:

- [ ] Replace `PLACEHOLDER_META_PIXEL_ID` with live Pixel ID
- [ ] `ViewContent` — PDP
- [ ] `AddToCart`
- [ ] `InitiateCheckout`
- [ ] `AddPaymentInfo`
- [ ] `Purchase` — with `content_ids[]`, `value`, `currency`
- [ ] `Lead` — newsletter subscribe
- [ ] `Search`

### Step 6.3 — Tag-Friendly Markup Audit

**Reference: `tracking_events.md §6`**

- [ ] All product cards: `data-product-id`, `data-product-name`, `data-product-category`, `data-product-price`, `data-product-planet`, `data-gtm-action`
- [ ] All CTA buttons: `id`, `data-gtm-action`, `data-gtm-category`, `data-gtm-label`
- [ ] Search form: `id="form-site-search"`
- [ ] Newsletter form: `id="form-newsletter"`

### Step 6.4 — Performance Optimisation Pass

- [ ] Lighthouse mobile performance ≥ 90
- [ ] LCP < 1.2s — verify largest element is not render-blocking
- [ ] All images served as WebP/AVIF via `next/image` + Cloudflare CDN
- [ ] Lazy load all below-fold images
- [ ] Solar system banner — audit CSS animation GPU compositing (use `transform` + `will-change: transform`)

---

## 7. Phase 4 — Enhancements

**Priority: Medium** | After product-market fit is confirmed by Phase 3 data.

**Reference documents:**
- `prd_new.md §14 Phase 4`
- `admin_panel_spec.md §17, §3 (full RBAC)`
- `phases.md §Phase 4`
- `tech_stack.md §5 (Google OAuth), §8 (Twilio)`

### Step 7.1 — Google Social Login

- [ ] Create Google Cloud OAuth 2.0 Client ID
- [ ] Uncomment `GoogleProvider` in `lib/auth.ts`
- [ ] Set `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=true`
- [ ] Add Google login button to `/login` page
- [ ] Update `sign_up` / `login` DataLayer events with `method: 'google'`

### Step 7.2 — SMS Notifications (Twilio)

- [ ] Add Twilio credentials to `.env`
- [ ] Set `NEXT_PUBLIC_SMS_ENABLED=true`
- [ ] Wire `lib/twilio.ts` `sendSMS()` into order status update API for PLACED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED (messages from `phases.md §Phase 4`)

### Step 7.3 — Product Reviews

- [ ] `components/store/product/ReviewsSection.tsx` — approved reviews + star rating
- [ ] Review submission form (logged-in users only)
- [ ] `POST /api/storefront/reviews` — create `Review` with `status = PENDING`
- [ ] Admin review moderation panel
- [ ] `aggregateRating` JSON-LD added to PDP (from `seo_blog_strategy.md §3.2`)

### Step 7.4 — Wishlist

- [ ] Set `NEXT_PUBLIC_WISHLIST_ENABLED=true`
- [ ] `WishlistButton` on ProductCard + PDP
- [ ] `app/(store)/account/wishlist/page.tsx`
- [ ] Wishlist API routes

### Step 7.5 — Advanced Filters

- [ ] Filter by `NavagrahaPlanet`, `ZodiacSign`, `life_path_number` on all listing pages
- [ ] Filter URL parameters with canonical tags

### Step 7.6 — Search Autocomplete

- [ ] Real-time suggestions on `SearchBar` as user types
- [ ] Searches across product title, planet, zodiac, collection name (Prisma `@@fulltext`)

### Step 7.7 — Admin Dashboard Charts

- [ ] Revenue line chart (recharts `LineChart`) — daily/weekly/monthly
- [ ] Top 10 products bar chart (recharts `BarChart`)
- [ ] Connect to new `/api/admin/dashboard/charts` endpoint

### Step 7.8 — Full Admin RBAC

- [ ] Enforce all role-based restrictions from `admin_panel_spec.md §3` permissions matrix
- [ ] Role-filtered sidebar (show/hide nav items by role)
- [ ] API-level `requireRole()` on every admin route
- [ ] Admin Activity Log page at `/admin/activity-log` (SUPER_ADMIN only)

---

## 8. Phase 5 — Scale & Iterate

**Priority: Low** | Post product-market fit.

**Reference: `phases.md §Phase 5`**

- [ ] **Shipping Provider API** — Delhivery / DTDC integration to replace manual tracking updates
- [ ] **Meta Conversions API** — Server-side event with hashed email + phone. Add `eventID` to all client-side Pixel calls for deduplication (from `tracking_events.md §5.4`)
- [ ] **Multi-currency** — Beyond INR; use Razorpay multi-currency
- [ ] **i18n** — Multi-language with `next-intl`
- [ ] **A/B Testing** — Infrastructure for testing CTA copy, layout variants
- [ ] **Personalisation** — Product recommendations by zodiac/planet/life path using order history

---

## 9. Deployment Checklist

**Complete before any phase goes to production:**

### Environment

- [ ] All env vars in Hostinger hPanel → Node.js → Environment Variables
- [ ] Never commit `.env.local` to git — `.env.example` committed with placeholders only
- [ ] Verify `NEXTAUTH_URL=https://vastrayug.in`

### Database

- [ ] `npx prisma migrate deploy` (not `migrate dev`) on production
- [ ] `npx prisma db seed` — run once on fresh production DB
- [ ] Verify connection pool (`DATABASE_CONNECTION_LIMIT` env var)

### Build & Start

```bash
npm run build      # Build Next.js production bundle
npm run start      # Start on port 3000 (Hostinger proxies to 443)
```

### DNS & SSL

- [ ] `vastrayug.in` → Cloudflare nameservers
- [ ] Cloudflare SSL: Full (strict) mode
- [ ] `www.vastrayug.in` → 301 redirect to `vastrayug.in`
- [ ] Hostinger SSL certificate installed and valid

### Security

- [ ] Change default admin password on first login (`vastrayug.in@gmail.com` / `admin`)
- [ ] Verify rate limiting on `POST /api/auth/signin`
- [ ] Verify CSRF protection active (NextAuth handles this)
- [ ] Verify Razorpay webhook signature check is not bypassed

### Pre-Launch Verification

- [ ] End-to-end purchase flow (add to cart → checkout → Razorpay → confirmation email)
- [ ] Order confirmation email received
- [ ] Admin order management: status update → shipping email triggered
- [ ] Admin can upload product image → appears in storefront
- [ ] GTM + GA4 firing (verify in GA4 DebugView)
- [ ] Sitemap accessible at `https://vastrayug.in/sitemap.xml`
- [ ] Robots.txt correct at `https://vastrayug.in/robots.txt`
- [ ] Lighthouse Performance ≥ 90 on mobile
- [ ] Solar system banner renders at 60fps on a mid-range Android device

---

## Summary: Files Still Needed

| File | Priority | Notes |
|------|:--------:|-------|
| `.env.example` | 🔴 **Before first commit** | Template with all vars from `tech_stack.md §15` |
| `.env.local` | 🔴 **Before first run** | Real secrets — never committed |
| `prisma/seed.ts` | 🔴 **Before Phase 1 launch** | Admin, categories, collections, settings |
| `public/brand/logo.png` | 🔴 **Before Phase 1 launch** | Brand logo, transparent PNG |
| `public/brand/favicon.ico` | 🔴 **Before Phase 1 launch** | Favicon |
| `public/brand/og-default.jpg` | 🟡 **Before Phase 1 launch** | 1200×630px default OG image |
| `email_templates/` | 🟡 **Before Phase 1 launch** | 7 SendGrid dynamic HTML templates |
| `types/datalayer.d.ts` | 🟡 **Phase 1 build** | Auto-created when you write `lib/datalayer.ts` |

---

*This roadmap is executable as-is. Every step references a specific section of a planning document. Build in the order listed — each step's dependencies are upstream of it.*
