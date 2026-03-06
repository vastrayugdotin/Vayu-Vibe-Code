# Admin Panel Specification — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final Pre-Development
> Cross-referenced from `prd_new.md` (Section 8), `_schema.md`, `tech_stack.md`, and `phases.md`.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture & Rendering](#2-architecture--rendering)
3. [Authentication & RBAC](#3-authentication--rbac)
4. [Route Map](#4-route-map)
5. [Dashboard](#5-dashboard)
6. [Product Management](#6-product-management)
7. [Category & Sub-Category Management](#7-category--sub-category-management)
8. [Collection Management](#8-collection-management)
9. [Order Management](#9-order-management)
10. [User Management](#10-user-management)
11. [Blog Management](#11-blog-management)
12. [Coupon Management](#12-coupon-management)
13. [Promotion Management](#13-promotion-management)
14. [Pop-up Management](#14-pop-up-management)
15. [Announcement Bar Management](#15-announcement-bar-management)
16. [Settings](#16-settings)
17. [Admin Activity Log](#17-admin-activity-log)
18. [API Routes](#18-api-routes)
19. [Shared UI Components](#19-shared-ui-components)
20. [Phase Rollout](#20-phase-rollout)

---

## 1. Overview

The admin panel is the operational backbone of the Vastrayug platform. It provides a custom-built React interface (not a third-party CMS) that gives the business owner full control over products, orders, users, content, marketing, and settings — all without developer intervention.

**Key principles:**
- Every admin action should complete in under 2 minutes (PRD success metric).
- No public indexing — fully auth-gated, CSR-rendered.
- All mutating actions are logged in `AdminActivityLog` for audit trail.
- UI follows the Vastrayug brand aesthetic — Cosmic Black canvas, Nebula Gold accents, Stardust White text.

---

## 2. Architecture & Rendering

| Aspect | Decision |
|--------|----------|
| **Rendering** | Client-Side Rendering (CSR) — no SSR/SSG for admin routes |
| **Route group** | `app/(admin)/admin/` — separate layout from storefront |
| **Data fetching** | TanStack React Query `5.x` — cache, pagination, optimistic updates |
| **Forms** | `react-hook-form 7.51.x` + `zod 3.23.x` for validation |
| **State** | Zustand `4.5.x` for sidebar collapse, active filters, upload state |
| **Rich text** | `@tiptap/react 2.4.x` with image + link extensions |
| **File upload** | `react-dropzone 14.x` → `POST /api/admin/upload` → Hostinger S3 |
| **Charts** | `recharts 2.12.x` — dashboard analytics (Phase 4) |
| **Icons** | `lucide-react 0.378.x` |
| **Toasts** | `react-hot-toast 2.4.x` |
| **UI primitives** | Radix UI — Dialog, Select, Checkbox, Switch, Tabs, Dropdown Menu, Tooltip |

### Admin Layout Structure

```
app/(admin)/admin/
├── layout.tsx              ← Auth gate + sidebar + topbar wrapper
├── dashboard/
│   └── page.tsx
├── products/
│   ├── page.tsx            ← Product list
│   ├── new/
│   │   └── page.tsx        ← Add product form
│   └── [id]/
│       └── page.tsx        ← Edit product form
├── categories/
│   ├── page.tsx            ← Category + sub-category list
│   └── [id]/
│       └── page.tsx        ← Edit category
├── collections/
│   ├── page.tsx            ← Collection list
│   └── [id]/
│       └── page.tsx        ← Edit collection
├── orders/
│   ├── page.tsx            ← Order list
│   └── [id]/
│       └── page.tsx        ← Order detail + status updates
├── users/
│   ├── page.tsx            ← User list
│   └── [id]/
│       └── page.tsx        ← User detail + order history
├── blog/
│   ├── page.tsx            ← Post list
│   ├── new/
│   │   └── page.tsx        ← Create post
│   ├── [id]/
│   │   └── page.tsx        ← Edit post
│   ├── categories/
│   │   └── page.tsx        ← Blog category management
│   └── tags/
│       └── page.tsx        ← Blog tag management
├── coupons/
│   ├── page.tsx            ← Coupon list
│   ├── new/
│   │   └── page.tsx        ← Create coupon
│   └── [id]/
│       └── page.tsx        ← Edit coupon + usage report
├── promotions/
│   ├── page.tsx            ← Promotion list
│   ├── new/
│   │   └── page.tsx        ← Create promotion
│   └── [id]/
│       └── page.tsx        ← Edit promotion
├── popups/
│   ├── page.tsx            ← Pop-up list
│   ├── new/
│   │   └── page.tsx        ← Create pop-up
│   └── [id]/
│       └── page.tsx        ← Edit pop-up
├── announcements/
│   └── page.tsx            ← Announcement bar CRUD (single active)
├── profile/
│   └── page.tsx            ← Admin profile + change password
├── settings/
│   └── page.tsx            ← All settings tabs
└── activity-log/
    └── page.tsx            ← Read-only audit trail
```

---

## 3. Authentication & RBAC

### Auth Gate

All `/admin/*` routes are protected by `middleware.ts` (NextAuth `withAuth`). Only users with role `SUPER_ADMIN`, `CONTENT_MANAGER`, or `ORDER_MANAGER` can access any admin route.

```
middleware.ts matcher: ['/admin/:path*']
```

Unauthenticated or unauthorized users are redirected to `/login?error=unauthorized`.

### Default Admin Account (Seed)

The platform ships with one pre-seeded Super Admin account:

| Field | Value |
|-------|-------|
| **Email** | `vastrayug.in@gmail.com` |
| **Password** | `admin` (bcrypt-hashed at 12 salt rounds in seed script) |
| **Name** | `Vastrayug Admin` |
| **Role** | `SUPER_ADMIN` |
| **Status** | `ACTIVE` |

> **Security note:** The admin must change this default password immediately after first login. The admin topbar displays a persistent warning banner until the default password is changed.

### User Registration Policy

- **All users who sign up on the storefront are registered with role `CUSTOMER`** — this is the only role available at registration.
- There is no self-service way for a user to become an admin.
- **Only a `SUPER_ADMIN` can promote a user** to `CONTENT_MANAGER`, `ORDER_MANAGER`, or `SUPER_ADMIN` via the admin panel's User Management section.
- Role changes are logged in `AdminActivityLog`.

### Role Permissions Matrix

| Feature | SUPER_ADMIN | CONTENT_MANAGER | ORDER_MANAGER |
|---------|:-----------:|:---------------:|:-------------:|
| Dashboard | Full | Content stats only | Order stats only |
| Products | CRUD | Read only | Read only |
| Categories | CRUD | Read only | Read only |
| Collections | CRUD | Read only | Read only |
| Orders | CRUD | No access | CRUD |
| Users | CRUD + role promotion | No access | Read + status toggle |
| Blog | CRUD | CRUD | No access |
| Coupons | CRUD | No access | Read only |
| Promotions | CRUD | No access | No access |
| Pop-ups | CRUD | CRUD | No access |
| Announcements | CRUD | CRUD | No access |
| Settings | Full | No access | No access |
| Activity Log | Read | No access | No access |
| Profile / Password | Own profile | Own profile | Own profile |

### Implementation

- RBAC enforced at **two levels**:
  1. **API route level** — every `/api/admin/*` handler checks `session.user.role` before processing.
  2. **UI level** — sidebar nav items and action buttons are conditionally rendered based on role.
- Role check utility:

```typescript
// lib/auth.ts (addition)
export function requireRole(session: Session, roles: UserRole[]) {
  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error('Forbidden')
  }
}
```

### Phase Note

Full RBAC enforcement ships in **Phase 4**. In Phase 1, only `SUPER_ADMIN` exists (seeded as `vastrayug.in@gmail.com` / `admin`) and has access to everything. The `role` field and permission matrix are scaffolded but only the Super Admin account is seeded. All storefront signups are registered as `CUSTOMER` and cannot access admin routes.

---

## 4. Route Map

| Admin Route | Purpose | Phase |
|-------------|---------|-------|
| `/admin/dashboard` | Overview metrics, quick actions, alerts | Phase 1 (basic), Phase 4 (charts) |
| `/admin/products` | Product listing, add, edit, archive | Phase 1 |
| `/admin/categories` | Category + sub-category CRUD | Phase 1 |
| `/admin/collections` | Collection CRUD | Phase 1 |
| `/admin/orders` | Order listing, detail, status updates | Phase 1 |
| `/admin/users` | User listing, profile, status toggle | Phase 1 (basic), Phase 4 (full RBAC) |
| `/admin/blog` | Blog post CRUD, categories, tags | Phase 2 |
| `/admin/coupons` | Coupon CRUD, usage reports | Phase 2 |
| `/admin/promotions` | Promotion CRUD | Phase 2 |
| `/admin/popups` | Pop-up CRUD with trigger rules | Phase 2 |
| `/admin/announcements` | Announcement bar management | Phase 2 |
| `/admin/settings` | Store config, payment, email, shipping | Phase 1 |
| `/admin/profile` | Admin profile + password change | Phase 1 |
| `/admin/activity-log` | Read-only audit trail | Phase 4 |

---

## 5. Dashboard

### 5.1 Overview Metrics Cards

| Metric | Source | Display |
|--------|--------|---------|
| Total Orders (Today / Week / Month) | `Order` table, filtered by `created_at` | Numeric with trend arrow |
| Revenue (Today / Week / Month) | `SUM(Order.total)` where `payment_status = PAID` | INR formatted, trend arrow |
| Active Users | `User` where `status = ACTIVE` and `role = CUSTOMER` | Count |
| Pending Orders | `Order` where `status = PLACED` or `PROCESSING` | Count with badge |
| Low Stock Alerts | `ProductVariant` where `stock <= 5` and `is_active = true` | Count with warning badge |

### 5.2 Quick Action Shortcuts

| Action | Route |
|--------|-------|
| Add Product | `/admin/products/new` |
| View Pending Orders | `/admin/orders?status=PLACED,PROCESSING` |
| Create Coupon | `/admin/coupons/new` |
| Create Blog Post | `/admin/blog/new` |

### 5.3 Recent Orders Table

Display the 10 most recent orders with columns:
- Order Number (`order_number`)
- Customer Name (`user.name` or `guest_email`)
- Total (formatted INR)
- Status (colour-coded badge)
- Payment Status (badge)
- Date (`created_at` — relative format via `date-fns`)

Clicking a row navigates to `/admin/orders/[id]`.

### 5.4 Top-Selling Products (Phase 4)

Bar chart (recharts) showing top 10 products by units sold, filterable by date range.

### 5.5 Revenue Chart (Phase 4)

Line chart showing daily/weekly/monthly revenue trend over the selected period.

---

## 6. Product Management

### 6.1 Product List Page (`/admin/products`)

#### Columns

| Column | Source | Sortable | Filterable |
|--------|--------|:--------:|:----------:|
| Image | First `ProductImage` where `is_primary = true` | No | No |
| Title | `Product.title` | Yes | Search |
| SKU | `Product.sku` | Yes | Search |
| Price | `Product.price` | Yes | Range |
| Stock | `Product.stock` | Yes | Low stock toggle |
| Category | `Category.name` | No | Select |
| Status | `Product.status` | No | Select (Draft / Published / Archived) |
| Featured | `Product.featured` | No | Toggle |
| Created | `Product.created_at` | Yes | Date range |

#### Actions

- **Add Product** button → `/admin/products/new`
- **Row click** → `/admin/products/[id]`
- **Bulk actions** (checkbox multi-select):
  - Update status (Draft / Published / Archived)
  - Update category
  - Delete selected

#### Pagination

Server-side cursor-based pagination, 20 items per page. Powered by React Query `useInfiniteQuery` or offset pagination.

### 6.2 Add / Edit Product Form

#### Form Sections

**Section 1 — Basic Info**

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Title | Text input | Required, max 200 chars | `Product.title` |
| Slug | Text input (auto-generated from title, editable) | Required, unique, URL-safe regex | `Product.slug` |
| Description | Rich text editor (Tiptap) | Required | `Product.description` |
| Status | Select: Draft / Published / Archived | Required | `Product.status` |
| Featured | Toggle switch | Default: false | `Product.featured` |

**Section 2 — Pricing & Inventory**

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Price (INR) | Number input | Required, > 0, 2 decimal places | `Product.price` |
| Compare-at Price | Number input | Optional, must be > price if set | `Product.compare_at_price` |
| SKU | Text input | Required, unique | `Product.sku` |
| Stock | Number input | Required, >= 0 | `Product.stock` |

**Section 3 — Images**

| Feature | Detail |
|---------|--------|
| Upload | `react-dropzone` — drag-and-drop, multi-file |
| Accepted types | `image/jpeg`, `image/webp`, `image/avif`, `image/png` |
| Max file size | 5 MB per image |
| Reorder | Drag-and-drop reordering sets `ProductImage.sort_order` |
| Primary | Click to mark one image as `is_primary = true` |
| Alt text | Editable text input per image |
| Delete | Remove image (with confirmation dialog) |
| Upload path | `products/{productId}/{uuid}.webp` on Hostinger S3 |

**Section 4 — Variants**

Dynamic table for managing `ProductVariant` entries:

| Field | Type | Validation |
|-------|------|------------|
| Size | Select: XS, S, M, L, XL, XXL | Required |
| Colour | Text input | Optional |
| Variant SKU | Text input | Required, unique |
| Stock | Number input | Required, >= 0 |
| Price Override | Number input | Optional, 2 decimal places |
| Active | Toggle | Default: true |

- **Add Variant** button appends a new row.
- **Delete** removes the variant (with confirmation if the variant has associated cart items or order items).
- The `(productId, size, colour)` combination must be unique — validate on submit.

**Section 5 — Categorisation**

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Category | Select (from `Category` list) | Required | `Product.category_id` |
| Sub-Category | Select (filtered by selected category) | Optional | `Product.sub_category_id` |
| Collections | Multi-select (from `Collection` list) | Optional | `ProductCollection` join table |

**Section 6 — Cosmic Metadata**

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Planet | Select: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu | Optional | `Product.planet` |
| Zodiac Sign | Select: Aries through Pisces | Optional | `Product.zodiac_sign` |
| Life Path Number | Number input | Optional, must be 1-9, 11, 22, or 33 | `Product.life_path_number` |
| Emotional Intention | Text input (e.g., "Confidence", "Healing") | Optional | `Product.emotional_intention` |
| Tags | Comma-separated text input or tag chips | Optional | `Product.tags` |

**Section 7 — SEO**

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Meta Title | Text input | Optional, max 60 chars | `Product.meta_title` |
| Meta Description | Textarea | Optional, max 160 chars | `Product.meta_description` |

Character count indicators displayed inline.

#### Form Behaviour

- **Save as Draft** — sets `status = DRAFT`, saves all data.
- **Publish** — sets `status = PUBLISHED`, validates all required fields.
- **Auto-slug** — when title changes and slug hasn't been manually edited, auto-generate via `slugify`.
- **Last modified** — display `updated_at` timestamp on the edit form.
- **Unsaved changes** — warn user before navigation if form is dirty (`react-hook-form` `formState.isDirty`).

---

## 7. Category & Sub-Category Management

### 7.1 Category List (`/admin/categories`)

Two-panel layout:
- **Left panel**: List of categories with sort order, drag-to-reorder.
- **Right panel**: Sub-categories under the selected category.

#### Category Fields

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Name | Text input | Required | `Category.name` |
| Slug | Text input (auto-gen from name) | Required, unique | `Category.slug` |
| Description | Textarea | Optional | `Category.description` |
| Image | Single image upload | Optional | `Category.image_url` |
| Sort Order | Number (or drag-to-reorder) | Default: 0 | `Category.sort_order` |
| Meta Title | Text input | Optional | `Category.meta_title` |
| Meta Description | Textarea | Optional | `Category.meta_description` |

#### Sub-Category Fields

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Name | Text input | Required | `SubCategory.name` |
| Slug | Text input (auto-gen) | Required, unique | `SubCategory.slug` |
| Parent Category | Auto-set from context | Required | `SubCategory.category_id` |
| Description | Textarea | Optional | `SubCategory.description` |
| Image | Single image upload | Optional | `SubCategory.image_url` |
| Sort Order | Number (or drag-to-reorder) | Default: 0 | `SubCategory.sort_order` |
| Meta Title | Text input | Optional | `SubCategory.meta_title` |
| Meta Description | Textarea | Optional | `SubCategory.meta_description` |

#### Actions

- **Create / Edit / Delete** categories and sub-categories.
- **Delete guard**: Prevent deletion if products are assigned to the category. Show count and require reassignment or confirmation.

### 7.2 Seed Data (Phase 1)

Initial categories to be seeded:

| Name | Slug |
|------|------|
| Oversized Tees | `oversized-tees` |
| Hoodies | `hoodies` |
| Co-ord Sets | `co-ord-sets` |
| Joggers | `joggers` |
| Jackets | `jackets` |
| Kurtas | `kurtas` |
| Accessories | `accessories` |

---

## 8. Collection Management

### 8.1 Collection List (`/admin/collections`)

| Column | Source | Filterable |
|--------|--------|:----------:|
| Name | `Collection.name` | Search |
| Type | `Collection.type` | Select (Planetary / Zodiac / Numerology / Vibe / Ritual) |
| Product Count | Count of `ProductCollection` | No |
| Active | `Collection.is_active` | Toggle |
| Sort Order | `Collection.sort_order` | No |

### 8.2 Collection Form

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Name | Text input | Required | `Collection.name` |
| Slug | Text input (auto-gen) | Required, unique | `Collection.slug` |
| Type | Select: Planetary, Zodiac, Numerology, Vibe, Ritual | Required | `Collection.type` |
| Description | Rich text (Tiptap) | Optional | `Collection.description` |
| Image | Single image upload | Optional | `Collection.image_url` |
| Active | Toggle | Default: true | `Collection.is_active` |
| Sort Order | Number | Default: 0 | `Collection.sort_order` |
| Meta Title | Text input | Optional | `Collection.meta_title` |
| Meta Description | Textarea | Optional | `Collection.meta_description` |

#### Conditional Fields (shown based on `type`)

| Type | Extra Fields |
|------|-------------|
| PLANETARY | Planet select (`NavagrahaPlanet` enum), Colour Palette JSON editor |
| ZODIAC | Zodiac Sign select (`ZodiacSign` enum) |
| NUMEROLOGY | Life Path Number input (1-9, 11, 22, 33) |
| VIBE | No extra fields |
| RITUAL | No extra fields |

#### Product Assignment

- Multi-select product picker at the bottom of the form.
- Manages `ProductCollection` join table entries.
- Drag-to-reorder sets `ProductCollection.sort_order`.

### 8.3 Seed Data (Phase 1)

Initial collections — 3-4 Navagraha planets + 5 Vibe collections:

| Name | Type | Planet/Vibe |
|------|------|-------------|
| Sun — Surya Collection | PLANETARY | SUN |
| Moon — Chandra Collection | PLANETARY | MOON |
| Saturn — Shani Collection | PLANETARY | SATURN |
| Jupiter — Guru Collection | PLANETARY | JUPITER |
| The Sovereign | VIBE | — |
| The Healer | VIBE | — |
| The Wanderer | VIBE | — |
| The Shadow | VIBE | — |
| The Reborn | VIBE | — |

---

## 9. Order Management

### 9.1 Order List (`/admin/orders`)

#### Columns

| Column | Source | Sortable | Filterable |
|--------|--------|:--------:|:----------:|
| Order Number | `Order.order_number` | Yes | Search |
| Customer | `User.name` or `Order.guest_email` | No | Search |
| Items | Count of `OrderItem` | No | No |
| Total | `Order.total` | Yes | Range |
| Status | `Order.status` | No | Multi-select |
| Payment | `Order.payment_status` | No | Multi-select |
| Date | `Order.created_at` | Yes | Date range |

#### Quick Filters (Tab Bar)

| Tab | Filter |
|-----|--------|
| All | No filter |
| Pending | `status IN (PLACED, PROCESSING)` |
| Shipped | `status = SHIPPED` |
| Delivered | `status = DELIVERED` |
| Cancelled | `status IN (CANCELLED, REFUNDED, EXCHANGED)` |

### 9.2 Order Detail Page (`/admin/orders/[id]`)

#### Layout: Two-Column

**Left Column (wide):**

1. **Order Items Table**

   | Column | Source |
   |--------|--------|
   | Image | Primary image of `OrderItem.product` |
   | Product | `OrderItem.product_title_snapshot` |
   | Variant | `OrderItem.variant_snapshot` (size + colour) |
   | Unit Price | `OrderItem.unit_price` |
   | Quantity | `OrderItem.quantity` |
   | Line Total | `OrderItem.line_total` |

2. **Order Summary**

   | Line | Value |
   |------|-------|
   | Subtotal | `Order.subtotal` |
   | Discount | `- Order.discount_amount` (show coupon code if applied) |
   | Shipping | `Order.shipping_cost` |
   | Tax | `Order.tax_amount` |
   | **Total** | **`Order.total`** |

3. **Status History Timeline**

   Vertical timeline from `OrderStatusHistory`, newest first:
   - Status badge
   - Note (if any)
   - Changed by (admin name)
   - Timestamp

**Right Column (narrow):**

1. **Customer Info**
   - Name, email, phone
   - Link to `/admin/users/[userId]`

2. **Shipping Address**
   - Rendered from `Order.shipping_address_json`

3. **Payment Info**
   - Payment status badge
   - Razorpay Order ID (linked to Razorpay dashboard)
   - Razorpay Payment ID

4. **Shipping Info**
   - Tracking Number (editable input)
   - Shipping Provider (editable input — e.g., "Delhivery", "DTDC")
   - Tracking URL (editable input)
   - Save button for shipping info updates

5. **Admin Notes**
   - Textarea for `Order.notes`
   - Save button

### 9.3 Status Update Flow

#### Status Transition Rules

```
PLACED → PROCESSING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                 ↓                                       ↓
            CANCELLED                              EXCHANGED
                 ↓
             REFUNDED
```

| Current Status | Allowed Transitions |
|---------------|-------------------|
| PLACED | PROCESSING, CANCELLED |
| PROCESSING | SHIPPED, CANCELLED |
| SHIPPED | OUT_FOR_DELIVERY, CANCELLED |
| OUT_FOR_DELIVERY | DELIVERED |
| DELIVERED | EXCHANGED |
| CANCELLED | REFUNDED |
| REFUNDED | (terminal) |
| EXCHANGED | (terminal) |

#### Status Update UI

- Dropdown showing only valid next statuses.
- Optional note textarea (stored in `OrderStatusHistory.note`).
- On submit:
  1. Update `Order.status`.
  2. Insert row into `OrderStatusHistory` with `changed_by_user_id` = current admin.
  3. Trigger email notification (SendGrid) for: SHIPPED, OUT_FOR_DELIVERY, DELIVERED.
  4. Trigger SMS notification (Twilio, Phase 4) for: PLACED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED.
  5. Log action in `AdminActivityLog`.

### 9.4 Exchange Flow

Vastrayug operates an **exchange-only policy** — no returns.

1. Admin clicks "Create Exchange" on a DELIVERED order.
2. System creates a new `Order` with `exchange_for_order_id` pointing to the original.
3. Original order status is set to `EXCHANGED`.
4. Admin fills in the replacement order items and shipping details.
5. Exchange confirmation email sent to customer.

### 9.5 Invoice / Packing Slip

- **Print Invoice** button generates a print-friendly view (CSS `@media print`).
- Invoice includes: order number, date, items, prices, shipping address, payment info, brand logo.
- No separate PDF generation library needed — browser print-to-PDF is sufficient.

---

## 10. User Management

> **Important:** All users who sign up on the storefront are registered with role `CUSTOMER`. No user can self-assign an admin role. Only a `SUPER_ADMIN` can promote a user to an admin role via this section.

### 10.1 User List (`/admin/users`)

#### Columns

| Column | Source | Sortable | Filterable |
|--------|--------|:--------:|:----------:|
| Name | `User.name` | Yes | Search |
| Email | `User.email` | No | Search |
| Role | `User.role` | No | Select |
| Status | `User.status` | No | Select |
| Orders | Count of `Order` | Yes | No |
| Registered | `User.created_at` | Yes | Date range |

### 10.2 User Detail Page (`/admin/users/[id]`)

**User Profile Card:**
- Name, email, phone, avatar
- Role badge
- Status badge
- Member since date
- Email verified status

**Actions:**
- **Toggle Status** — Activate / Deactivate / Ban (with confirmation dialog)
- **Change Role** — Select dropdown with options: `CUSTOMER`, `CONTENT_MANAGER`, `ORDER_MANAGER`, `SUPER_ADMIN`. **Only `SUPER_ADMIN` can access this action.** Changing a user from `CUSTOMER` to any admin role grants them access to the admin panel. Confirmation dialog required with clear warning text.

**Order History Tab:**
- Table of all orders by this user (same columns as order list).
- Click navigates to order detail.

**Addresses Tab:**
- List of all `Address` records for this user.
- Read-only view from admin.

---

## 10.3 Admin Profile & Password Change (`/admin/profile`)

Accessible to **all admin roles** — every admin can manage their own profile and change their password. Accessed via the user menu dropdown in `AdminTopbar`.

#### Profile Section

| Field | Type | Editable |
|-------|------|:--------:|
| Name | Text input | Yes |
| Email | Text input | Read-only (display only) |
| Phone | Text input | Yes |
| Role | Badge | Read-only (display only) |
| Member Since | Date | Read-only |

Save button updates the admin's own `User` record.

#### Password Change Section

| Field | Type | Validation |
|-------|------|------------|
| Current Password | Password input | Required — verified against `User.password_hash` via `bcrypt.compare` |
| New Password | Password input | Required, min 8 chars, must differ from current |
| Confirm New Password | Password input | Required, must match new password |

**Behaviour:**
- On submit, the API verifies the current password before accepting the change.
- New password is hashed with `bcryptjs` (12 salt rounds) and saved to `User.password_hash`.
- On success: toast notification "Password changed successfully", session remains active.
- On failure (wrong current password): error message "Current password is incorrect".
- Action logged in `AdminActivityLog` as `ADMIN_PASSWORD_CHANGED` (payload contains only the admin's user ID — never the password).

#### Default Password Warning

If the admin account still uses the default seed password (`admin`), a persistent warning banner is displayed at the top of every admin page:

```
⚠ You are using the default password. Please change it immediately for security.
[Change Password] button → navigates to /admin/profile#password
```

This banner is dismissed permanently once the password is changed. Detection is done by comparing the current hash against `bcrypt.hash('admin', 12)` at login time, storing a `default_password` flag in the JWT token.

---

## 11. Blog Management

> **Phase:** 2

### 11.1 Blog Post List (`/admin/blog`)

| Column | Sortable | Filterable |
|--------|:--------:|:----------:|
| Title | Yes | Search |
| Category | No | Select |
| Author | No | Select |
| Status (Draft / Published / Scheduled) | No | Select |
| Featured | No | Toggle |
| Published Date | Yes | Date range |

### 11.2 Blog Post Form (`/admin/blog/new`, `/admin/blog/[id]`)

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Title | Text input | Required | `BlogPost.title` |
| Slug | Text input (auto-gen) | Required, unique | `BlogPost.slug` |
| Body | Rich text editor (Tiptap — headings, lists, blockquotes, images, links, embeds) | Required | `BlogPost.body` |
| Excerpt | Textarea | Optional (auto-truncated from body if blank) | `BlogPost.excerpt` |
| Featured Image | Single image upload | Optional | `BlogPost.featured_image_url` |
| Featured Image Alt | Text input | Optional | `BlogPost.featured_image_alt` |
| Blog Category | Select (from `BlogCategory`) | Optional | `BlogPost.blog_category_id` |
| Tags | Multi-select / tag input (from `BlogTag`, create on the fly) | Optional | `BlogPostTag` join |
| Author | Select (from `User` where role is admin) | Required, defaults to current user | `BlogPost.author_id` |
| Status | Select: Draft / Published / Scheduled | Required | `BlogPost.status` |
| Published Date | Date-time picker | Required if Scheduled | `BlogPost.published_at` |
| Featured Post | Toggle | Default: false | `BlogPost.is_featured` |
| Meta Title | Text input | Optional, max 60 chars | `BlogPost.meta_title` |
| Meta Description | Textarea | Optional, max 160 chars | `BlogPost.meta_description` |
| Canonical URL | Text input | Optional, valid URL | `BlogPost.canonical_url` |

### 11.3 Blog Category Management (`/admin/blog/categories`)

Inline CRUD list:
- Name, slug (auto-gen), post count.
- Create / edit inline (no separate page).
- Delete guard: reassign posts or prevent if posts exist.

### 11.4 Blog Tag Management (`/admin/blog/tags`)

Inline CRUD list:
- Name, slug (auto-gen), post count.
- Create / edit inline.
- Delete removes `BlogPostTag` join entries.

---

## 12. Coupon Management

> **Phase:** 2

### 12.1 Coupon List (`/admin/coupons`)

| Column | Filterable |
|--------|:----------:|
| Code | Search |
| Discount | No (shows "20%" or "Rs 500") |
| Usage | Shows `times_used / usage_limit` |
| Valid Period | Date range |
| Active | Toggle |
| Applicability | Select |

### 12.2 Coupon Form

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Code | Text input (manual or auto-generate button) | Required, unique, uppercase | `Coupon.code` |
| Description | Text input | Optional | `Coupon.description` |
| Discount Type | Radio: Percentage / Flat | Required | `Coupon.discount_type` |
| Discount Value | Number input | Required, > 0 | `Coupon.discount_value` |
| Min Order Value | Number input | Default: 0 | `Coupon.min_order_value` |
| Max Discount | Number input | Optional (shown only for Percentage type) | `Coupon.max_discount` |
| Usage Limit | Number input | Optional (null = unlimited) | `Coupon.usage_limit` |
| Per User Limit | Number input | Default: 1 | `Coupon.per_user_limit` |
| Valid From | Date-time picker | Required | `Coupon.valid_from` |
| Valid Until | Date-time picker | Required, must be > valid_from | `Coupon.valid_until` |
| Applicability | Radio: Site-wide / Category / Product | Required | `Coupon.applicability` |
| Applicable Items | Multi-select picker (shown for Category/Product) | Required if not site-wide | `Coupon.applicable_ids_json` |
| First Order Only | Toggle | Default: false | `Coupon.first_order_only` |
| Stackable | Toggle | Default: false | `Coupon.is_stackable` |
| Active | Toggle | Default: true | `Coupon.is_active` |

### 12.3 Coupon Usage Report (`/admin/coupons/[id]`)

Table within the coupon detail page showing:

| Column | Source |
|--------|--------|
| User | `CouponUsage.user.name` |
| Order | `CouponUsage.order.order_number` (linked) |
| Discount Applied | `CouponUsage.discount_applied` |
| Date | `CouponUsage.used_at` |

Summary stats at top: total times used, total discount given, unique users.

---

## 13. Promotion Management

> **Phase:** 2

### 13.1 Promotion Form

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Name | Text input | Required | `Promotion.name` |
| Description | Textarea | Optional | `Promotion.description` |
| Discount Type | Radio: Percentage / Flat | Required | `Promotion.discount_type` |
| Discount Value | Number input | Required, > 0 | `Promotion.discount_value` |
| Applicability | Radio: Site-wide / Category / Product | Required | `Promotion.applicability` |
| Applicable Items | Multi-select picker | Required if not site-wide | `Promotion.applicable_ids_json` |
| Auto Apply | Toggle | Default: true | `Promotion.auto_apply` |
| Promo Code | Text input | Required if auto_apply = false | `Promotion.promo_code` |
| Start Date | Date-time picker | Required | `Promotion.start_date` |
| End Date | Date-time picker | Required, > start | `Promotion.end_date` |
| Active | Toggle | Default: false | `Promotion.is_active` |

---

## 14. Pop-up Management

> **Phase:** 2

### 14.1 Pop-up Form

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Title | Text input | Required (internal label) | `Popup.title` |
| Content | Rich JSON editor — text, image URL, CTA text, CTA link, form fields | Required | `Popup.content_json` |
| Trigger Type | Select: Delay / Scroll Depth / Exit Intent | Required | `Popup.trigger_type` |
| Trigger Value | Number input | Required for Delay (seconds) and Scroll Depth (%) | `Popup.trigger_value` |
| Target Pages | Multi-select or JSON input: `["all"]`, `["/", "/shop"]` | Optional (default: all) | `Popup.target_pages_json` |
| Frequency | Select: Once per Session / Once Ever / Every Visit | Default: Once per Session | `Popup.frequency` |
| Start Date | Date-time picker | Optional | `Popup.start_date` |
| End Date | Date-time picker | Optional | `Popup.end_date` |
| Active | Toggle | Default: false | `Popup.is_active` |

### 14.2 Content JSON Structure

```json
{
  "heading": "Welcome to Vastrayug",
  "body": "Discover your cosmic identity.",
  "image_url": "https://...",
  "cta_text": "Explore Collections",
  "cta_link": "/shop",
  "show_email_form": true,
  "email_placeholder": "Enter your cosmic email",
  "submit_text": "Join the Universe"
}
```

The admin form provides a visual editor for this JSON — not raw JSON input.

---

## 15. Announcement Bar Management

> **Phase:** 2

### 15.1 Announcement Bar Form (`/admin/announcements`)

Single page — only one announcement bar can be active at a time.

| Field | Type | Validation | Maps to |
|-------|------|------------|---------|
| Message | Text input | Required | `AnnouncementBar.message` |
| Link URL | Text input | Optional, valid URL | `AnnouncementBar.link_url` |
| Link Text | Text input | Required if link_url is set | `AnnouncementBar.link_text` |
| Background Colour | Colour picker | Default: `#C9A84C` (Nebula Gold) | `AnnouncementBar.bg_colour` |
| Text Colour | Colour picker | Default: `#0A0A0F` (Cosmic Black) | `AnnouncementBar.text_colour` |
| Active | Toggle | Default: false | `AnnouncementBar.is_active` |
| Start Date | Date-time picker | Optional | `AnnouncementBar.start_date` |
| End Date | Date-time picker | Optional | `AnnouncementBar.end_date` |

**Constraint:** Activating a new bar automatically deactivates any currently active bar (enforced at API level).

### 15.2 Preview

Live preview strip rendered above the form showing the announcement bar as it would appear on the storefront.

---

## 16. Settings

### 16.1 Settings Page (`/admin/settings`)

Tabbed interface — each tab maps to a group of `Settings` key-value rows.

#### Tab: Store Information

| Setting | Key | Type |
|---------|-----|------|
| Brand Name | `store_name` | Text input |
| Logo | `store_logo_url` | Image upload |
| Favicon | `store_favicon_url` | Image upload |
| Contact Email | `contact_email` | Email input |
| Contact Phone | `contact_phone` | Phone input |
| Social Links | `social_links` | JSON form — Instagram, Twitter/X, Facebook, YouTube URLs |

#### Tab: Shipping

| Setting | Key | Type |
|---------|-----|------|
| Shipping Zones & Rates | `shipping_config` | JSON form editor — zones, rate per zone, free-shipping threshold |

#### Tab: Tax

| Setting | Key | Type |
|---------|-----|------|
| Tax Rate (%) | `tax_config` | JSON form — rate, inclusive/exclusive toggle |

#### Tab: Payment

| Setting | Key | Type |
|---------|-----|------|
| Razorpay Key ID | `razorpay_key_id` | Text input (masked) |
| Razorpay Mode | `razorpay_mode` | Toggle: Test / Live |

> Note: Actual Razorpay keys are stored as environment variables. This setting controls display mode and which key set to use.

#### Tab: Email

| Setting | Key | Type |
|---------|-----|------|
| SendGrid API Key | `sendgrid_api_key` | Text input (masked) |
| From Email | Set via env | Display only |
| Template IDs | `email_templates` | JSON form — order_confirm, shipping_update, password_reset template IDs |

#### Tab: Tracking & Analytics

| Setting | Key | Type |
|---------|-----|------|
| GTM Container ID | `gtm_container_id` | Text input |
| Meta Pixel ID | `meta_pixel_id` | Text input |

#### Save Behaviour

- Each tab has an independent Save button.
- Values are sanitised at the API layer before write to the `Settings` table.
- Successful save shows a toast notification.

---

## 17. Admin Activity Log

> **Phase:** 4

### 17.1 Activity Log Page (`/admin/activity-log`)

Read-only, immutable audit trail. SUPER_ADMIN access only.

#### Columns

| Column | Source | Filterable |
|--------|--------|:----------:|
| Action | `AdminActivityLog.action` | Select |
| Entity Type | `AdminActivityLog.entity_type` | Select |
| Entity ID | `AdminActivityLog.entity_id` | Search |
| Admin | `AdminActivityLog.user.name` | Select |
| IP Address | `AdminActivityLog.ip_address` | No |
| Timestamp | `AdminActivityLog.created_at` | Date range |

#### Detail Expand

Clicking a row expands to show `payload_json` — the before/after diff or relevant context.

### 17.2 Logged Actions

| Action Constant | Trigger |
|----------------|---------|
| `PRODUCT_CREATED` | New product saved |
| `PRODUCT_UPDATED` | Product edited |
| `PRODUCT_DELETED` | Product archived/deleted |
| `ORDER_STATUS_UPDATED` | Order status changed |
| `ORDER_TRACKING_UPDATED` | Tracking info added/changed |
| `ORDER_EXCHANGE_CREATED` | Exchange order created |
| `USER_STATUS_UPDATED` | User activated/deactivated/banned |
| `USER_ROLE_UPDATED` | User role changed |
| `COUPON_CREATED` | Coupon created |
| `COUPON_UPDATED` | Coupon edited |
| `COUPON_DELETED` | Coupon deleted |
| `BLOG_POST_CREATED` | Blog post created |
| `BLOG_POST_UPDATED` | Blog post edited |
| `BLOG_POST_DELETED` | Blog post deleted |
| `PROMOTION_CREATED` | Promotion created |
| `PROMOTION_UPDATED` | Promotion edited |
| `POPUP_CREATED` | Pop-up created |
| `POPUP_UPDATED` | Pop-up edited |
| `ANNOUNCEMENT_UPDATED` | Announcement bar changed |
| `SETTINGS_UPDATED` | Settings modified (key stored in payload) |
| `COLLECTION_CREATED` | Collection created |
| `COLLECTION_UPDATED` | Collection edited |
| `CATEGORY_CREATED` | Category created |
| `CATEGORY_UPDATED` | Category edited |
| `CATEGORY_DELETED` | Category deleted |
| `ADMIN_PASSWORD_CHANGED` | Admin changed their own password |

---

## 18. API Routes

All admin API routes live under `app/api/admin/`. Every route:
1. Validates the session via `getServerSession(authOptions)`.
2. Checks role permissions via `requireRole()`.
3. Validates request body with Zod schemas.
4. Logs mutating actions to `AdminActivityLog`.

### Route Reference

| Method | Route | Purpose | Phase |
|--------|-------|---------|-------|
| `GET` | `/api/admin/dashboard/stats` | Dashboard metrics | 1 |
| `GET` | `/api/admin/products` | List products (paginated, filtered) | 1 |
| `POST` | `/api/admin/products` | Create product | 1 |
| `GET` | `/api/admin/products/[id]` | Get single product | 1 |
| `PUT` | `/api/admin/products/[id]` | Update product | 1 |
| `DELETE` | `/api/admin/products/[id]` | Delete/archive product | 1 |
| `POST` | `/api/admin/products/bulk` | Bulk update products | 1 |
| `GET` | `/api/admin/categories` | List categories + subs | 1 |
| `POST` | `/api/admin/categories` | Create category | 1 |
| `PUT` | `/api/admin/categories/[id]` | Update category | 1 |
| `DELETE` | `/api/admin/categories/[id]` | Delete category | 1 |
| `POST` | `/api/admin/categories/[id]/subcategories` | Create sub-category | 1 |
| `PUT` | `/api/admin/subcategories/[id]` | Update sub-category | 1 |
| `DELETE` | `/api/admin/subcategories/[id]` | Delete sub-category | 1 |
| `GET` | `/api/admin/collections` | List collections | 1 |
| `POST` | `/api/admin/collections` | Create collection | 1 |
| `PUT` | `/api/admin/collections/[id]` | Update collection | 1 |
| `DELETE` | `/api/admin/collections/[id]` | Delete collection | 1 |
| `GET` | `/api/admin/orders` | List orders (paginated, filtered) | 1 |
| `GET` | `/api/admin/orders/[id]` | Get order detail | 1 |
| `PATCH` | `/api/admin/orders/[id]/status` | Update order status | 1 |
| `PATCH` | `/api/admin/orders/[id]/tracking` | Update tracking info | 1 |
| `POST` | `/api/admin/orders/[id]/exchange` | Create exchange order | 1 |
| `GET` | `/api/admin/users` | List users (paginated, filtered) | 1 |
| `GET` | `/api/admin/users/[id]` | Get user detail | 1 |
| `PATCH` | `/api/admin/users/[id]/status` | Toggle user status | 1 |
| `PATCH` | `/api/admin/users/[id]/role` | Update user role (SUPER_ADMIN only) | 1 |
| `GET` | `/api/admin/profile` | Get current admin's profile | 1 |
| `PUT` | `/api/admin/profile` | Update current admin's profile (name, phone) | 1 |
| `PATCH` | `/api/admin/profile/password` | Change current admin's password | 1 |
| `POST` | `/api/admin/upload` | Upload file to S3 | 1 |
| `GET` | `/api/admin/blog/posts` | List blog posts | 2 |
| `POST` | `/api/admin/blog/posts` | Create blog post | 2 |
| `GET` | `/api/admin/blog/posts/[id]` | Get blog post | 2 |
| `PUT` | `/api/admin/blog/posts/[id]` | Update blog post | 2 |
| `DELETE` | `/api/admin/blog/posts/[id]` | Delete blog post | 2 |
| `GET` | `/api/admin/blog/categories` | List blog categories | 2 |
| `POST` | `/api/admin/blog/categories` | Create blog category | 2 |
| `PUT` | `/api/admin/blog/categories/[id]` | Update blog category | 2 |
| `DELETE` | `/api/admin/blog/categories/[id]` | Delete blog category | 2 |
| `GET` | `/api/admin/blog/tags` | List blog tags | 2 |
| `POST` | `/api/admin/blog/tags` | Create blog tag | 2 |
| `DELETE` | `/api/admin/blog/tags/[id]` | Delete blog tag | 2 |
| `GET` | `/api/admin/coupons` | List coupons | 2 |
| `POST` | `/api/admin/coupons` | Create coupon | 2 |
| `GET` | `/api/admin/coupons/[id]` | Get coupon + usage | 2 |
| `PUT` | `/api/admin/coupons/[id]` | Update coupon | 2 |
| `DELETE` | `/api/admin/coupons/[id]` | Delete coupon | 2 |
| `GET` | `/api/admin/promotions` | List promotions | 2 |
| `POST` | `/api/admin/promotions` | Create promotion | 2 |
| `PUT` | `/api/admin/promotions/[id]` | Update promotion | 2 |
| `DELETE` | `/api/admin/promotions/[id]` | Delete promotion | 2 |
| `GET` | `/api/admin/popups` | List pop-ups | 2 |
| `POST` | `/api/admin/popups` | Create pop-up | 2 |
| `PUT` | `/api/admin/popups/[id]` | Update pop-up | 2 |
| `DELETE` | `/api/admin/popups/[id]` | Delete pop-up | 2 |
| `GET` | `/api/admin/announcements` | List announcements | 2 |
| `POST` | `/api/admin/announcements` | Create announcement | 2 |
| `PUT` | `/api/admin/announcements/[id]` | Update announcement | 2 |
| `DELETE` | `/api/admin/announcements/[id]` | Delete announcement | 2 |
| `GET` | `/api/admin/settings` | Get all settings | 1 |
| `PUT` | `/api/admin/settings` | Update settings (batch) | 1 |
| `GET` | `/api/admin/activity-log` | List activity log | 4 |

### Standard API Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, code?: string }

// Paginated
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    perPage: number,
    total: number,
    totalPages: number,
  }
}
```

---

## 19. Shared UI Components

### 19.1 Admin Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AdminLayout` | `components/admin/AdminLayout.tsx` | Sidebar + topbar + main content wrapper |
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Navigation — collapsible, role-filtered links |
| `AdminTopbar` | `components/admin/AdminTopbar.tsx` | User menu (profile, change password, logout), default password warning banner, breadcrumb |
| `AdminBreadcrumb` | `components/admin/AdminBreadcrumb.tsx` | Dynamic breadcrumb from route segments |

### 19.2 Reusable Form Components

| Component | Purpose |
|-----------|---------|
| `DataTable` | Sortable, filterable, paginated table with row selection |
| `FormField` | Label + input + error message wrapper |
| `ImageUploader` | Dropzone with preview, reorder, alt text |
| `RichTextEditor` | Tiptap wrapper with toolbar |
| `SlugField` | Auto-generated slug input with manual override |
| `StatusBadge` | Colour-coded badge for order/product/user status |
| `ConfirmDialog` | Radix Dialog for delete/destructive action confirmation |
| `DateRangePicker` | Date range filter for tables |
| `MultiSelect` | Multi-select with search for tags, collections, products |
| `ColourPicker` | Hex colour input with visual preview |
| `MetricCard` | Dashboard stat card with trend indicator |
| `EmptyState` | Placeholder for empty lists with CTA |

### 19.3 Design Tokens (Admin)

The admin panel uses the same Tailwind brand tokens as the storefront:

| Element | Style |
|---------|-------|
| Background | `bg-cosmic-black` (`#0A0A0F`) |
| Card / Panel | `bg-deep-indigo` (`#1B1640`) or `bg-void-black` (`#050507`) |
| Primary text | `text-stardust-white` (`#F4F1EC`) |
| Secondary text | `text-eclipse-silver` (`#A8A9AD`) |
| Accent / CTA | `text-nebula-gold` / `bg-nebula-gold` (`#C9A84C`) |
| Borders | `border-deep-indigo` or `border-nebula-gold/20` |
| Status: Success | `text-green-400` / `bg-green-400/10` |
| Status: Warning | `text-yellow-400` / `bg-yellow-400/10` |
| Status: Error | `text-red-400` / `bg-red-400/10` |
| Status: Info | `text-celestial-blue` / `bg-celestial-blue/10` |

---

## 20. Phase Rollout

### Phase 1 — MVP (Month 1)

Build and ship:
- [x] Admin layout (sidebar, topbar with user menu + default password warning, breadcrumb, auth gate)
- [x] Dashboard (basic metrics — orders, revenue, pending count, low stock)
- [x] Product CRUD (full form with images, variants, categories, cosmic metadata, SEO)
- [x] Category + Sub-Category CRUD
- [x] Collection CRUD
- [x] Order management (list, detail, status update, tracking entry)
- [x] User management (list, detail, status toggle, role promotion — SUPER_ADMIN only)
- [x] Admin profile page (view/edit own profile + change password)
- [x] Settings (store info, shipping, tax, payment, tracking IDs)
- [x] File upload API (S3)
- [x] Seed script (categories, collections, settings defaults, super admin: `vastrayug.in@gmail.com` / `admin`)

### Phase 2 — Content & Engagement

Build and ship:
- [ ] Blog management (posts, categories, tags)
- [ ] Coupon management (CRUD + usage report)
- [ ] Promotion management
- [ ] Pop-up management
- [ ] Announcement bar management
- [ ] Newsletter subscriber list view

### Phase 4 — Enhancements

Build and ship:
- [ ] Dashboard analytics charts (recharts — revenue, top products, order trends)
- [ ] Full RBAC enforcement (role-filtered sidebar, API-level checks for all roles)
- [ ] Admin activity log (read-only audit trail)
- [ ] Review moderation panel (approve/reject user reviews)

---

*This specification is the implementation reference for all admin panel features. All routes, forms, and API endpoints must be built from the definitions here, with data models from `_schema.md` and tech choices from `tech_stack.md`.*
