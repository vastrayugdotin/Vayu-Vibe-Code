# Component Architecture — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final Pre-Development  
> Cross-referenced from `prd_new.md`, `prisma/schema.prisma`, and `docs/admin_panel_spec.md`.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Directory Structure](#2-directory-structure)
3. [Route Groups & Layouts](#3-route-groups--layouts)
4. [Storefront Components](#4-storefront-components)
5. [Admin Panel Components](#5-admin-panel-components)
6. [Shared / Common Components](#6-shared--common-components)
7. [API Route Architecture](#7-api-route-architecture)
8. [Data Layer & State Management](#8-data-layer--state-management)
9. [Database Model Map](#9-database-model-map)
10. [Auth Architecture](#10-auth-architecture)
11. [Third-Party Integrations](#11-third-party-integrations)
12. [Analytics & Tracking Layer](#12-analytics--tracking-layer)
13. [Phase Mapping](#13-phase-mapping)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App                              │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐ │
│  │  Storefront  │   │ Admin Panel  │   │     API Routes      │ │
│  │  (SSR/SSG)   │   │   (CSR)      │   │ app/api/            │ │
│  │  app/(store) │   │ app/(admin)  │   │  ├── /auth          │ │
│  └──────────────┘   └──────────────┘   │  ├── /admin/*       │ │
│                                        │  └── /storefront/*  │ │
│                                        └─────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Shared Layer                          │  │
│  │  lib/ · hooks/ · components/ui/ · types/ · utils/       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Prisma ORM → MySQL                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Rendering Strategy:**
| Zone | Strategy | Rationale |
|------|----------|-----------|
| Storefront pages | SSR / SSG (Next.js) | SEO, fast FCP, product/blog indexing |
| Admin panel | CSR (Client-Side Rendering) | Auth-gated, no public indexing needed |
| API routes | Server-side handlers | Secure, behind auth middleware |
| Solar system banner | Pure CSS animation | 60fps, zero JS overhead |

---

## 2. Directory Structure

```
app/
├── (store)/                        ← Storefront route group (SSR/SSG)
│   ├── layout.tsx                  ← Store layout: navbar, announcement bar, footer
│   ├── page.tsx                    ← Home — solar system banner + featured collections
│   ├── shop/
│   │   ├── page.tsx                ← All products listing
│   │   └── [slug]/
│   │       └── page.tsx            ← Product Detail Page (PDP)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx            ← Category listing page
│   ├── collection/
│   │   └── [slug]/
│   │       └── page.tsx            ← Collection listing page (Planetary, Zodiac, etc.)
│   ├── blog/
│   │   ├── page.tsx                ← Blog listing (paginated)
│   │   └── [slug]/
│   │       └── page.tsx            ← Blog post detail
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── order-confirmation/
│   │   └── [orderId]/
│   │       └── page.tsx
│   ├── track/
│   │   └── [orderId]/
│   │       └── page.tsx
│   ├── account/
│   │   ├── layout.tsx              ← Account sidebar wrapper
│   │   ├── page.tsx                ← Profile
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   └── addresses/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── faq/
│       └── page.tsx
│
├── (admin)/                        ← Admin route group (CSR, auth-gated)
│   └── admin/
│       ├── layout.tsx              ← Auth gate + sidebar + topbar
│       ├── dashboard/
│       │   └── page.tsx
│       ├── products/
│       │   ├── page.tsx            ← Product list + bulk actions
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── categories/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── collections/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── users/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── blog/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   ├── [id]/page.tsx
│       │   ├── categories/page.tsx
│       │   └── tags/page.tsx
│       ├── coupons/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── promotions/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── popups/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── announcements/
│       │   └── page.tsx
│       ├── profile/
│       │   └── page.tsx
│       ├── settings/
│       │   └── page.tsx
│       └── activity-log/
│           └── page.tsx
│
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── admin/                      ← All admin API routes (role-gated)
│   │   ├── dashboard/stats/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── collections/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── blog/
│   │   ├── coupons/
│   │   ├── promotions/
│   │   ├── popups/
│   │   ├── announcements/
│   │   ├── settings/
│   │   ├── upload/
│   │   ├── profile/
│   │   └── activity-log/
│   └── storefront/                 ← Public-facing API routes
│       ├── products/
│       ├── cart/
│       ├── checkout/
│       ├── orders/
│       ├── reviews/
│       ├── newsletter/
│       └── search/
│
components/
├── store/                          ← Storefront-specific components
│   ├── layout/
│   ├── home/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── blog/
│   └── account/
├── admin/                          ← Admin-specific components
│   ├── layout/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── blog/
│   └── shared/
└── ui/                             ← Shared primitives (Radix + custom)

lib/
├── prisma.ts                       ← Prisma client singleton
├── auth.ts                         ← NextAuth config + RBAC helpers
├── razorpay.ts                     ← Razorpay client wrapper
├── sendgrid.ts                     ← SendGrid mailer
├── twilio.ts                       ← Twilio SMS sender
├── s3.ts                           ← Hostinger S3 upload helper
├── datalayer.ts                    ← GTM DataLayer push helpers
└── validations/                    ← Zod schemas (shared)

hooks/
├── useCart.ts
├── useWishlist.ts
├── useAuth.ts
└── useSearch.ts

types/
└── index.ts                        ← Global TypeScript types / enums

prisma/
└── schema.prisma                   ← Single source of truth for DB

middleware.ts                       ← NextAuth withAuth — protects /admin/*
```

---

## 3. Route Groups & Layouts

### 3.1 Storefront Layout (`app/(store)/layout.tsx`)

```
StorefrontLayout
├── AnnouncementBar           ← Active AnnouncementBar from DB (if any)
├── Navbar
│   ├── Logo
│   ├── NavLinks              ← Shop, Blog, About, Contact
│   ├── SearchBar             ← Full-text search input
│   ├── WishlistIcon          ← Count badge (logged-in users)
│   ├── CartIcon              ← Item count badge
│   └── UserMenu              ← Login / Account dropdown
├── {children}                ← Page content
└── Footer
    ├── FooterLinks
    ├── SocialLinks
    └── NewsletterForm
```

**Popups** are rendered in this layout conditionally — fetched client-side based on trigger rules and session state.

### 3.2 Admin Layout (`app/(admin)/admin/layout.tsx`)

```
AdminLayout (CSR — no SSR)
├── Auth Gate (middleware.ts + client-side role check)
├── DefaultPasswordWarningBanner  ← Persistent until password changed
├── AdminSidebar
│   ├── BrandLogo
│   ├── NavSection: Catalogue     ← Products, Categories, Collections
│   ├── NavSection: Commerce      ← Orders, Coupons, Promotions
│   ├── NavSection: Content       ← Blog, Pop-ups, Announcements
│   ├── NavSection: Users
│   ├── NavSection: Settings
│   └── NavSection: System        ← Activity Log (SUPER_ADMIN only)
├── AdminTopbar
│   ├── Breadcrumb
│   └── UserMenu                  ← Profile, Change Password, Logout
└── {children}
```

---

## 4. Storefront Components

### 4.1 Home Page (`app/(store)/page.tsx`)

| Component | Description | Data Source |
|-----------|-------------|-------------|
| `SolarSystemBanner` | CSS-animated revolving Navagraha solar system hero — pure CSS, 60fps, static fallback | Static (no DB) |
| `FeaturedCollections` | Grid of active featured collections | `Collection` (is_active = true, sorted) |
| `AnnouncementBar` | Top-of-site promotional strip | `AnnouncementBar` (is_active = true) |
| `BrandStorySection` | Static brand philosophy copy | Static |
| `FeaturedProducts` | Highlighted `featured = true` products | `Product` (featured = true, status = PUBLISHED) |

#### `SolarSystemBanner` — Implementation Detail
- Pure CSS `@keyframes` orbit animations for 9 Navagraha planets
- Concentric orbital rings with animated planet dots
- Overlay: brand tagline + CTA button to `/shop`
- `prefers-reduced-motion` media query for static fallback
- No WebGL or Three.js dependency

---

### 4.2 Product Listing Page (`shop/`, `category/[slug]/`, `collection/[slug]/`)

| Component | Description |
|-----------|-------------|
| `ProductGrid` | Responsive CSS Grid of `ProductCard` components |
| `ProductCard` | Image, title, price, compare-at price, wishlist toggle — with GTM `data-*` attributes |
| `FilterSidebar` | Category, sub-category, collection, size, colour, price range, planet, zodiac, life path filters |
| `SortDropdown` | Price asc/desc, newest, popularity |
| `Pagination` | Page controls / load-more |
| `ActiveFilters` | Pill list of applied filters with remove buttons |
| `CollectionHero` | Planet-specific hero with Navagraha colour accent — rendered on collection pages |

**`ProductCard` GTM Attributes:**
```html
<div
  data-product-id="{id}"
  data-product-name="{title}"
  data-product-category="{category.name}"
  data-product-price="{price}"
  data-gtm-action="select_item"
>
```

---

### 4.3 Product Detail Page (PDP) — `shop/[slug]/`

| Component | Description | DB Model |
|-----------|-------------|----------|
| `ProductGallery` | Primary image + thumbnail strip, zoom on hover | `ProductImage` |
| `ProductInfo` | Title, price, compare-at price, stock status, size selector | `Product`, `ProductVariant` |
| `CosmicMetadata` | Planet badge, zodiac sign, life path number, emotional intention | `Product` fields |
| `VariantSelector` | Size + colour dropdowns / button grid → `ProductVariant` | `ProductVariant` |
| `AddToCartButton` | Adds selected variant to cart, fires GTM `add_to_cart` | `Cart`, `CartItem` |
| `WishlistButton` | Toggle save (logged-in only) | `Wishlist` |
| `SizeChart` | Modal/drawer with brand size guide | Static |
| `ProductDescription` | Rich-text body parsed from `Product.description` | `Product` |
| `RelatedProducts` | Products in same collection/category | `Product` |
| `ReviewsSection` | Average rating + approved reviews list | `Review` (status = APPROVED) |

---

### 4.4 Cart

| Component | Description |
|-----------|-------------|
| `MiniCart` | Slide-out drawer triggered from navbar icon — line items, total, checkout CTA |
| `CartPage` | Full cart page: items table, coupon input, order summary, proceed to checkout |
| `CartItem` | Product image, title, variant, quantity stepper, remove button |
| `CouponInput` | Code input + Apply button — real-time validation against `Coupon` rules |
| `OrderSummary` | Subtotal, discount, shipping estimate, grand total |

**Cart state** — Zustand store: `useCartStore`
- Logged-in users: cart persisted to `Cart` table via API
- Guests: cart persisted to `localStorage` + synced on login

---

### 4.5 Checkout (`checkout/`)

Multi-step flow managed by local state:

```
Step 1: Address
  └── ShippingAddressForm (select saved address or new entry)
Step 2: Shipping
  └── ShippingMethodSelector (Standard / Express options from Settings)
Step 3: Payment
  └── RazorpayButton → opens Razorpay hosted checkout
Step 4: Confirmation → redirects to /order-confirmation/[orderId]
```

| Component | Description |
|-----------|-------------|
| `CheckoutProgress` | Step indicator bar |
| `AddressForm` | Full address form with validation (react-hook-form + zod) |
| `ShippingMethodSelector` | Rate options from `Settings.shipping_config` |
| `RazorpayButton` | Calls `POST /api/storefront/checkout/create-order` → opens Razorpay modal |
| `OrderReviewStep` | Cart items + shipping address + total before payment |
| `OrderConfirmationPage` | Order number, summary, expected delivery, track link |

---

### 4.6 Blog

| Component | Description | DB Model |
|-----------|-------------|----------|
| `BlogListingPage` | Paginated post grid with category/tag filters | `BlogPost` (status = PUBLISHED) |
| `BlogPostCard` | Thumbnail, title, excerpt, author, date | `BlogPost` |
| `BlogPostPage` | Full rich-text content render | `BlogPost` |
| `BlogHero` | Featured image / banner | `BlogPost.featured_image_url` |
| `AuthorCard` | Author name, avatar | `User` (author) |
| `BlogTags` | Tag pills with filter links | `BlogTag` |
| `SocialShare` | WhatsApp, X/Twitter, Facebook, Pinterest, copy-link | Static |
| `RelatedPosts` | Posts in same category or tags | `BlogPost` |
| `BlogCTA` | In-post CTA linking to related product collection | Static / `Collection` |

---

### 4.7 User Account (`account/`)

| Component | Description | DB Model |
|-----------|-------------|----------|
| `AccountSidebar` | Nav: Profile, Orders, Wishlist, Addresses | — |
| `ProfileForm` | Name, email (readonly), phone — update via API | `User` |
| `PasswordChangeForm` | Current + new password, bcrypt verify | `User.password_hash` |
| `OrderHistoryTable` | Paginated orders with status badges | `Order` |
| `OrderDetail` | Items, tracking info, status timeline | `Order`, `OrderItem`, `OrderStatusHistory` |
| `WishlistGrid` | Saved products grid with remove + add-to-cart | `Wishlist`, `Product` |
| `AddressBook` | Saved addresses — add/edit/delete/set-default | `Address` |

---

### 4.8 Popup System (Client-Side)

Rendered in `StorefrontLayout` — loaded client-side, invisible to SSR.

```typescript
// hooks/usePopup.ts
// Fetches active popups from GET /api/storefront/popups
// Evaluates trigger rules client-side:
//   - DELAY: setTimeout(triggerValue * 1000)
//   - SCROLL_DEPTH: window scroll event % check
//   - EXIT_INTENT: mouseleave on document (desktop only)
// Respects frequency: ONCE_SESSION (sessionStorage) | ONCE_EVER (localStorage) | EVERY_VISIT
```

| Component | Description |
|-----------|-------------|
| `PopupManager` | Orchestrates which popup to show; renders `PopupModal` |
| `PopupModal` | Radix Dialog — renders `content_json`: heading, body, image, CTA, email form |
| `NewsletterPopupForm` | Email capture inside popup → `POST /api/storefront/newsletter` |

---

## 5. Admin Panel Components

### 5.1 Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `AdminLayout` | `components/admin/layout/AdminLayout.tsx` | Root wrapper: sidebar + topbar + main |
| `AdminSidebar` | `components/admin/layout/AdminSidebar.tsx` | Collapsible nav; links filtered by `UserRole` |
| `AdminTopbar` | `components/admin/layout/AdminTopbar.tsx` | Breadcrumb, user menu (profile/logout), default-password banner |
| `AdminBreadcrumb` | `components/admin/layout/AdminBreadcrumb.tsx` | Dynamic from route segments |
| `DefaultPasswordBanner` | `components/admin/layout/DefaultPasswordBanner.tsx` | Persistent ⚠ warning until default `admin` password changed |

---

### 5.2 Dashboard

| Component | Data Query | Phase |
|-----------|-----------|-------|
| `MetricCard` | `/api/admin/dashboard/stats` | 1 |
| `RecentOrdersTable` | Last 10 orders | 1 |
| `LowStockAlert` | `ProductVariant.stock <= 5` | 1 |
| `QuickActions` | Static links to add product, pending orders, create coupon | 1 |
| `RevenueChart` (recharts LineChart) | Daily revenue trend | 4 |
| `TopProductsChart` (recharts BarChart) | Top 10 by units sold | 4 |

---

### 5.3 Product Management

**`ProductListPage`** → `DataTable` with:
- Columns: image, title, SKU, price, stock, category, status, featured, created
- Bulk actions: status update, category change, delete
- Filters: status, category, low-stock toggle, date range

**`ProductForm`** (Add / Edit) — 7 sections:

| Section | Key Components | DB Fields |
|---------|---------------|-----------|
| Basic Info | `SlugField`, `RichTextEditor` (Tiptap) | `title`, `slug`, `description`, `status`, `featured` |
| Pricing & Inventory | Number inputs | `price`, `compare_at_price`, `sku`, `stock` |
| Images | `ImageUploader` (react-dropzone, drag-reorder) | `ProductImage[]` |
| Variants | Dynamic table rows | `ProductVariant[]` (size, colour, sku, stock, price_override) |
| Categorisation | `Select`, `MultiSelect` | `category_id`, `sub_category_id`, `ProductCollection` |
| Cosmic Metadata | `Select` (NavagrahaPlanet enum), `Select` (ZodiacSign enum) | `planet`, `zodiac_sign`, `life_path_number`, `emotional_intention`, `tags` |
| SEO | Character-counted text inputs | `meta_title`, `meta_description` |

---

### 5.4 Category & Collection Management

**`CategoryPage`** — Two-panel layout:
- Left: `CategoryList` (drag-to-reorder → `sort_order`)
- Right: `SubCategoryList` (filtered to selected category)

**`CollectionForm`** — Conditional fields by `CollectionType`:

| Type | Conditional Fields |
|------|-------------------|
| `PLANETARY` | `NavagrahaPlanet` select + Colour Palette JSON editor |
| `ZODIAC` | `ZodiacSign` select |
| `NUMEROLOGY` | Life Path Number input |
| `VIBE` / `RITUAL` | No extra fields |

Bottom of form: product multi-select picker → manages `ProductCollection` join table.

---

### 5.5 Order Management

**`OrderListPage`** → `DataTable` with quick-filter tab bar:
- Tabs: All / Pending / Shipped / Delivered / Cancelled
- Columns: order number, customer, items count, total, status badge, payment badge, date

**`OrderDetailPage`** — Two-column layout:

| Left Column | Right Column |
|-------------|--------------|
| `OrderItemsTable` | `CustomerInfo` card |
| `OrderSummaryCard` (subtotal → total) | `ShippingAddressCard` |
| `StatusTimeline` (from `OrderStatusHistory`) | `PaymentInfoCard` (Razorpay IDs) |
| | `ShippingInfoEditor` (tracking number, provider, URL) |
| | `AdminNotesEditor` |

**`StatusUpdateFlow`:**
- Dropdown shows only valid next statuses (controlled state machine)
- Optional note textarea
- Triggers: DB update + `OrderStatusHistory` insert + SendGrid email + `AdminActivityLog`

**`ExchangeFlow`:** Button on DELIVERED orders → creates new `Order` with `exchange_for_order_id` linked back

---

### 5.6 User Management

**`UserListPage`** → `DataTable`:
- Columns: name, email, role badge, status badge, order count, registered date
- Filters: role, status, search, date range

**`UserDetailPage`:**
- Profile card: name, email, phone, role, status, member since, email verified
- **Role promotion**: `Select` dropdown (SUPER_ADMIN only) → logs to `AdminActivityLog`
- **Status toggle**: Activate / Deactivate / Ban → confirmation dialog
- Tabs: Order History | Addresses (read-only)

---

### 5.7 Blog Management *(Phase 2)*

**`BlogPostForm`** — full Tiptap editor with:
- Featured image upload
- Blog category select + tag multi-select (create on the fly)
- Status: Draft / Published / Scheduled
- Schedule date-time picker (shown when status = SCHEDULED)
- SEO fields: meta title (60 char), meta description (160 char), canonical URL

**Inline CRUD pages:**
- `/admin/blog/categories` — name, slug, post count
- `/admin/blog/tags` — name, slug, post count

---

### 5.8 Coupon Management *(Phase 2)*

**`CouponForm`** — full field set:
- Auto-generate code button
- Discount type radio (PERCENTAGE / FLAT)
- Conditional `MaxDiscount` field (PERCENTAGE only)
- Applicability radio → `MultiSelect` picker for categories/products if not site-wide
- Date range pickers (valid_from, valid_until)

**`CouponUsageReport`** — table on `/admin/coupons/[id]`:
- Per-redemption: user name, order number, discount applied, date
- Summary stats: total uses, total discount, unique users

---

### 5.9 Pop-up Management *(Phase 2)*

**`PopupForm`:**
- Visual content editor (not raw JSON) → serialises to `content_json`
- Trigger type select + conditional trigger value input
- Target pages multi-select
- Frequency select + active toggle + date range

**`AnnouncementBarForm`** (`/admin/announcements`):
- Single active bar constraint (enforced API-side)
- Live preview strip rendered above the form
- Colour pickers for bg_colour + text_colour (defaults: Nebula Gold / Cosmic Black)

---

### 5.10 Settings Page *(Phase 1 — Tabbed)*

| Tab | Settings Keys | Components |
|-----|--------------|------------|
| Store Info | `store_name`, `store_logo_url`, `contact_email`, `social_links` | Text inputs, image upload, JSON social links form |
| Shipping | `shipping_config` | JSON form editor (zones, rates, free-shipping thresholds) |
| Tax | `tax_config` | Rate input + inclusive/exclusive toggle |
| Payment | `razorpay_key_id`, `razorpay_mode` | Masked text input, test/live toggle |
| Email | `sendgrid_api_key`, `email_templates` | Masked key, template ID form |
| Analytics | `gtm_container_id`, `meta_pixel_id` | Text inputs |

---

### 5.11 Admin Profile & Activity Log

**`AdminProfilePage`** (`/admin/profile`):
- Profile section: editable name + phone; read-only email, role, member since
- Password change section: current password → new → confirm; bcrypt verify on API

**`ActivityLogPage`** (`/admin/activity-log`) — Phase 4, SUPER_ADMIN only:
- Read-only `DataTable` of `AdminActivityLog`
- Expandable rows → `payload_json` diff/context
- Filters: action, entity type, admin, date range

---

## 6. Shared / Common Components

### 6.1 UI Primitives (`components/ui/`)

| Component | Based On | Purpose |
|-----------|----------|---------|
| `Button` | Custom | Primary, secondary, ghost, destructive variants |
| `Input` | Custom | Text, number, password, email inputs |
| `Select` | Radix Select | Single-select dropdown |
| `MultiSelect` | Radix + custom | Multi-select with search |
| `Checkbox` | Radix Checkbox | Checkbox with label |
| `Switch` | Radix Switch | Toggle switch |
| `Dialog` | Radix Dialog | Modal dialogs |
| `Tabs` | Radix Tabs | Tabbed interfaces |
| `Tooltip` | Radix Tooltip | Hover tooltips |
| `DropdownMenu` | Radix Dropdown | Dropdown menus |
| `Badge` | Custom | Status colour badges |
| `Spinner` | Custom | Loading indicator |
| `Toast` | react-hot-toast | Success / error / info notifications |

### 6.2 Admin Shared Components (`components/admin/shared/`)

| Component | Purpose |
|-----------|---------|
| `DataTable` | Sortable, filterable, paginated table with row selection + bulk actions |
| `FormField` | Label + input + Zod error message wrapper |
| `ImageUploader` | Dropzone (react-dropzone), preview grid, reorder, alt text, upload to `/api/admin/upload` |
| `RichTextEditor` | Tiptap v2.4 with headings, lists, blockquotes, links, image upload |
| `SlugField` | Auto-slug from title (slugify), with manual override and uniqueness warning |
| `StatusBadge` | Colour-coded badge for `OrderStatus`, `ProductStatus`, `UserStatus` |
| `ConfirmDialog` | Radix Dialog for destructive actions with confirmation text |
| `DateRangePicker` | Date range filter for table columns |
| `ColourPicker` | Hex colour input with live colour preview swatch |
| `MetricCard` | Dashboard stat card: value, label, trend arrow, change % |
| `EmptyState` | Empty list placeholder with icon + CTA |
| `PageHeader` | Page title + action button slot (e.g., "Add Product" button) |

---

## 7. API Route Architecture

### 7.1 Request Lifecycle (All `/api/admin/*`)

```
Request
  → middleware.ts (NextAuth withAuth — rejects if no session or CUSTOMER role)
  → Route Handler
      1. getServerSession(authOptions)        ← verify session
      2. requireRole(session, allowedRoles)   ← RBAC check
      3. zod.parse(requestBody)               ← input validation
      4. Prisma query                         ← DB operation
      5. AdminActivityLog.create(...)         ← audit trail (mutating routes only)
  → Standard JSON response
```

### 7.2 Standard Response Shape

```typescript
// Success (single resource)
{ success: true, data: T }

// Success (paginated list)
{ success: true, data: T[], pagination: { page, perPage, total, totalPages } }

// Error
{ success: false, error: string, code?: string }
```

### 7.3 Admin API Route Reference

| Method | Route | Role | Phase |
|--------|-------|------|-------|
| GET | `/api/admin/dashboard/stats` | All admin | 1 |
| GET/POST | `/api/admin/products` | Super, Content (GET only) | 1 |
| GET/PUT/DELETE | `/api/admin/products/[id]` | Super; Content (GET only) | 1 |
| POST | `/api/admin/products/bulk` | Super | 1 |
| GET/POST | `/api/admin/categories` | Super | 1 |
| PUT/DELETE | `/api/admin/categories/[id]` | Super | 1 |
| POST | `/api/admin/categories/[id]/subcategories` | Super | 1 |
| PUT/DELETE | `/api/admin/subcategories/[id]` | Super | 1 |
| GET/POST | `/api/admin/collections` | Super | 1 |
| PUT/DELETE | `/api/admin/collections/[id]` | Super | 1 |
| GET | `/api/admin/orders` | Super, Order | 1 |
| GET | `/api/admin/orders/[id]` | Super, Order | 1 |
| PATCH | `/api/admin/orders/[id]/status` | Super, Order | 1 |
| PATCH | `/api/admin/orders/[id]/tracking` | Super, Order | 1 |
| POST | `/api/admin/orders/[id]/exchange` | Super, Order | 1 |
| GET | `/api/admin/users` | Super, Order | 1 |
| GET | `/api/admin/users/[id]` | Super, Order | 1 |
| PATCH | `/api/admin/users/[id]/status` | Super, Order | 1 |
| PATCH | `/api/admin/users/[id]/role` | **Super only** | 1 |
| GET/PUT | `/api/admin/profile` | All admin (own) | 1 |
| PATCH | `/api/admin/profile/password` | All admin (own) | 1 |
| POST | `/api/admin/upload` | All admin | 1 |
| GET/POST | `/api/admin/blog/posts` | Super, Content | 2 |
| GET/PUT/DELETE | `/api/admin/blog/posts/[id]` | Super, Content | 2 |
| CRUD | `/api/admin/blog/categories` | Super, Content | 2 |
| CRUD | `/api/admin/blog/tags` | Super, Content | 2 |
| CRUD | `/api/admin/coupons` | Super | 2 |
| CRUD | `/api/admin/promotions` | Super | 2 |
| CRUD | `/api/admin/popups` | Super, Content | 2 |
| CRUD | `/api/admin/announcements` | Super, Content | 2 |
| GET/PUT | `/api/admin/settings` | Super | 1 |
| GET | `/api/admin/activity-log` | **Super only** | 4 |

### 7.4 Storefront API Routes

| Method | Route | Auth Required | Description |
|--------|-------|:------------:|-------------|
| GET | `/api/storefront/products` | No | List products with filters |
| GET | `/api/storefront/products/[slug]` | No | Single product detail |
| GET | `/api/storefront/categories` | No | Category + sub-category tree |
| GET | `/api/storefront/collections` | No | Collection list |
| GET | `/api/storefront/collections/[slug]` | No | Collection detail + products |
| GET | `/api/storefront/blog/posts` | No | Paginated blog posts |
| GET | `/api/storefront/blog/posts/[slug]` | No | Single blog post |
| GET | `/api/storefront/search` | No | Full-text search |
| GET/POST/PATCH | `/api/storefront/cart` | No (session) | Cart CRUD |
| POST | `/api/storefront/checkout/create-order` | Optional | Create Razorpay order |
| POST | `/api/storefront/checkout/verify-payment` | Optional | Verify Razorpay signature → create Order |
| GET | `/api/storefront/orders/[id]/track` | Yes | Order tracking for customer |
| GET/POST | `/api/storefront/wishlist` | Yes | Get/add wishlist items |
| DELETE | `/api/storefront/wishlist/[productId]` | Yes | Remove from wishlist |
| POST | `/api/storefront/reviews` | Yes | Submit product review |
| POST | `/api/storefront/newsletter` | No | Newsletter subscribe |
| GET | `/api/storefront/popups` | No | Get active popups |
| GET | `/api/storefront/announcements/active` | No | Get active announcement bar |

---

## 8. Data Layer & State Management

### 8.1 Server State — TanStack React Query v5

Used exclusively in the **admin panel** (CSR). All API calls go through React Query hooks.

```typescript
// Example: product list
const { data, isLoading } = useQuery({
  queryKey: ['admin', 'products', filters],
  queryFn: () => fetchProducts(filters),
})

// Mutation with optimistic update
const mutation = useMutation({
  mutationFn: updateProductStatus,
  onSuccess: () => queryClient.invalidateQueries(['admin', 'products']),
})
```

### 8.2 Client State — Zustand

| Store | File | Purpose |
|-------|------|---------|
| `cartStore` | `store/cartStore.ts` | Cart items, totals, coupon state — persisted to localStorage for guests |
| `uiStore` | `store/uiStore.ts` | Sidebar collapse, mini-cart open/closed, active modal |
| `uploadStore` | `store/uploadStore.ts` | Image upload progress state in admin forms |

### 8.3 Form State — React Hook Form + Zod

All forms (admin + storefront) use `react-hook-form 7.51.x` with Zod schemas for validation.

```typescript
// lib/validations/product.ts
export const productSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  // ...
})
```

---

## 9. Database Model Map

> All models defined in `prisma/schema.prisma`. MySQL + Prisma ORM.

### 9.1 Model Groups

```
CORE
├── User                ← All platform users; role distinguishes customer vs admin
├── Address             ← Shipping/billing per user

CATALOGUE
├── Product             ← Core entity; cosmic metadata as first-class fields
├── ProductImage        ← Ordered image gallery per product
├── ProductVariant      ← Size + colour combination with own SKU + stock
├── Category            ← Physical garment type (e.g., Oversized Tees)
├── SubCategory         ← Theme grouping under category (e.g., Zodiac Collection)
└── Collection          ← Cross-category thematic groupings (Planetary, Zodiac, etc.)

COMMERCE
├── Cart                ← One per user/session; nullable userId for guests
├── CartItem            ← Line item → ProductVariant
├── Order               ← Completed purchase; price snapshot at order time
├── OrderItem           ← Purchased item snapshot (product title + variant + price)
├── OrderStatusHistory  ← Immutable audit log of every order status change
├── Coupon              ← Discount code with full rule configuration
└── CouponUsage         ← Per-user per-order redemption tracking

ENGAGEMENT
├── Review              ← Product reviews with moderation (PENDING/APPROVED/REJECTED)
├── Wishlist            ← Saved products per user
├── BlogCategory        ← Content category for blog
├── BlogTag             ← Free-form blog tags
├── BlogPost            ← Rich-content posts (status: DRAFT/PUBLISHED/SCHEDULED)
└── NewsletterSubscriber← Email list for SendGrid

ADMIN / MARKETING
├── Popup               ← Configurable pop-up (delay / scroll / exit-intent triggers)
├── Promotion           ← Auto-applied or code-linked discount rules
└── AnnouncementBar     ← Top-of-site promotional strip (one active at a time)

SYSTEM
├── Settings            ← Key-value store for all configurable settings
└── AdminActivityLog    ← Immutable audit trail of all admin actions

JUNCTION TABLES
├── ProductCollection   ← Many-to-many: Product ↔ Collection (with sort_order)
└── BlogPostTag         ← Many-to-many: BlogPost ↔ BlogTag
```

### 9.2 Key Enumerations

| Enum | Values |
|------|--------|
| `UserRole` | `SUPER_ADMIN`, `CONTENT_MANAGER`, `ORDER_MANAGER`, `CUSTOMER` |
| `UserStatus` | `ACTIVE`, `INACTIVE`, `BANNED` |
| `ProductStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `OrderStatus` | `PLACED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `REFUNDED`, `EXCHANGED` |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `CollectionType` | `PLANETARY`, `ZODIAC`, `NUMEROLOGY`, `VIBE`, `RITUAL` |
| `NavagrahaPlanet` | `SUN`, `MOON`, `MARS`, `MERCURY`, `JUPITER`, `VENUS`, `SATURN`, `RAHU`, `KETU` |
| `ZodiacSign` | `ARIES` … `PISCES` (12 values) |
| `DiscountType` | `PERCENTAGE`, `FLAT` |
| `BlogPostStatus` | `DRAFT`, `PUBLISHED`, `SCHEDULED` |
| `ReviewStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `PopupTrigger` | `DELAY`, `SCROLL_DEPTH`, `EXIT_INTENT` |
| `PopupFrequency` | `ONCE_SESSION`, `ONCE_EVER`, `EVERY_VISIT` |

---

## 10. Auth Architecture

### 10.1 NextAuth.js Configuration (`lib/auth.ts`)

```typescript
// Providers at launch
providers: [CredentialsProvider]          // Phase 1 — email + password
// providers: [GoogleProvider]            // Phase 4 — Google OAuth

// Strategy
session: { strategy: 'jwt' }

// JWT payload includes: id, email, name, role, defaultPassword flag
```

### 10.2 Middleware (`middleware.ts`)

```typescript
export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
// Admin routes → redirect CUSTOMER role to /login?error=unauthorized
// Account routes → redirect unauthenticated to /login
```

### 10.3 RBAC Enforcement

RBAC is enforced at **two levels**:

1. **API level** — every `/api/admin/*` handler:
```typescript
export function requireRole(session: Session, roles: UserRole[]) {
  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error('Forbidden')
  }
}
```

2. **UI level** — sidebar nav links and action buttons conditionally rendered:
```typescript
// AdminSidebar.tsx
const navItems = ALL_NAV_ITEMS.filter(item =>
  item.allowedRoles.includes(session.user.role)
)
```

### 10.4 Role Permissions Summary

| Feature | SUPER_ADMIN | CONTENT_MANAGER | ORDER_MANAGER |
|---------|:-----------:|:---------------:|:-------------:|
| Products | CRUD | Read | Read |
| Categories / Collections | CRUD | Read | Read |
| Orders | CRUD | — | CRUD |
| Users | CRUD + promote | — | Read + toggle |
| Blog / Popups / Announcements | CRUD | CRUD | — |
| Coupons | CRUD | — | Read |
| Promotions / Settings | CRUD | — | — |
| Activity Log | Read | — | — |
| Own Profile / Password | ✓ | ✓ | ✓ |

### 10.5 Password Security

- Passwords hashed with `bcryptjs` (12 salt rounds)
- Default seed password for Super Admin: `admin` (must change on first login)
- JWT carries a `defaultPassword: boolean` flag — UI shows persistent warning banner when `true`
- Rate limiting on `POST /api/auth/signin` — prevent brute force

---

## 11. Third-Party Integrations

### 11.1 Razorpay (Payment)

```
POST /api/storefront/checkout/create-order
  → razorpay.orders.create({ amount, currency: 'INR', receipt })
  → Returns: { razorpayOrderId, amount, currency }

Client: Razorpay.open({ key, order_id, handler })
  → On success: handler calls POST /api/storefront/checkout/verify-payment

POST /api/storefront/checkout/verify-payment
  → crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId)
  → If valid: create Order in DB, clear cart, send confirmation email
```

### 11.2 SendGrid (Transactional Email)

| Trigger | Template | Phase |
|---------|----------|-------|
| Order confirmed | `order_confirm` template ID | 1 |
| Order status → SHIPPED | `shipping_update` template | 1 |
| Order status → OUT_FOR_DELIVERY | `shipping_update` template | 1 |
| Order status → DELIVERED | `shipping_update` template | 1 |
| Password reset | `password_reset` template | 1 |
| Newsletter subscription | SendGrid List add | 2 |

### 11.3 Twilio (SMS Notifications) — Phase 4

| Event | SMS Trigger |
|-------|------------|
| Order PLACED | Confirmation SMS |
| Order SHIPPED | Shipping notification |
| Order OUT_FOR_DELIVERY | Out for delivery alert |
| Order DELIVERED | Delivery confirmation |

### 11.4 Hostinger S3 (File Storage)

Upload flow:
```
Admin form → react-dropzone → POST /api/admin/upload
  → Validates: mime type (jpeg/webp/avif/png), max 5MB
  → Converts/optimises to WebP via sharp
  → Uploads to Hostinger S3: {entity}/{entityId}/{uuid}.webp
  → Returns: { url }
  → Saved to ProductImage.url / Collection.image_url / BlogPost.featured_image_url etc.
```

### 11.5 Cloudflare (CDN)

- All Hostinger S3 asset URLs proxied through Cloudflare for global CDN delivery
- DDoS protection at DNS level
- Cache rules: images cached at edge, HTML pages not cached (SSR)

---

## 12. Analytics & Tracking Layer

### 12.1 Google Tag Manager

GTM container injected via Next.js `<Script>` in `app/(store)/layout.tsx`:
- `<head>` script tag
- `<noscript>` iframe in `<body>`
- Container ID from `Settings.gtm_container_id` (configurable from admin)

### 12.2 DataLayer Event Map

All events pushed via `lib/datalayer.ts`:

```typescript
// Example
export function pushViewItem(product: Product) {
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [{ item_id: product.id, item_name: product.title, price: product.price, ... }]
    }
  })
}
```

| Event | Fired From Component |
|-------|---------------------|
| `page_view` | `app/(store)/layout.tsx` on route change |
| `view_item` | `ProductDetailPage` on mount |
| `view_item_list` | `ProductGrid` on mount |
| `select_item` | `ProductCard` on click |
| `add_to_cart` | `AddToCartButton` on success |
| `remove_from_cart` | `CartItem` on remove |
| `view_cart` | `CartPage` on mount |
| `begin_checkout` | Checkout step 1 on enter |
| `add_shipping_info` | Checkout step 2 complete |
| `add_payment_info` | Checkout step 3 enter |
| `purchase` | `OrderConfirmationPage` on mount |
| `sign_up` | Registration success |
| `login` | Login success |
| `search` | `SearchBar` on submit |

### 12.3 Tag-Friendly Markup Convention

All interactive elements carry meaningful attributes for GTM configuration without code changes:

```typescript
// Consistent naming — applied on all product cards and buttons
data-gtm-action="add_to_cart"
data-gtm-category="product"
data-gtm-label="{product.title}"
data-product-id="{product.id}"
data-product-name="{product.title}"
data-product-category="{category.name}"
data-product-price="{product.price}"
```

---

## 13. Phase Mapping

| Component / Feature | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|---------------------|:-------:|:-------:|:-------:|:-------:|:-------:|
| Solar System Banner | ✓ | | | | |
| Product CRUD (admin) | ✓ | | | | |
| Category / Sub-Category / Collection CRUD | ✓ | | | | |
| Cart + Checkout + Razorpay | ✓ | | | | |
| Order Management (admin) | ✓ | | | | |
| User Management (basic) | ✓ | | | | |
| Settings (store, shipping, payment, analytics IDs) | ✓ | | | | |
| Admin Profile + Password Change | ✓ | | | | |
| GTM / Meta Pixel base setup | ✓ | | | | |
| 3–4 Planetary Collection pages | ✓ | | | | |
| Blog Engine (frontend + admin) | | ✓ | | | |
| Newsletter + SendGrid | | ✓ | | | |
| Pop-up System | | ✓ | | | |
| Coupon + Promotion Management | | ✓ | | | |
| Announcement Bar | | ✓ | | | |
| Full GA4 DataLayer events | | | ✓ | | |
| Meta Pixel standard events (all parameters) | | | ✓ | | |
| Tag-friendly markup audit | | | ✓ | | |
| Advanced filters (planet, zodiac, life path) | | | | ✓ | |
| Product Reviews | | | | ✓ | |
| Wishlist | | | | ✓ | |
| Google Social Login | | | | ✓ | |
| SMS via Twilio (order status) | | | | ✓ | |
| Admin Dashboard Charts (recharts) | | | | ✓ | |
| Full RBAC (all roles) | | | | ✓ | |
| Search Autocomplete | | | | ✓ | |
| Activity Log UI | | | | ✓ | |
| Shipping Provider API (automated tracking) | | | | | ✓ |
| Meta Conversions API (server-side) | | | | | ✓ |
| Multi-currency / i18n | | | | | ✓ |

---

*This document is the single reference for all component boundaries, file locations, data flows, and API contracts within the Vastrayug platform. All implementation must align with the data models in `prisma/schema.prisma`, features in `prd_new.md`, and admin specifications in `admin_panel_spec.md`.*
