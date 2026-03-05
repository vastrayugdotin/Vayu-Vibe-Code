# Product Requirements Document (PRD)

## Cosmic Thread — Astrology-Themed E-Commerce Platform

---

### 1. Overview

**Product Name:** Cosmic Thread (working title — subject to change)
**Document Version:** 1.0
**Date:** 2026-03-05
**Status:** Draft

**Summary:**
An e-commerce platform for a premium unisex clothing brand built around the theme of cosmos, astrology, planets, and numerology. The platform will offer a curated shopping experience with a visually immersive, lightweight design — highlighted by an interactive revolving solar system on the landing page. It includes a full-featured storefront, a blog engine for SEO and engagement, analytics integration, and a comprehensive admin panel for end-to-end business management.

---

### 2. Goals & Objectives

| # | Objective |
|---|-----------|
| 1 | Launch a premium e-commerce storefront that reflects the cosmic/astrology brand identity. |
| 2 | Provide a smooth, fast, and lightweight shopping experience across all devices. |
| 3 | Drive organic traffic through an integrated blog focused on astrology, numerology, and lifestyle content. |
| 4 | Equip the business owner with a powerful admin panel to manage every aspect of the store without developer intervention. |
| 5 | Prepare the platform for analytics and ad-tracking integrations (GTM, Meta Pixel) from day one. |

---

### 3. Target Audience

| Attribute | Detail |
|-----------|--------|
| **Age Group** | 18–35 years |
| **Gender** | Unisex |
| **Interests** | Astrology, zodiac signs, numerology, cosmic aesthetics, spirituality, premium streetwear/fashion |
| **Spending Profile** | Willing to pay a premium for unique, theme-driven, high-quality clothing |
| **Psychographic** | Believes in or is curious about astrology, zodiac, planetary influence, and the power of numbers; values self-expression through clothing |

---

### 4. Brand & Design Direction

#### 4.1 Theme
- Deep space, cosmos, constellations, zodiac signs, planets, celestial bodies, numerology symbols.
- Color palette: deep navy/black backgrounds, gold/bronze accents, soft purple/violet highlights, white text. Occasional cosmic gradients.
- Typography: clean, modern sans-serif for body; elegant serif or stylized font for headings and brand marks.

#### 4.2 Design Principles
- **Lightweight** — Fast load times; optimized images, lazy loading, minimal JS bundle.
- **Smooth** — Fluid animations and transitions; no janky scrolling.
- **Immersive but not overwhelming** — Cosmic visuals enhance the experience without distracting from products.
- **Mobile-first** — Responsive across all breakpoints; touch-friendly interactions.

#### 4.3 Landing Page — Solar System Banner
- The hero section of the landing page features an **animated, revolving solar system**.
- Planets orbit around a central sun with smooth CSS/WebGL animation.
- Overlay text: brand tagline and a short, relatable message tying fashion to the cosmos (e.g., *"Wear your universe."*, *"Aligned by the stars. Designed for you."*).
- The animation must be performant — 60 fps on mid-range devices; graceful degradation on low-end devices.
- CTA button below or within the banner directing users to shop or explore collections.

---

### 5. Information Architecture

```
Home
├── Shop
│   ├── All Products
│   ├── Category Page (e.g., T-Shirts, Hoodies, Jackets, Accessories)
│   │   └── Sub-Category Page (e.g., Zodiac Collection, Planet Series, Numerology Edition)
│   └── Product Detail Page
├── Collections (curated themed groups)
├── Blog
│   ├── Blog Listing
│   └── Blog Post Detail
├── About Us
├── Contact
├── FAQ / Help
├── Cart
├── Checkout
├── Order Tracking
├── User Account
│   ├── Profile
│   ├── Order History
│   └── Wishlist
|   ├── Adress manage and update
|   ├── Password change
├── Admin
│   ├── Dashboard
│   ├── Products
│   ├── Orders
│   ├── Users
│   └── Settings
└── Footer (links, socials, newsletter signup)
```

---

### 6. Feature Requirements

#### 6.1 Storefront (Customer-Facing)

##### 6.1.1 Product Browsing
- **Category & Sub-Category Navigation:** Hierarchical browsing with clear category > sub-category structure.
- **Product Listing Page:** Grid/list view with filters (category, sub-category, size, color, price range, zodiac sign, sort options).
- **Product Detail Page:** Multiple images with zoom, product description, size chart, price, stock status, "Add to Cart" button, related/recommended products, reviews section.
- **Search:** Full-text search with autocomplete and suggestions.
- **Wishlist:** Logged-in users can save products to a wishlist.

##### 6.1.2 Shopping Cart
- Add/remove/update quantity of items.
- Show line-item totals and grand total.
- Apply coupon codes with real-time validation and discount preview.
- Persistent cart (survives session for logged-in users; local storage for guests).

