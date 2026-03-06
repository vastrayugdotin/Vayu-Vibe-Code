# Product Requirements Document (PRD)

## Vastrayug — E-Commerce Platform

> *"Wear Your Cosmic Identity."*

---

**Document Version:** 4.0
**Date:** 2026-03-06
**Status:** Final
**Classification:** Internal

---

### Table of Contents

1. [Overview](#1-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [Target Audience](#3-target-audience)
4. [Brand & Design Direction](#4-brand--design-direction)
5. [Information Architecture](#5-information-architecture)
6. [Feature Requirements — Storefront](#6-feature-requirements--storefront)
7. [Feature Requirements — Blog Engine](#7-feature-requirements--blog-engine)
8. [Feature Requirements — Admin Panel](#8-feature-requirements--admin-panel)
9. [SEO & Analytics](#9-seo--analytics)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Tech Stack](#11-tech-stack)
12. [Data Models](#12-data-models)
13. [User Flows](#13-user-flows)
14. [Phases & Milestones](#14-phases--milestones)
15. [Success Metrics](#15-success-metrics)
16. [Open Questions](#16-open-questions)
17. [Appendix](#17-appendix)

---

### 1. Overview

**Brand Name:** Vastrayug
**Tagline:** *"Wear Your Cosmic Identity."*
**Industry:** Premium E-commerce Fashion
**Category:** Unisex Apparel
**Core Theme:** Cosmos · Astrology · Planets · Zodiac Energy · Spiritual Identity

**Summary:**
Vastrayug is a premium lifestyle clothing brand that blends cosmic symbolism, astrology, planetary energies, numerology, and fashion into a single unified identity. This document defines the requirements for its e-commerce platform — a storefront that must reflect the brand's spiritual depth and premium positioning at every touchpoint.

The platform will deliver:
- A visually immersive, lightweight storefront with an animated revolving solar system as the landing page hero
- Full e-commerce capabilities: product browsing, cart, checkout, payment, and order tracking
- A blog engine for SEO and content around astrology, numerology, and the power of cosmic alignment
- Integration-ready architecture for Google Tag Manager and Meta Pixel/Conversions API
- A comprehensive admin panel for managing every aspect of the business without developer intervention

The name Vastrayug — from Sanskrit *Vastra* (cloth) + *Yug* (era) — means **The Era of Cosmic Dressing**. The platform must embody this: it is not a generic store, it is a spiritual and premium shopping experience.

---

### 2. Goals & Objectives

| # | Objective |
|---|-----------|
| 1 | Launch a premium e-commerce storefront that unmistakably reflects Vastrayug's cosmic/astrology brand identity and premium positioning. |
| 2 | Deliver a smooth, fast, and lightweight shopping experience across all devices — Cosmic Black canvas, gold accents, immersive but never overwhelming. |
| 3 | Drive organic traffic through an integrated blog focused on astrology, numerology, planetary influence, and the power of numbers in daily life. |
| 4 | Equip the business owner with a powerful admin panel to manage products, orders, users, blog, coupons, promotions, pop-ups, categories, and sub-categories — all without developer intervention. |
| 5 | Architect the platform for analytics and ad-tracking integrations (GTM, Meta Pixel) from day one, with proper data-layer events and tag-friendly markup. |
| 6 | Organise products around Vastrayug's core frameworks: Navagraha (planetary), Zodiac, Numerology, and Vibe & Energy collections. |

---

### 3. Target Audience

#### Primary Audience: The Cosmic Seeker (Age 18–35)

| Attribute | Detail |
|-----------|--------|
| **Age Group** | 18–35 years |
| **Gender** | Unisex — the cosmos does not discriminate |
| **Interests** | Astrology, zodiac signs, numerology, cosmic aesthetics, Vedic spirituality, premium fashion |
| **Spending Profile** | Willing to invest in premium products that carry spiritual meaning and exceptional quality |
| **Psychographic** | Believes their ruling planet, zodiac sign, and life path number are identity — not superstition; values self-expression and intentional living |

#### Psychographic Personas

| Persona | Who They Are | What They Need |
|:---|:---|:---|
| **The Awakened** | Deeply spiritual, follows Vedic or Western astrology, lives consciously | Clothes that carry genuine planetary energy — not aesthetic borrowing |
| **The Aesthetic Seeker** | Obsessed with celestial aesthetics, mood boards, dark academia vibes | Cosmic clothing that looks extraordinary and photographs beautifully |
| **The Rebuilder** | Going through heartbreak, failure, or identity crisis — seeking a new beginning | A symbol of transformation — armour for the next chapter |
| **The Luxury Minimalist** | Buys few things but only the best; every piece must carry meaning | Craftsmanship, story, and spiritual intention behind premium basics |
| **The Gifter** | Buys for partners, friends, and family based on zodiac or planet | The most thoughtful premium gift — personalised to the recipient's cosmic identity |

#### Secondary Audience
- Astrology content creators, spiritual coaches, and tarot readers
- Premium gift buyers for weddings, birthdays, and Indian festivals (zodiac-personalised pieces)
- Individuals in healing modalities (yoga, meditation, breathwork)

---

### 4. Brand & Design Direction

#### 4.1 Brand Personality

Vastrayug embodies three archetypes:
- **The Sage** — Wise, grounded in ancient cosmic wisdom. Teaches without lecturing.
- **The Lover** — Empathetic, emotionally intelligent, connected to people's journeys.
- **The Ruler** — Commanding, premium, aspirational, unapologetically elevated.

#### 4.2 Tone of Voice (Applied to All Platform Copy)

| Quality | Application |
|:---|:---|
| **Mystical but accessible** | Cosmic language that invites, never alienates |
| **Empowering** | Speak to users as if they are already powerful |
| **Warm & intimate** | Like a trusted friend who also reads your chart |
| **Premium** | Never desperate, never transactional, never cheap |
| **Hopeful** | Always forward-facing — the stars are in your favour |
| **Rooted** | Connected to Indian cosmic tradition, never superficial |

**Copy rules:**
- No "Huge sale!", "Buy 2 get 1 free!", "Shop now before stock runs out!" — these destroy premium positioning.
- Instead: *"Saturn returns, and so do you — stronger, wiser, dressed in your truth."*

#### 4.3 Colour Palette

##### Primary Brand Palette

| Colour Name | Role | Hex Code |
|:---|:---|:---|
| **Cosmic Black** | Primary background, dominant base | `#0A0A0F` |
| **Nebula Gold** | Premium accent, logo colour | `#C9A84C` |
| **Stardust White** | Clean contrast, text, negative space | `#F4F1EC` |
| **Deep Indigo** | Secondary brand colour, depth | `#1B1640` |

##### Extended Palette

| Colour Name | Role | Hex Code |
|:---|:---|:---|
| **Eclipse Silver** | Luxury accent, Moon-aligned elements | `#A8A9AD` |
| **Astral Purple** | Rahu collections, transformation theme | `#4B0082` |
| **Celestial Blue** | Mercury and cosmic general use | `#003087` |
| **Void Black** | Maximum depth backgrounds | `#050507` |

##### Colour Usage Rules
- Cosmic Black `#0A0A0F` is the dominant canvas — website background, packaging, social media.
- Nebula Gold `#C9A84C` is the accent — never the base. Used for logo, highlights, CTAs, dividers.
- Stardust White `#F4F1EC` for body text, contrast, and negative space.
- Deep Indigo `#1B1640` for secondary sections, cards, and hover states.
- Each Navagraha planetary collection page uses the **primary palette (Cosmic Black + Nebula Gold) as the anchor**, with a subtle planet-specific accent colour layered on top (per the Navagraha colour reference in Appendix A). This preserves brand cohesion while giving each planet a distinct, recognisable visual identity.

#### 4.4 Typography
- **Headings:** Elegant serif or stylised font — conveys premium, timeless identity.
- **Body:** Clean, modern sans-serif — legibility and lightness.
- **Accent text (taglines, quotes):** Italic serif — mystical, intimate feel.

#### 4.5 Design Principles
- **Lightweight** — Fast load times; optimised images, lazy loading, minimal JS bundle.
- **Smooth** — Fluid animations and transitions; no janky scrolling.
- **Immersive but not overwhelming** — Cosmic visuals enhance the experience without distracting from products.
- **Mobile-first** — Responsive across all breakpoints; touch-friendly.
- **Premium at every pixel** — No element should feel generic. Every button, card, and interaction must feel like Vastrayug.

#### 4.6 Landing Page — Solar System Banner

The hero section of the landing page features an **animated, revolving solar system**:
- Planets orbit around a central sun with smooth CSS/WebGL animation.
- The nine Navagraha planets are represented, connecting directly to Vastrayug's core planetary framework.
- Overlay text: brand tagline and a short, relatable cosmic message. Examples:
  - *"Wear Your Cosmic Identity."*
  - *"Fashion Written in the Stars."*
  - *"Your ruling planet chose you. Now wear it."*
- Animation must be performant — 60 fps on mid-range devices; graceful degradation on low-end devices (static fallback image).
- **Implementation:** Pure CSS animations — chosen for lightweight performance, fast load times, and zero JS dependency overhead.
- CTA button directing users to explore collections or shop.
- The banner sets the tone for the entire site: cosmic, premium, alive.

---

### 5. Information Architecture

```
Home (Solar System Banner + Featured Collections + Brand Story)
├── Shop
│   ├── All Products
│   ├── By Category (e.g., Oversized Tees, Hoodies, Co-ord Sets, Jackets, Accessories)
│   │   └── Sub-Category (e.g., Zodiac Collection, Planet Series, Numerology Edition)
│   ├── By Collection
│   │   ├── Planetary Collections (Navagraha — 9 planets)
│   │   ├── Zodiac Collections (12 signs)
│   │   ├── Numerology Collections (Life Path Numbers)
│   │   ├── Vibe & Energy Collections (Sovereign, Healer, Wanderer, Shadow, Reborn)
│   │   └── Ritual Essentials (premium cosmic basics)
│   └── Product Detail Page
├── Blog
│   ├── Blog Listing (with category/tag filters)
│   └── Blog Post Detail
├── About Us (brand story, philosophy, the meaning of Vastrayug)
├── Contact
├── FAQ / Help
├── Cart
├── Checkout
├── Order Tracking
├── User Account
│   ├── Profile
│   ├── Order History
│   ├── Wishlist
│   ├── Address Management
│   └── Password Change
├── Admin Panel
│   ├── Dashboard
│   ├── Products
│   ├── Categories & Sub-Categories
│   ├── Orders
│   ├── Users
│   ├── Blog
│   ├── Coupons
│   ├── Promotions
│   ├── Pop-ups
│   └── Settings
└── Footer (links, socials, newsletter signup)
```

---

### 6. Feature Requirements — Storefront

#### 6.1 Product Browsing

- **Category & Sub-Category Navigation:** Hierarchical browsing — Category > Sub-Category, plus collection-based navigation (Planetary, Zodiac, Numerology, Vibe, Ritual Essentials).
- **Product Listing Page:** Grid/list view with filters:
  - Category, sub-category, collection
  - Size, colour, price range
  - Zodiac sign, ruling planet, life path number
  - Sort: price, newest, popularity
- **Product Detail Page:**
  - Multiple images with zoom/gallery
  - Product name, description (rich text — including cosmic meaning, planetary alignment, emotional intention)
  - Price, compare-at price (strikethrough)
  - Size chart, size selector
  - Stock status
  - "Add to Cart" button
  - Cosmic metadata: associated planet, zodiac sign, life path number, emotional intention (e.g., "Confidence", "Healing", "Abundance")
  - Related / recommended products
  - Reviews section
- **Search:** Full-text search with autocomplete — searchable by product name, zodiac sign, planet name, life path number, collection name.
- **Wishlist:** Logged-in users can save products.

#### 6.2 Shopping Cart

- Add / remove / update quantity of items.
- Line-item totals and grand total.
- Apply coupon codes with real-time validation and discount preview.
- Persistent cart: survives session for logged-in users; local storage for guests.
- Cart summary visible from any page (mini-cart / slide-out drawer).

#### 6.3 Checkout

- Guest checkout and registered-user checkout.
- Multi-step or single-page flow: Address → Shipping → Payment → Review → Confirm.
- Address form with validation.
- Shipping method selection (standard, express).
- Coupon code application (if not already applied in cart).
- Order summary before final confirmation.

#### 6.4 Payment

- Integration with **Razorpay** payment gateway.
- Support for: credit/debit cards, UPI, net banking, wallets.
- Secure payment flow — PCI-compliant via gateway's hosted/tokenised checkout.
- Order confirmation page and email upon successful payment.
- Failed payment handling with retry option.

#### 6.5 Order Tracking

- Users track order status from their account dashboard.
- Status stages: **Order Placed → Processing → Shipped → Out for Delivery → Delivered**.
- Tracking number, shipping provider name, and tracking website link entered manually by admin per order.
- No automated shipping provider API integration at launch — admin updates tracking details through the order management panel.
- Integration with shipping provider APIs for real-time tracking (future phase — Phase 5).
- Email/SMS notifications (via Twilio) at each status change.

#### 6.6 User Accounts

- Registration: email + password; social login via **Google and Facebook** (Phase 4).
- Login / Logout / Forgot Password.
- Profile management: name, email, phone, saved addresses.
- Order history with reorder capability.
- Wishlist management.
- Address add/edit/delete with default address selection.
- Password change.

#### 6.7 Pop-ups & Promotions (Frontend Display)

- Support for timed or trigger-based pop-ups (exit-intent, scroll-depth, time-on-page).
- Use cases: newsletter signup, first-purchase cosmic welcome, seasonal/planetary event announcements.
- Pop-up content, rules, and schedule managed entirely from the admin panel.
- Announcement bar at top of site for active promotions (managed from admin).

#### 6.8 Newsletter

- Email subscription form in footer and optionally in pop-ups.
- Integration with **SendGrid** for email delivery.
- Subscription triggers `Lead` event for Meta Pixel.

---

### 7. Feature Requirements — Blog Engine

The blog serves two purposes: **SEO traffic acquisition** and **deepening the customer's cosmic connection** with the brand. Content themes include astrology insights, numerology guides, planetary influences, the power of numbers, brand stories, and styling tips.

#### 7.1 Blog Listing Page
- Paginated list of published posts.
- Filter by category and tag.
- Featured/sticky post support.
- Thumbnail, title, excerpt, author, date for each post.

#### 7.2 Blog Post Page
- Rich content: text, images, embedded media (YouTube, Instagram).
- Featured image / hero banner.
- Author name and avatar.
- Published date.
- Category and tags displayed.
- Social sharing buttons (WhatsApp, X/Twitter, Facebook, Pinterest, copy link).
- Related posts section at the bottom.
- CTA to relevant product collections (e.g., a post about Jupiter links to the Jupiter/Guru collection).

#### 7.3 Blog SEO
- Custom meta title, meta description, and URL slug per post.
- Open Graph and Twitter Card tags.
- Structured data: `Article` schema (JSON-LD).
- Blog sitemap auto-generated and included in main sitemap.xml.
- Image alt-text support.

---

### 8. Feature Requirements — Admin Panel

The admin panel is the operational backbone. It must be intuitive, fast, and give the business owner full control over every aspect of the store.

#### 8.1 Dashboard
- Overview metrics: total orders, revenue (today / week / month), active users, top-selling products, recent orders.
- Quick-action shortcuts: add product, view pending orders, create coupon.
- Low-stock alerts.

#### 8.2 Product Management
- **Add New Product:**
  - Title, description (rich text editor with formatting, image embed)
  - Images: multi-upload with drag-and-drop reordering
  - Price, compare-at price (for strikethrough display)
  - SKU, stock quantity
  - Sizes (multi-select), colours/variants
  - Category and sub-category assignment
  - Collection assignment (Planetary, Zodiac, Numerology, Vibe, Ritual Essentials)
  - Cosmic metadata: associated planet, zodiac sign, life path number, emotional intention
  - Tags (free-form)
  - SEO fields: meta title, meta description, URL slug
  - Visibility toggle: Draft / Published
- **Edit Product:** All fields editable. Last-modified timestamp displayed.
- **Delete / Archive Product.**
- **Bulk Actions:** Bulk update stock, price, visibility, category.

#### 8.3 Category & Sub-Category Management
- Create, edit, delete categories.
- Create, edit, delete sub-categories linked to parent categories.
- Set display order / sort priority.
- Assign image and description to each category.
- SEO fields per category: meta title, meta description, URL slug.

#### 8.4 Order Management
- View all orders with filters: status, date range, customer name/email, payment status.
- Order detail view: items, quantities, prices, customer info, shipping address, payment details, status history log.
- Update order status: Processing → Shipped → Delivered → Cancelled / Refunded.
- Add tracking number and shipping provider.
- Print invoice / packing slip.
- Refund processing (mark as refunded, notes field).
- **Exchange Policy:** Vastrayug operates an exchange-only policy — no returns. Order management flow supports exchange requests: admin can create a new order linked to the original, mark original as exchanged, and track the replacement shipment.

#### 8.5 User Management
- View all registered users with search and filters (name, email, registration date, order count).
- View individual user profile: contact info, order history, account status.
- Activate / deactivate / ban users.
- Admin roles with Role-Based Access Control (RBAC):
  - **Super Admin** — Full access to everything.
  - **Content Manager** — Blog and pop-up management only.
  - **Order Manager** — Order and user management only.

#### 8.6 Blog Management
- **Create Post:**
  - Title, body (rich text editor with image upload, embeds, headings, lists, blockquotes)
  - Featured image
  - Blog category, tags
  - Author selection
  - SEO fields: meta title, meta description, URL slug
  - Publish date: publish now or schedule for future
  - Status: Draft / Published
- **Edit / Delete Posts.**
- **Manage Blog Categories & Tags:** Create, edit, delete.

#### 8.7 Coupon Code Management
- **Create Coupon:**
  - Code: auto-generate or manual entry
  - Discount type: percentage or flat amount
  - Discount value
  - Minimum order value threshold
  - Maximum discount cap (for percentage discounts)
  - Usage limit: total uses allowed
  - Per-user limit: max uses per individual user
  - Valid date range: start date and end date
  - Applicability: site-wide, specific categories, specific products
  - First-order-only toggle
  - Combinability: stackable with other coupons or exclusive
  - Active / Inactive toggle
- **Edit / Deactivate / Delete Coupons.**
- **Coupon Usage Report:** Times used, total discount given, breakdown by user.

#### 8.8 Promotions Management
- Create site-wide or category/collection-specific promotions (e.g., "Sacred alignment — 15% off the entire Guru collection this Jupiter transit").
- Promotion rules: discount type, discount value, applicable products/categories/collections, date range, auto-apply or code-required.
- Announcement bar management: top-of-site promotional strip with custom text, link, and colour.

#### 8.9 Pop-up Management
- Create / edit / delete pop-ups.
- Configure trigger rules:
  - Target page(s): all pages, specific pages, or page types (product, blog, home)
  - Timing: delay in seconds after page load
  - Scroll depth: percentage scrolled
  - Exit intent: mouse leaves viewport (desktop)
- Display frequency per user: once per session, once ever, every visit.
- Active date range: start and end date.
- Rich content editor for pop-up body: text, image, CTA button, form fields (email capture).
- Enable / disable toggle.

#### 8.10 Settings
- **Store Information:** Brand name, logo, favicon, contact details, social media links.
- **Shipping Configuration:** Shipping zones, rates per zone, free-shipping thresholds.
- **Tax Configuration:** Tax rates, tax-inclusive/exclusive pricing.
- **Payment Gateway Settings:** API keys, test/live mode toggle.
- **Email Notification Templates:** Order confirmation, shipping update, password reset — editable templates.
- **GTM Container ID:** Configurable field.
- **Meta Pixel ID:** Configurable field.

---

### 9. SEO & Analytics

#### 9.1 On-Page SEO
- Every public page supports custom meta title, meta description, and canonical URL.
- Clean, semantic URL slugs for products, categories, collections, and blog posts.
- Structured data markup (JSON-LD):
  - `Product` — on product detail pages
  - `BreadcrumbList` — on all pages
  - `Article` — on blog posts
  - `Organization` — site-wide
  - `ItemList` — on collection/category listing pages
- Auto-generated `sitemap.xml` and `robots.txt`.
- Image alt-text support on all uploaded images.

#### 9.2 Google Tag Manager (GTM)
- GTM container script injected in `<head>` and `<body>` per Google's specification.
- GTM container ID configurable from admin settings (Section 8.10).
- DataLayer events pushed for key actions, following the **GA4 recommended e-commerce event schema**:

| Event | Trigger |
|-------|---------|
| `page_view` | Every page load / route change |
| `view_item` | Product detail page viewed |
| `view_item_list` | Category / collection / listing page viewed |
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

#### 9.3 Meta Pixel / Conversions API
- Meta Pixel base code injected via GTM or directly (configurable).
- Meta Pixel ID configurable from admin settings.
- Standard Meta events fired:

| Meta Event | Trigger |
|------------|---------|
| `PageView` | Every page load |
| `ViewContent` | Product detail page |
| `AddToCart` | Item added to cart |
| `InitiateCheckout` | Checkout started |
| `AddPaymentInfo` | Payment step |
| `Purchase` | Order confirmed |
| `Lead` | Newsletter signup |
| `Search` | Search query |

- Event parameters include `content_ids`, `content_type`, `value`, `currency` per Meta's specs.
- Server-side Conversions API integration (future phase) — ensure user data (email, phone) is hashed and available for event deduplication.

#### 9.4 Tag-Friendly Markup
- All interactive elements (buttons, links, forms) must have meaningful `id`, `class`, or `data-*` attributes to facilitate GTM trigger configuration without code changes.
- Consistent naming convention for CSS classes and data attributes: `data-gtm-action`, `data-gtm-category`, `data-gtm-label`.
- Product cards must include `data-product-id`, `data-product-name`, `data-product-category`, `data-product-price` attributes.

---

### 10. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Page Load Time** | < 2 seconds on 4G (Lighthouse Performance score > 90) |
| **Mobile Responsiveness** | Fully responsive; optimised for 360px–1440px+ viewports |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Accessibility** | WCAG 2.1 AA compliance (keyboard navigation, screen reader support, contrast ratios — note: ensure gold-on-black passes contrast checks) |
| **Security** | HTTPS everywhere, CSRF protection, input sanitisation, secure authentication (bcrypt/argon2 password hashing), rate limiting on auth endpoints, XSS prevention |
| **Uptime** | 99.9% target (dependent on hosting provider) |
| **Scalability** | Handle 10,000+ products and 1,000+ concurrent users without degradation |
| **Image Optimisation** | WebP/AVIF with fallback; responsive images via `srcset`; CDN delivery |
| **Animation Performance** | Solar system banner at 60 fps on mid-range devices; static fallback on low-end |

---

### 11. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js (React) | SSR/SSG for SEO, fast page loads, React ecosystem |
| **Styling** | Tailwind CSS | Utility-first, lightweight, rapid UI development with custom brand tokens |
| **Animations** | Pure CSS animations | Solar system banner — lightweight, performant, no JS dependency; graceful static fallback on low-end devices |
| **Backend / API** | Next.js API Routes | Unified full-stack architecture — no separate server needed; simpler deployment and maintenance |
| **Database** | MySQL | Natively available on Hostinger Node.js hosting; perfect fit for e-commerce relational data at Vastrayug's launch scale |
| **ORM** | Prisma | Type-safe database access, migrations, schema management — excellent MySQL support |
| **Authentication** | NextAuth.js | Flexible auth with session management and RBAC; Google & Facebook social login in Phase 4 |
| **File Storage** | Hostinger Storage | Product images, blog media, and brand assets stored on Hostinger's native storage — no third-party dependency at launch |
| **Payment Gateway** | Razorpay | Reliable Indian-first payment gateway; supports cards, UPI, net banking, wallets |
| **Email — Transactional** | SendGrid | Order confirmations, shipping updates, password reset |
| **SMS — Notifications** | Twilio | Order status SMS notifications at each stage change |
| **Hosting** | Hostinger Node.js Hosting | Managed Node.js hosting with hPanel; SSH access, SSL included, MySQL native — no manual server configuration needed |
| **CDN** | Cloudflare | Fast global asset delivery; DDoS protection |
| **Admin Panel** | Custom-built (React) | Full control over UX and features; no third-party CMS limitations |

---

### 12. Data Models

> All models are implemented via **Prisma ORM** with a **MySQL** database.

```
User
├── id, email, password_hash, name, phone, role (super_admin | content_manager |
│   order_manager | customer), status (active | inactive | banned), created_at, updated_at

Product
├── id, title, slug, description, price, compare_at_price, sku, stock,
│   sizes[], colors[], images[], category_id, sub_category_id, collection_ids[],
│   planet (navagraha), zodiac_sign, life_path_number, emotional_intention,
│   tags[], meta_title, meta_description, status (draft | published),
│   created_at, updated_at

Category
├── id, name, slug, description, image, sort_order, meta_title, meta_description,
│   created_at

SubCategory
├── id, name, slug, description, image, sort_order, category_id,
│   meta_title, meta_description, created_at

Collection
├── id, name, slug, type (planetary | zodiac | numerology | vibe | ritual),
│   description, image, planet, zodiac_sign, life_path_number,
│   colour_palette_json, meta_title, meta_description, sort_order, created_at

Order
├── id, order_number, user_id, items[], subtotal, discount, coupon_id,
│   shipping_cost, tax, total, status (placed | processing | shipped |
│   out_for_delivery | delivered | cancelled | refunded),
│   shipping_address_id, tracking_number, shipping_provider,
│   payment_id, payment_status, notes, status_history[], created_at, updated_at

OrderItem
├── id, order_id, product_id, variant (size, colour), quantity, unit_price

Coupon
├── id, code, discount_type (percentage | flat), discount_value,
│   min_order_value, max_discount, usage_limit, per_user_limit,
│   valid_from, valid_until, applicable_to (site_wide | category_ids[] | product_ids[]),
│   first_order_only, is_stackable, is_active, times_used, created_at

BlogPost
├── id, title, slug, body, featured_image, blog_category_id, tags[],
│   author_id, meta_title, meta_description, status (draft | published),
│   published_at, created_at, updated_at

BlogCategory
├── id, name, slug, created_at

Popup
├── id, title, content, trigger_type (delay | scroll | exit_intent),
│   trigger_value, target_pages, frequency (once_session | once_ever | every_visit),
│   start_date, end_date, is_active, created_at

Promotion
├── id, name, description, discount_type, discount_value,
│   applicable_to (site_wide | category_ids[] | collection_ids[] | product_ids[]),
│   auto_apply, start_date, end_date, is_active, created_at

Address
├── id, user_id, label, line1, line2, city, state, postal_code, country,
│   is_default, created_at

Cart
├── id, user_id (nullable for guest), items[], coupon_id,
│   created_at, updated_at

CartItem
├── id, cart_id, product_id, variant (size, colour), quantity

NewsletterSubscriber
├── id, email, subscribed_at, is_active

Review
├── id, product_id, user_id, rating, comment, status (pending | approved | rejected),
│   created_at

Settings
├── key, value (store_name, logo_url, gtm_id, meta_pixel_id, shipping_config_json,
│   tax_config_json, payment_config_json, social_links_json)
```

---

### 13. User Flows

#### 13.1 Purchase Flow
```
Landing Page (Solar System Banner) → Browse Collections / Search
→ Category or Collection Page → Product Detail Page
→ Add to Cart → View Cart → Apply Coupon (optional)
→ Checkout (Address → Shipping → Payment → Review)
→ Payment Gateway → Order Confirmation Page → Email Receipt
→ Track Order (from Account Dashboard)
```

#### 13.2 Blog Engagement Flow
```
Organic Search / Social Link → Blog Post (e.g., "How Jupiter Energy Transforms Your Life")
→ Read Content → CTA to Guru/Jupiter Collection → Browse Products → Purchase
```

#### 13.3 Collection Discovery Flow
```
Landing Page → "Explore Your Planet" CTA → Planetary Collections
→ Select Planet (e.g., Shani/Saturn) → Browse Saturn Collection Products
→ Product Detail → Add to Cart → Purchase
```

#### 13.4 Admin — Add Product Flow
```
Admin Login → Dashboard → Products → Add New → Fill Details
→ Upload Images → Assign Category, Sub-Category, Collection
→ Set Cosmic Metadata (planet, zodiac, life path number, emotional intention)
→ Set Price & Stock → Fill SEO Fields → Save as Draft / Publish
```

#### 13.5 Admin — Create Coupon Flow
```
Admin Login → Coupons → Create New → Set Code, Type, Value
→ Set Rules (min order, max discount, usage limits, date range, applicability)
→ Set Combinability → Save & Activate
```

#### 13.6 Admin — Publish Blog Post Flow
```
Admin Login → Blog → Create Post → Write Content (rich text)
→ Upload Featured Image → Assign Category & Tags → Fill SEO Fields
→ Set Publish Date (now or scheduled) → Publish / Save as Draft
```

#### 13.7 Admin — Manage Pop-up Flow
```
Admin Login → Pop-ups → Create New → Design Content (text, image, CTA)
→ Set Trigger (delay / scroll / exit-intent) → Set Target Pages
→ Set Frequency & Date Range → Enable
```

---

### 14. Phases & Milestones

| Phase | Scope | Priority |
|-------|-------|----------|
| **Phase 1 — MVP** *(Target: 1 month)* | Storefront (product browsing, cart, checkout, payment via Razorpay), user accounts, admin panel (product + category + sub-category + order management with manual shipping updates), landing page with revolving solar system banner (pure CSS), 3–4 initial planetary collection pages, GTM/Meta Pixel base setup | **High** |
| **Phase 2 — Content & Engagement** | Blog engine (frontend + admin), newsletter integration, pop-up system, coupon management, promotions management, announcement bar | **High** |
| **Phase 3 — Analytics & Tracking** | Full GA4 e-commerce DataLayer events, Meta Pixel standard events with all parameters, tag-friendly markup audit, performance optimisation pass | **Medium** |
| **Phase 4 — Enhancements** | Advanced filters (planet, zodiac, life path), product reviews, wishlist, social login, order notifications (SMS), admin dashboard analytics, admin RBAC roles, search autocomplete | **Medium** |
| **Phase 5 — Scale & Iterate** | Shipping provider API integration (automated real-time tracking to replace manual updates), Meta Conversions API (server-side), multi-currency support, internationalisation, A/B testing infrastructure, personalisation | **Low** |

---

### 15. Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance Score | > 90 |
| Time to First Contentful Paint | < 1.2s |
| Cart Abandonment Rate | < 65% |
| Blog Organic Traffic Growth | 20% month-over-month (after 3 months) |
| Admin Task Completion Time | Common tasks (add product, update order) < 2 minutes |
| Uptime | > 99.9% |
| Solar System Banner FPS | 60 fps on mid-range devices |
| Mobile Conversion Rate | Track and improve quarterly |

---

### 16. Open Questions

All previously open questions have been resolved. The table below documents the decisions made:

| # | Question | Decision |
|---|----------|----------|
| 1 | Final domain name for Vastrayug? | **vastrayug.in** |
| 2 | Payment gateway preference? | **Razorpay** |
| 3 | Shipping providers to integrate in Phase 5? | **Manual shipping updates at launch** (admin enters tracking number, provider name, and tracking link per order). Automated API integration deferred to Phase 5. |
| 4 | Email marketing platform? | **SendGrid** |
| 5 | Hosting preference? | **Hostinger Node.js Hosting** — managed Node.js with hPanel, native MySQL, SSH access, SSL included |
| 6 | Initial product categories and collections at launch? | **Phased — launch with 3–4 Navagraha planetary collections first**, then expand to remaining planets and Zodiac collections in subsequent phases. |
| 7 | Social login providers? | **Google and Facebook** — implemented in Phase 4. |
| 8 | Multi-language support at launch? | **English only** |
| 9 | Return/refund policy? | **No returns — exchange only** |
| 10 | Budget and timeline constraints? | **Phase 1 (MVP) target: maximum 1 month** |
| 11 | Solar system banner — Three.js or pure CSS? | **Pure CSS animations** — lighter, faster, zero JS overhead. |
| 12 | Collection page colour themes? | **Primary palette with subtle planet-specific accent** — Cosmic Black + Nebula Gold as anchors, with each planet's dedicated accent colour layered subtly. |
| 13 | SMS notification provider? | **Twilio** |
| 14 | Launch all 9 planetary + 12 zodiac collections at once, or phase them? | **Phased — start with 3–4 planets**, expand progressively. |

---

### 17. Appendix

#### A. Vastrayug Navagraha Colour Reference

| Planet | Sanskrit | Energy | Primary Colours |
|:---|:---|:---|:---|
| Sun | Surya | Leadership, vitality | Gold `#D4A017`, Saffron `#F4622C`, Amber `#FFBF00` |
| Moon | Chandra | Intuition, emotion | Pearl White `#F8F4EC`, Pale Blue `#B8D4E3`, Silver `#C0C0C0` |
| Mars | Mangal | Power, passion | Deep Red `#8B0000`, Rust `#B7410E`, Charcoal `#36454F` |
| Mercury | Budh | Intelligence, agility | Emerald `#50C878`, Teal `#008080` |
| Jupiter | Guru | Wisdom, abundance | Royal Yellow `#FADA5E`, Deep Blue `#003087`, Gold `#C9A84C` |
| Venus | Shukra | Love, beauty, luxury | Blush `#FFB6C1`, Rose Gold `#B76E79`, Ivory `#FFFFF0` |
| Saturn | Shani | Discipline, resilience | Midnight Blue `#191970`, Black `#0A0A0F`, Indigo `#4B0082` |
| Rahu | Rahu | Transformation, mystery | Smoke Grey `#808080`, Dark Violet `#9400D3`, Obsidian `#1C1C1C` |
| Ketu | Ketu | Liberation, spirituality | Ash White `#E8E8E0`, Maroon `#800000`, Deep Brown `#4A2C2A` |

#### B. Vastrayug Product Categories (from Brand Doc)

- Oversized tees & graphic tees
- Premium hoodies & sweatshirts
- Co-ord sets (top + matching bottom)
- Joggers & wide-leg pants
- Jackets & statement outerwear
- Unisex kurtas & draped silhouettes
- Accessories — caps, tote bags, scarves with cosmic motifs

#### C. Vibe & Energy Collections

| Collection | Energy | Look & Feel |
|:---|:---|:---|
| The Sovereign | Power, authority, unbreakable confidence | Bold, commanding silhouettes |
| The Healer | Softness, safety, grounding | Warm, gentle tones |
| The Wanderer | Freedom, openness, exploration | Fluid fabrics, versatile layers |
| The Shadow | Depth, introspection, embracing darkness | Dark, introspective palette |
| The Reborn | Fresh start, hope, new chapter | Light, forward-facing energy |

#### D. Glossary

- **GTM:** Google Tag Manager — a tag management system for deploying tracking scripts.
- **Meta Pixel:** Facebook/Meta's tracking snippet for conversion tracking and audience building.
- **DataLayer:** A JavaScript object used by GTM to receive and process event data.
- **RBAC:** Role-Based Access Control — restricting admin panel features based on user role.
- **SSR/SSG:** Server-Side Rendering / Static Site Generation — Next.js rendering strategies.
- **Navagraha:** The nine celestial bodies in Vedic astrology — the planetary framework behind Vastrayug's core collections.
- **GA4:** Google Analytics 4 — the current version of Google Analytics.

#### E. References

- [GA4 E-Commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Meta Pixel Standard Events](https://developers.facebook.com/docs/meta-pixel/reference)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- Vastrayug Brand Guidelines & Vision (docs/Brand_values_and_vision.md)