##### 6.1.3 Checkout
- Guest checkout and registered-user checkout.
- Multi-step or single-page checkout (address → shipping → payment → review → confirm).
- Address form with validation.
- Shipping method selection (standard, express, etc.).
- Coupon code application.
- Order summary before final confirmation.

##### 6.1.4 Payment
- Integration with a payment gateway (e.g., Razorpay / Stripe / PayPal — to be decided).
- Support for credit/debit cards, UPI, net banking, and wallet-based payments (based on chosen gateway).
- Secure payment flow (PCI-compliant via gateway's hosted/tokenized checkout).
- Order confirmation page and email upon successful payment.

##### 6.1.5 Order Tracking
- Users can track order status from their account dashboard.
- Status stages: Order Placed → Processing → Shipped → Out for Delivery → Delivered.
- Integration with shipping provider APIs for real-time tracking (future phase if needed).
- Email/SMS notifications at each status change.

##### 6.1.6 User Accounts
- Registration (email + password, optional social login).
- Login / Logout / Forgot Password.
- Profile management (name, email, phone, saved addresses).
- Order history with reorder capability.
- Wishlist management.

##### 6.1.7 Blog
- Blog listing page with pagination, category/tag filters.
- Individual blog post page with rich content (text, images, embedded media).
- SEO-optimized: meta title, meta description, Open Graph tags, structured data (Article schema).
- Content themes: astrology insights, numerology guides, planet influences, brand stories, styling tips.
- Social sharing buttons.
- Related posts section.

##### 6.1.8 Pop-ups & Promotions (Frontend)
- Support for timed or trigger-based pop-ups (e.g., exit-intent, scroll-depth, time-on-page).
- Use cases: newsletter signup, first-purchase discount, seasonal sale announcement.
- Pop-up content and rules managed from the admin panel.

##### 6.1.9 Newsletter
- Email subscription form in footer and optionally in pop-ups.
- Integration with an email service (e.g., Mailchimp, SendGrid — to be decided).

---

#### 6.2 Admin Panel

The admin panel is the operational backbone of the platform. It must be intuitive, fast, and give the business owner full control.

##### 6.2.1 Dashboard
- Overview metrics: total orders, revenue, active users, top-selling products, recent orders.
- Quick-action shortcuts to common tasks.

##### 6.2.2 Product Management
- **Add New Product:** Title, description (rich text editor), images (multi-upload with drag-and-drop reordering), price, compare-at price, SKU, stock quantity, sizes, colors/variants, category, sub-category, tags, SEO fields (meta title, meta description, URL slug), visibility toggle (draft/published).
- **Edit Product:** All fields editable. Version history or last-modified timestamp.
- **Delete / Archive Product.**
- **Bulk Actions:** Bulk update stock, price, visibility.

##### 6.2.3 Category & Sub-Category Management
- Create, edit, delete categories.
- Create, edit, delete sub-categories linked to parent categories.
- Set display order / sort priority.
- Assign images and descriptions to categories.
- SEO fields per category (meta title, meta description, URL slug).

##### 6.2.4 Order Management
- View all orders with filters (status, date range, customer, payment status).
- Order detail view: items, quantities, prices, customer info, shipping address, payment details, status history.
- Update order status (Processing → Shipped → Delivered → Cancelled/Refunded).
- Add tracking number and shipping provider.
- Print invoice / packing slip.
- Refund processing.

##### 6.2.5 User Management
- View all registered users with search and filters.
- View individual user profile: contact info, order history, account status.
- Activate / deactivate / ban users.
- Admin roles: Super Admin, Content Manager (blog only), Order Manager — role-based access control (RBAC).

##### 6.2.6 Blog Management
- **Create Post:** Title, body (rich text editor with image upload, embeds, formatting), featured image, category, tags, author, SEO fields, publish date (schedule for future), status (draft/published).
- **Edit / Delete Posts.**
- **Manage Blog Categories & Tags.**

##### 6.2.7 Coupon Code Management
- **Create Coupon:** Code (auto-generate or manual), discount type (percentage / flat amount), discount value, minimum order value, maximum discount cap, usage limit (total uses, per-user limit), valid date range (start/end), applicable to specific products/categories or site-wide, first-order-only toggle, combinability rules (stackable or exclusive).
- **Edit / Deactivate / Delete Coupons.**
- **Coupon Usage Report:** How many times used, total discount given, by which users.

##### 6.2.8 Promotions Management
- Create site-wide or category-specific promotions (e.g., "20% off all Zodiac Collection").
- Set promotion rules: discount type, applicable products/categories, date range, auto-apply or code-required.
- Banner/announcement bar management (top-of-site promotional strip).

##### 6.2.9 Pop-up Management
- Create / edit / delete pop-ups.
- Configure trigger rules: page, timing (delay in seconds), scroll percentage, exit intent.
- Set display frequency per user (once per session, once ever, every visit).
- Set active date range.
- Rich content editor for pop-up body (text, image, CTA button, form fields).
- Enable / disable toggle.

##### 6.2.10 Settings
- Store information (name, logo, contact details, social links).
- Shipping configuration (zones, rates, free-shipping thresholds).
- Tax configuration.
- Payment gateway settings.
- Email notification templates.

---

#### 6.3 SEO & Analytics

##### 6.3.1 On-Page SEO
- Every public page supports custom meta title, meta description, and canonical URL.
- Clean, semantic URL slugs for products, categories, and blog posts.
- Structured data markup (JSON-LD): Product, BreadcrumbList, Article, Organization.
- Automatically generated sitemap.xml and robots.txt.
- Image alt-text support on all uploaded images.

##### 6.3.2 Google Tag Manager (GTM)
- GTM container script injected in `<head>` and `<body>` as per Google's specification.
- DataLayer events pushed for key actions:
  - `page_view`
  - `view_item` (product detail page)
  - `view_item_list` (category/listing pages)
  - `add_to_cart`
  - `remove_from_cart`
  - `begin_checkout`
  - `add_shipping_info`
  - `add_payment_info`
  - `purchase` (order confirmation — includes transaction ID, revenue, items)
  - `sign_up`
  - `login`
  - `search`
- All events follow the **Google Analytics 4 (GA4) recommended e-commerce event schema**.
- GTM container ID configurable from admin settings.

##### 6.3.3 Meta Pixel / Conversions API
- Meta Pixel base code injected via GTM or directly (configurable).
- Standard Meta events fired:
  - `PageView`
  - `ViewContent`
  - `AddToCart`
  - `InitiateCheckout`
  - `AddPaymentInfo`
  - `Purchase`
  - `Lead` (newsletter signup)
  - `Search`
- Event parameters include `content_ids`, `content_type`, `value`, `currency` as per Meta's specs.
- Meta Pixel ID configurable from admin settings.
- Server-side Conversions API integration (future phase) — ensure user data (email, phone) is hashed and available for event deduplication.

##### 6.3.4 Tag-Friendly Markup
- All interactive elements (buttons, links, forms) should have meaningful `id`, `class`, or `data-*` attributes to facilitate GTM trigger configuration without code changes.
- Consistent naming conventions for CSS classes and data attributes across the site.

---

### 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Page Load Time** | < 2 seconds on 4G (Lighthouse Performance score > 90) |
| **Mobile Responsiveness** | Fully responsive; optimized for 360px–1440px+ viewports |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Accessibility** | WCAG 2.1 AA compliance (keyboard navigation, screen reader support, contrast ratios) |
| **Security** | HTTPS everywhere, CSRF protection, input sanitization, secure authentication (bcrypt/argon2 password hashing), rate limiting on auth endpoints |
| **Uptime** | 99.9% target (dependent on hosting provider) |
| **Scalability** | Architecture should handle 10,000+ products and 1,000+ concurrent users without degradation |
| **Image Optimization** | WebP/AVIF format with fallback; responsive images via `srcset`; CDN delivery |

---

### 8. Tech Stack (Recommended)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js (React) | SSR/SSG for SEO, fast page loads, React ecosystem |
| **Styling** | Tailwind CSS | Utility-first, lightweight, rapid UI development |
| **Animations** | Three.js or CSS animations | Solar system banner; Three.js for 3D, CSS for simpler alternatives |
| **Backend / API** | Next.js API Routes or Node.js (Express) | Unified stack, server-side logic |
| **Database** | PostgreSQL | Relational data (products, orders, users); robust and scalable |
| **ORM** | Prisma | Type-safe database access, migrations |
| **Authentication** | NextAuth.js or custom JWT | Flexible auth with session management |
| **File Storage** | AWS S3 / Cloudflare R2 | Product images, blog media |
| **Payment Gateway** | Razorpay / Stripe | Reliable, well-documented APIs |
| **Email** | SendGrid / AWS SES | Transactional emails (order confirmation, password reset) |
| **Hosting** | Vercel / AWS | Optimized for Next.js; scalable |
| **CDN** | Cloudflare / Vercel Edge | Fast asset delivery globally |
| **Admin Panel** | Custom-built (React) | Full control over UX and features; no third-party CMS limitations |

> Final tech stack decisions are open to discussion and may change based on team expertise and project constraints.

---

### 9. Data Models (High-Level)

```
User
├── id, email, password_hash, name, phone, role, status, created_at

Product
├── id, title, slug, description, price, compare_at_price, sku, stock,
│   sizes[], colors[], images[], category_id, sub_category_id, tags[],
│   meta_title, meta_description, status (draft/published), created_at

Category
├── id, name, slug, description, image, sort_order, meta_title, meta_description

SubCategory
├── id, name, slug, description, image, sort_order, category_id,
│   meta_title, meta_description

Order
├── id, user_id, items[], subtotal, discount, shipping, tax, total,
│   status, shipping_address, tracking_number, payment_id, created_at

OrderItem
├── id, order_id, product_id, variant, quantity, unit_price

Coupon
├── id, code, discount_type, discount_value, min_order_value, max_discount,
│   usage_limit, per_user_limit, valid_from, valid_until, applicable_to,
│   first_order_only, is_active, times_used

BlogPost
├── id, title, slug, body, featured_image, category, tags[], author_id,
│   meta_title, meta_description, status, published_at, created_at

Popup
├── id, title, content, trigger_type, trigger_value, frequency,
│   start_date, end_date, is_active

Promotion
├── id, name, discount_type, discount_value, applicable_to,
│   start_date, end_date, is_active

Address
├── id, user_id, line1, line2, city, state, postal_code, country, is_default

Cart
├── id, user_id, items[], coupon_id, created_at, updated_at
```

---

### 10. User Flows

#### 10.1 Purchase Flow
```
Landing Page → Browse/Search → Product Detail → Add to Cart → View Cart
→ Apply Coupon (optional) → Checkout (address, shipping, payment)
→ Payment Gateway → Order Confirmation → Email Receipt
→ Track Order (from account)
```

#### 10.2 Blog Engagement Flow
```
Organic Search / Social Link → Blog Post → Read Content
→ Related Posts / CTA to Shop → Browse Products → Purchase
```

#### 10.3 Admin — Add Product Flow
```
Admin Login → Dashboard → Products → Add New → Fill Details
→ Upload Images → Assign Category/Sub-Category → Set Price & Stock
→ Fill SEO Fields → Save as Draft / Publish
```

#### 10.4 Admin — Create Coupon Flow
```
Admin Login → Coupons → Create New → Set Code, Type, Value
→ Set Rules (min order, max discount, usage limits, date range, applicability)
→ Save & Activate
```

---

### 11. Phases / Milestones

| Phase | Scope | Priority |
|-------|-------|----------|
| **Phase 1 — MVP** | Storefront (product browsing, cart, checkout, payment), user accounts, admin (product + category + order management), landing page with solar system banner, GTM/Meta Pixel base setup | High |
| **Phase 2 — Content & Engagement** | Blog engine (frontend + admin), newsletter integration, pop-up system, coupon management, promotions | High |
| **Phase 3 — Optimization & Analytics** | Full GA4 e-commerce event tracking, Meta Conversions API (server-side), performance optimization, SEO audit and fixes | Medium |
| **Phase 4 — Enhancements** | Advanced filters, product reviews, wishlist, social login, order notifications (SMS), admin dashboard analytics, admin RBAC roles | Medium |
| **Phase 5 — Scale & Iterate** | Shipping provider API integration, multi-currency support, internationalization, A/B testing infrastructure, personalization | Low |

---

### 12. Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance Score | > 90 |
| Time to First Contentful Paint | < 1.2s |
| Cart Abandonment Rate | < 65% |
| Blog Organic Traffic Growth | 20% month-over-month (after 3 months) |
| Admin Task Completion Time | Common tasks (add product, update order) < 2 minutes |
| Uptime | > 99.9% |

---

### 13. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Final brand name and domain? | Pending |
| 2 | Payment gateway preference (Razorpay vs Stripe vs other)? | Pending |
| 3 | Shipping providers to integrate? | Pending |
| 4 | Email marketing platform (Mailchimp, SendGrid, other)? | Pending |
| 5 | Hosting preference (Vercel, AWS, other)? | Pending |
| 6 | Number of initial product categories and sub-categories? | Pending |
| 7 | Social login providers to support (Google, Facebook, other)? | Pending |
| 8 | Multi-language or single-language (English only)? | Pending |
| 9 | Return/refund policy details for order management flow? | Pending |
| 10 | Budget and timeline constraints? | Pending |

---

### 14. Appendix

#### A. Glossary
- **GTM:** Google Tag Manager — a tag management system for deploying tracking scripts.
- **Meta Pixel:** Facebook/Meta's tracking snippet for conversion tracking and audience building.
- **DataLayer:** A JavaScript object used by GTM to receive and process event data.
- **RBAC:** Role-Based Access Control — restricting admin panel features based on user role.
- **SSR/SSG:** Server-Side Rendering / Static Site Generation — Next.js rendering strategies for fast, SEO-friendly pages.

#### B. References
- [GA4 E-Commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Meta Pixel Standard Events](https://developers.facebook.com/docs/meta-pixel/reference)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
