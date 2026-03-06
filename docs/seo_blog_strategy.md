# SEO & Blog Strategy — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final Pre-Development
> Cross-referenced from `Brand_values_and_vision.md`, `prd_new.md`, `prisma/schema.prisma`, `_schema.md`, `tech_stack.md`, and `phases.md`.

---

## Table of Contents

1. [Strategic Context](#1-strategic-context)
2. [SEO Architecture](#2-seo-architecture)
3. [Structured Data (JSON-LD)](#3-structured-data-json-ld)
4. [Keyword Strategy](#4-keyword-strategy)
5. [Blog Content Architecture](#5-blog-content-architecture)
6. [Content Pillars & Post Ideas](#6-content-pillars--post-ideas)
7. [On-Page SEO Rules](#7-on-page-seo-rules)
8. [Technical SEO Checklist](#8-technical-seo-checklist)
9. [Internal Linking Strategy](#9-internal-linking-strategy)
10. [Blog-to-Commerce Conversion Flow](#10-blog-to-commerce-conversion-flow)
11. [Brand Voice in SEO Copy](#11-brand-voice-in-seo-copy)
12. [Phase Rollout](#12-phase-rollout)

---

## 1. Strategic Context

Vastrayug operates at the intersection of **premium fashion and cosmic spirituality** — a niche with strong organic search intent but very few established competitors who do both well. The SEO and blog strategy must serve two simultaneous goals:

| Goal | How |
|------|-----|
| **Organic traffic acquisition** | Rank for astrology, numerology, Vedic spiritual, and zodiac fashion search terms |
| **Deepening cosmic connection** | Blog content that reinforces brand identity and nudges readers toward their personal collection |

**Target domain:** `vastrayug.in`

**Language:** English only (Phase 1–4). Multi-language deferred to Phase 5.

**Success metric (PRD §15):** 20% month-over-month blog organic traffic growth after the first 3 months post-Phase 2 launch.

---

## 2. SEO Architecture

### 2.1 Rendering Strategy (SEO-Critical Pages)

All public-facing pages use **ISR (Incremental Static Regeneration)** — pre-rendered at build, refreshed in the background. This gives Google a fast, fully-rendered HTML response on every crawl.

| Page Type | Rendering | Revalidate | Notes |
|-----------|-----------|:----------:|-------|
| Home | ISR | 3600s | Solar system banner is pure CSS — no JS blocking |
| Product Listing (category, collection) | ISR | 300s | Stock changes frequently |
| Product Detail Page (PDP) | ISR + `generateStaticParams` | 60s | SEO-critical; near-real-time stock |
| Blog Listing | ISR | 3600s | Updated when new post published |
| Blog Post | ISR + `generateStaticParams` | 3600s | Most critical page for organic rankings |
| Collection Pages | ISR | 3600s | Planetary/Zodiac hero pages |
| Category Pages | ISR | 300s | |
| Cart / Checkout / Account / Admin | CSR / SSR | — | No indexing needed |

> **Why not full SSG?** `generateStaticParams` pre-generates all product/blog slugs at build time. ISR handles new products without a full redeploy. Best of both worlds.

### 2.2 URL Slug Structure

Clean, descriptive, hierarchy-respecting URLs improve both Click-Through Rate (CTR) and crawl efficiency.

| Page | URL Pattern | Example |
|------|-------------|---------|
| Home | `/` | `vastrayug.in/` |
| All Products | `/shop` | `vastrayug.in/shop` |
| Category | `/category/[slug]` | `vastrayug.in/category/oversized-tees` |
| Sub-Category | `/category/[slug]/[sub-slug]` | `vastrayug.in/category/oversized-tees/zodiac-collection` |
| Collection | `/collection/[slug]` | `vastrayug.in/collection/saturn-shani-collection` |
| Product | `/shop/[slug]` | `vastrayug.in/shop/saturn-discipline-oversized-tee` |
| Blog Listing | `/blog` | `vastrayug.in/blog` |
| Blog Post | `/blog/[slug]` | `vastrayug.in/blog/how-saturn-return-transforms-you` |
| Blog Category | `/blog/category/[slug]` | `vastrayug.in/blog/category/astrology` |

**Slug rules** (enforced in `Product.slug`, `BlogPost.slug`, `Collection.slug`, `Category.slug`):
- Lowercase, hyphen-separated
- No special characters, no underscores
- No stop words (a, the, of) unless brand-critical
- Max ~60 characters
- Auto-generated from title via `slugify`, manually editable in admin

### 2.3 Sitemap & Robots

Auto-generated at `/sitemap.xml` using Next.js App Router's built-in `sitemap.ts`:

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts, collections, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ])

  return [
    { url: 'https://vastrayug.in', priority: 1.0, changeFrequency: 'weekly' },
    { url: 'https://vastrayug.in/shop', priority: 0.9, changeFrequency: 'daily' },
    { url: 'https://vastrayug.in/blog', priority: 0.8, changeFrequency: 'daily' },
    ...products.map(p => ({ url: `https://vastrayug.in/shop/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...blogPosts.map(p => ({ url: `https://vastrayug.in/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.9 })),
    ...collections.map(c => ({ url: `https://vastrayug.in/collection/${c.slug}`, priority: 0.7 })),
    ...categories.map(c => ({ url: `https://vastrayug.in/category/${c.slug}`, priority: 0.7 })),
  ]
}
```

`robots.txt` — block admin, account, checkout, API:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart
Disallow: /api/
Sitemap: https://vastrayug.in/sitemap.xml
```

---

## 3. Structured Data (JSON-LD)

All structured data injected via `<script type="application/ld+json">` in the page `<head>`. Implemented using Next.js `generateMetadata` + a dedicated `JsonLd` server component.

### 3.1 `Organization` (Site-Wide — `app/(store)/layout.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vastrayug",
  "alternateName": "Vastrayug — Wear Your Cosmic Identity",
  "url": "https://vastrayug.in",
  "logo": "https://vastrayug.in/brand/logo.png",
  "description": "Premium cosmic-inspired fashion brand blending astrology, Navagraha planetary energy, and luxury apparel.",
  "sameAs": [
    "https://www.instagram.com/vastrayug",
    "https://twitter.com/vastrayug"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@vastrayug.in"
  }
}
```

### 3.2 `Product` (PDP — `shop/[slug]/page.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{Product.title}",
  "description": "{Product.description (stripped HTML)}",
  "image": ["{ProductImage[0].url}", "{ProductImage[1].url}"],
  "sku": "{Product.sku}",
  "brand": { "@type": "Brand", "name": "Vastrayug" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "{Product.price}",
    "availability": "https://schema.org/InStock",
    "url": "https://vastrayug.in/shop/{Product.slug}",
    "seller": { "@type": "Organization", "name": "Vastrayug" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{averageRating}",
    "reviewCount": "{approvedReviewCount}"
  }
}
```

> `aggregateRating` is only injected when there are approved reviews (`Review.status = APPROVED`). Phase 4 feature.

### 3.3 `Article` (Blog Post — `blog/[slug]/page.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{BlogPost.title}",
  "description": "{BlogPost.excerpt}",
  "image": "{BlogPost.featured_image_url}",
  "author": {
    "@type": "Person",
    "name": "{User.name}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Vastrayug",
    "logo": { "@type": "ImageObject", "url": "https://vastrayug.in/brand/logo.png" }
  },
  "datePublished": "{BlogPost.published_at}",
  "dateModified": "{BlogPost.updated_at}",
  "url": "https://vastrayug.in/blog/{BlogPost.slug}",
  "mainEntityOfPage": "https://vastrayug.in/blog/{BlogPost.slug}"
}
```

### 3.4 `BreadcrumbList` (All Public Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vastrayug.in" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://vastrayug.in/shop" },
    { "@type": "ListItem", "position": 3, "name": "{Category.name}", "item": "https://vastrayug.in/category/{Category.slug}" },
    { "@type": "ListItem", "position": 4, "name": "{Product.title}", "item": "https://vastrayug.in/shop/{Product.slug}" }
  ]
}
```

### 3.5 `ItemList` (Collection / Category Listing Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{Collection.name}",
  "description": "{Collection.description}",
  "url": "https://vastrayug.in/collection/{Collection.slug}",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://vastrayug.in/shop/{Product.slug}"
    }
  ]
}
```

---

## 4. Keyword Strategy

### 4.1 Keyword Tiers

| Tier | Search Volume | Intent | Role |
|------|:------------:|--------|------|
| **Tier 1 — High volume, competitive** | 10k–100k/mo | Informational | Blog content targets; builds domain authority |
| **Tier 2 — Mid volume, medium competition** | 1k–10k/mo | Commercial / Intent | Collection and category page targets |
| **Tier 3 — Long-tail, low competition** | 100–1k/mo | Transactional | Product page targets; highest conversion rate |

### 4.2 Tier 1 — Blog Traffic Keywords

High-volume informational queries that Vastrayug blog posts should target:

| Keyword | Monthly Searches (Est.) | Blog Post Angle |
|---------|:-----------------------:|-----------------|
| saturn return meaning | 22k | "Saturn Return: What It Means and Why Your Life Is Changing Right Now" |
| what is my ruling planet | 18k | "How to Find Your Ruling Planet (And What It Says About You)" |
| life path number meaning | 40k | "Life Path Numbers 1–9 Explained: Your Cosmic Identity in Numbers" |
| jupiter transit 2026 | 12k | "Jupiter Transit 2026: How to Dress Your Way Through Expansion" |
| mercury retrograde meaning | 55k | "Mercury Retrograde: What It Is, What It Disrupts, and How to Survive It" |
| rahu ketu astrology | 15k | "Rahu and Ketu: The Shadow Planets That Define Your Karmic Journey" |
| navagraha planets | 9k | "The Nine Navagrahas: How Each Planet Shapes Your Personality" |
| mars in astrology | 25k | "Mars Energy: Passion, Power, and How to Harness It" |
| astrology for beginners | 33k | "Vedic vs. Western Astrology: A Beginner's Guide to Your Chart" |
| moon sign meaning | 20k | "Your Moon Sign: The Emotion Behind Your Sun Sign" |

### 4.3 Tier 2 — Collection & Category Page Keywords

Mid-volume commercial queries — target via collection page `meta_title` / `meta_description`:

| Keyword | Target Page | `Collection.meta_title` Example |
|---------|-------------|--------------------------------|
| saturn clothing aesthetic | `/collection/saturn-shani-collection` | "Saturn — Shani Collection: Discipline in Every Thread \| Vastrayug" |
| jupiter energy clothing | `/collection/jupiter-guru-collection` | "Jupiter — Guru Collection: Wear Wisdom \| Vastrayug" |
| zodiac aesthetic outfits | `/collection/zodiac-[sign]` | "Scorpio Collection: Depth, Power, Transformation \| Vastrayug" |
| astrology fashion india | `/shop` | "Shop Cosmic Fashion India — Astrology Apparel \| Vastrayug" |
| cosmic oversized tees india | `/category/oversized-tees` | "Cosmic Oversized Tees — Planetary & Zodiac Prints \| Vastrayug" |
| astrology hoodie india | `/category/hoodies` | "Premium Astrology Hoodies — Navagraha & Zodiac \| Vastrayug" |
| life path number gift | `/collection/numerology-[number]` | "Life Path 7 Collection — The Seeker's Gift \| Vastrayug" |
| numerology clothing | `/collection/numerology-collections` | "Numerology Collections — Dress Your Life Path \| Vastrayug" |

### 4.4 Tier 3 — Product Page Long-Tail Keywords

High-intent transactional — target via `Product.meta_title` and `Product.meta_description`:

| Long-Tail Keyword | `Product.meta_title` |
|------------------|----------------------|
| saturn shani oversized tee | "Shani Tee — Saturn Energy Oversized T-Shirt \| Vastrayug" |
| jupiter guru hoodie india | "Guru Hoodie — Jupiter Energy Premium Hoodie \| Vastrayug" |
| scorpio zodiac hoodie unisex | "Scorpio Zodiac Hoodie — Unisex Premium \| Vastrayug" |
| numerology life path 8 clothing | "Life Path 8 Tee — Power & Abundance \| Vastrayug" |
| moon chandra co-ord set | "Chandra Co-ord Set — Moon Energy \| Vastrayug" |
| rahu transformation jacket | "Rahu Jacket — Shadow & Transformation \| Vastrayug" |

### 4.5 Cosmic Metadata as Filter SEO

The `Product` schema carries `planet`, `zodiac_sign`, and `life_path_number` as indexed fields. These enable:
- **Filter URLs** with canonical tags (e.g., `/shop?planet=SATURN`) — each rendered with unique meta title to avoid thin content
- **Internal collection URLs** (`/collection/saturn-shani-collection`) that aggregate all Saturn-tagged products
- **Search autocomplete** (Phase 4) that surfaces planet/zodiac/life-path product results

---

## 5. Blog Content Architecture

### 5.1 Data Model Reference

The blog uses the following `BlogPost` model fields for SEO:

| Field | SEO Role |
|-------|---------|
| `title` | H1, OG title source |
| `slug` | URL (`/blog/[slug]`) |
| `excerpt` | Meta description fallback; listing page snippet |
| `meta_title` | `<title>` tag (max 60 chars) |
| `meta_description` | `<meta name="description">` (max 160 chars) |
| `canonical_url` | `<link rel="canonical">` — for syndicated/cross-posted content |
| `featured_image_url` | OG image, Twitter Card image, Article schema image |
| `featured_image_alt` | Image alt-text for accessibility and Google Image Search |
| `published_at` | `datePublished` in Article schema |
| `blog_category_id` | Category filter URL + `BlogCategory` archive page |
| `is_featured` | Sticky post on listing — sticky posts get H2 treatment in listing JSON |

### 5.2 Blog Categories (`BlogCategory`)

Seed these categories at Phase 2 launch:

| Slug | Category Name | Content Theme |
|------|--------------|---------------|
| `astrology` | Astrology | Birth charts, houses, planetary transits, Western vs Vedic |
| `navagraha` | Navagraha Planets | Deep dives on each of the 9 planets |
| `zodiac` | Zodiac Signs | Sign-specific identity, compatibility, fashion recommendations |
| `numerology` | Numerology | Life path numbers, master numbers, numerological dates |
| `cosmic-lifestyle` | Cosmic Lifestyle | Intentional living, ritual, healing, spiritual self-care |
| `planetary-transits` | Planetary Transits | Current transit guides, what to expect, how to dress for it |
| `brand-stories` | Brand Stories | Behind-the-scenes, new collection reveals, brand philosophy |
| `style-guides` | Style Guides | How to wear your planet/sign/number — styling tips |

### 5.3 Blog Tags (`BlogTag`)

Tags enable cross-cutting discovery. Seed these at Phase 2:

`saturn`, `jupiter`, `mars`, `mercury`, `venus`, `moon`, `sun`, `rahu`, `ketu`, `aries`, `taurus`, `gemini`, `cancer`, `leo`, `virgo`, `libra`, `scorpio`, `sagittarius`, `capricorn`, `aquarius`, `pisces`, `life-path-1` through `life-path-9`, `life-path-11`, `life-path-22`, `life-path-33`, `vedic-astrology`, `western-astrology`, `mercury-retrograde`, `saturn-return`, `jupiter-transit`, `healing`, `transformation`, `beginners`, `gift-guide`

---

## 6. Content Pillars & Post Ideas

All blog content must be written in the **Vastrayug tone of voice** — mystical but accessible, empowering, warm, premium, hopeful. See Section 11 for copy rules.

### Pillar 1 — Navagraha Planet Deep Dives

One flagship post per planet. These are evergreen, high-authority pages.

| Post Title | Target Keyword | Internal CTA |
|-----------|---------------|-------------|
| "Saturn — Shani: The Planet of Discipline, Time, and Transformation" | saturn navagraha meaning | → Saturn Collection |
| "Jupiter — Guru: The Planet of Wisdom, Abundance, and Expansion" | jupiter planet vedic astrology | → Jupiter Collection |
| "Mars — Mangal: The Warrior Planet's Energy in Your Life" | mars mangal astrology | → Mars Collection |
| "Mercury — Budh: Intelligence, Communication, and the Mind" | mercury budh astrology | → Mercury Collection |
| "Venus — Shukra: Love, Beauty, and the Luxury Within You" | venus shukra vedic astrology | → Venus Collection |
| "The Moon — Chandra: Emotion, Intuition, and Your Inner World" | chandra moon vedic astrology | → Moon Collection |
| "The Sun — Surya: Identity, Authority, and Vital Force" | surya sun navagraha | → Sun Collection |
| "Rahu: The Shadow Planet of Ambition, Illusion, and Obsession" | rahu meaning astrology | → Rahu Collection |
| "Ketu: Liberation, Spirituality, and Letting Go" | ketu meaning astrology | → Ketu Collection |

### Pillar 2 — Zodiac Identity

One flagship post per zodiac sign + seasonal transit posts.

| Post Title | Target Keyword | Internal CTA |
|-----------|---------------|-------------|
| "Scorpio Season: Depth, Power, and Dressing for Transformation" | scorpio season astrology | → Scorpio Collection |
| "Saturn Return Explained: Why Life Falls Apart Before It Gets Better" | saturn return meaning | → Saturn Collection |
| "Your Sun Sign vs. Your Moon Sign: Which One Is Really You?" | sun moon sign difference | → Shop All |
| "What Your Rising Sign Says About How the World Sees You" | rising sign meaning | → Shop All |
| "Sagittarius Energy: The Wanderer's Fashion Guide" | sagittarius traits fashion | → Wanderer Collection |
| "Capricorn Season: How to Dress for Discipline and Success" | capricorn season tips | → Saturn Collection |

### Pillar 3 — Numerology

| Post Title | Target Keyword | Internal CTA |
|-----------|---------------|-------------|
| "Life Path Number 1: The Leader's Energy and How to Wear It" | life path 1 meaning | → Life Path 1 Collection |
| "Life Path 7: The Seeker, the Mystic, the Introvert" | life path 7 personality | → Life Path 7 Collection |
| "Life Path 11: The Master Intuitive — Your Cosmic Superpower" | life path 11 meaning | → Life Path 11 Collection |
| "How to Calculate Your Life Path Number (in 30 Seconds)" | how to find life path number | → Numerology Collections |
| "The Meaning of Your Life Path Number in Fashion and Identity" | numerology fashion style | → Numerology Collections |
| "Master Numbers 11, 22, and 33: What Makes Them Special" | master numbers numerology | → All Collections |

### Pillar 4 — Planetary Transits (Time-Sensitive, High Traffic)

These are published around active transit windows — high search volume spikes.

| Post Title | Timing | Target Keyword |
|-----------|--------|---------------|
| "Mercury Retrograde [Season]: What to Expect and How to Prepare" | Before each retrograde | mercury retrograde [year] |
| "Jupiter Transit 2026: The Year of Expansion — Are You Ready?" | January 2026 | jupiter transit 2026 |
| "Saturn in Pisces: Lessons in Letting Go" | During transit | saturn in pisces 2025 2026 |
| "Venus Retrograde: Love, Money, and Beauty Under Review" | Before retrograde | venus retrograde meaning |

### Pillar 5 — Cosmic Lifestyle & Healing

| Post Title | Target Keyword | Internal CTA |
|-----------|---------------|-------------|
| "How to Align Your Wardrobe with Your Ruling Planet" | ruling planet fashion | → Planetary Collections |
| "Dressing for Your Emotional Intention: A Guide to Cosmic Dressing" | cosmic dressing guide | → All Collections |
| "The Rebuilder's Guide: How to Start Over When Life Resets" | starting over finding yourself | → The Reborn Collection |
| "The Shadow Collection: Why Embracing Darkness Is a Spiritual Act" | shadow work spirituality | → The Shadow Collection |
| "Gifting by the Stars: How to Choose a Gift by Zodiac Sign" | zodiac gift guide | → Zodiac Collections |
| "What Is Vedic Astrology and How Is It Different from Western?" | vedic vs western astrology | → Blog / Collections |

### Pillar 6 — Brand & Style Stories

| Post Title | Timing | CTA |
|-----------|--------|-----|
| "The Story Behind Vastrayug: Fashion Written in the Stars" | Launch week | → Shop All |
| "Inside the Saturn Collection: Why Discipline Is the New Luxury" | Collection launch | → Saturn Collection |
| "How We Chose the Nebula Gold: The Colour That Speaks to Every Planet" | Brand story | → About |
| "New Arrival: [Collection Name] — The Cosmic Meaning Behind Every Piece" | Each new drop | → New Collection |

---

## 7. On-Page SEO Rules

### 7.1 Blog Posts

| Element | Rule |
|---------|------|
| `<title>` | `{meta_title} \| Vastrayug` — max 60 chars total. If `meta_title` blank, auto-generate from `title`. |
| `<meta name="description">` | `meta_description` — max 160 chars. If blank, use first 155 chars of `excerpt`. |
| `<h1>` | **One per page.** Always the `BlogPost.title`. Never duplicated in body. |
| Sub-headings | H2 for major sections, H3 for sub-sections. Keyword-rich but natural. |
| Featured image | `alt="{BlogPost.featured_image_alt}"` — required field in admin. |
| Internal links | At least 2–3 internal links per post (to related posts + at least 1 collection CTA). |
| Canonical | `<link rel="canonical" href="https://vastrayug.in/blog/{slug}">` — or `canonical_url` if set. |
| OG tags | `og:title`, `og:description`, `og:image`, `og:type: article`, `og:url` |
| Twitter card | `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` |
| Word count | Minimum 1,000 words for pillar posts; 600+ for transit/news posts. |
| Reading time | Calculated and displayed (`Math.ceil(wordCount / 200)` minutes). |

### 7.2 Product Pages

| Element | Rule |
|---------|------|
| `<title>` | `{Product.meta_title} \| Vastrayug` — or `{Product.title} — {Category.name} \| Vastrayug` if field blank. |
| `<meta name="description">` | `Product.meta_description`, else first 155 chars of stripped `description`. |
| `<h1>` | `Product.title` — one per page. |
| Image alt | `ProductImage.alt_text` — required at upload. Auto-suggest: `"{Product.title} — {size} — Vastrayug"`. |
| Breadcrumb | Home > Shop > {Category} > {Product} — both visible and JSON-LD. |
| Canonical | `https://vastrayug.in/shop/{Product.slug}` |

### 7.3 Collection & Category Pages

| Element | Rule |
|---------|------|
| `<title>` | `{Collection.meta_title} \| Vastrayug` — e.g., "Saturn — Shani Collection \| Vastrayug" |
| `<h1>` | `Collection.name` — e.g., "Saturn — Shani Collection" |
| Description | `Collection.description` rendered as first paragraph — 100–200 words of cosmic narrative. |
| Image alt | `Collection.name + " — Vastrayug Collection"` |

---

## 8. Technical SEO Checklist

### Phase 1 (Baseline — ship with storefront)

- [ ] `sitemap.xml` auto-generated from published products + collections + categories
- [ ] `robots.txt` with proper disallows
- [ ] `<link rel="canonical">` on every public page
- [ ] Open Graph + Twitter Card meta tags on all public pages
- [ ] `Organization` JSON-LD in root layout
- [ ] `BreadcrumbList` JSON-LD on product, category, and collection pages
- [ ] `Product` JSON-LD on all PDPs
- [ ] All product images have `alt_text` (enforced in admin upload)
- [ ] Next.js `<Image>` with `srcset` + WebP/AVIF output + lazy loading
- [ ] Google Fonts via `next/font/google` — no render-blocking external font requests
- [ ] Pure CSS solar system banner — no JS render-blocking on hero
- [ ] Lighthouse Performance > 90 on mobile (4G)
- [ ] LCP < 1.2s
- [ ] GTM container (`GTM-TWDX4B9R`) injected with GA4 (`G-WJ6E42CKNK`) configured

### Phase 2 (Blog launch)

- [ ] `Article` JSON-LD on all blog posts
- [ ] `ItemList` JSON-LD on Blog Listing page
- [ ] Blog sitemap included in main `sitemap.xml`
- [ ] `<link rel="canonical">` per blog post (uses `canonical_url` field if set)
- [ ] Featured image `alt_text` required in admin post form
- [ ] Social share buttons with pre-populated text (WhatsApp, X, Facebook, Pinterest)
- [ ] Related posts section with contextual internal links
- [ ] Blog category archive pages (`/blog/category/[slug]`)
- [ ] Scheduled post support (`BlogPost.status = SCHEDULED`, `published_at` in future)

### Phase 3 (Analytics & Performance Pass)

- [ ] Full GA4 DataLayer events firing on all key pages
- [ ] Meta Pixel standard events firing (replace `PLACEHOLDER_META_PIXEL_ID`)
- [ ] Tag-friendly markup audit — `data-gtm-*` attributes on all interactive elements
- [ ] `data-product-id`, `data-product-name`, `data-product-category`, `data-product-price` on all product cards
- [ ] Performance audit — Lighthouse re-run post-blog launch
- [ ] Image CDN audit — all images served via Cloudflare with `max-age=31536000`

---

## 9. Internal Linking Strategy

Internal links distribute PageRank and keep users in the funnel longer. Every page should link to at least 3 other relevant pages.

### 9.1 Blog Post → Commerce Links

Every blog post should contain at least one **in-content CTA** linking to the most relevant collection or product:

```
Post about Saturn Return → link to "Saturn — Shani Collection"
Post about Jupiter Transit → link to "Jupiter — Guru Collection"
Post about Life Path 7 → link to "Life Path 7 Collection"
Post about The Rebuilder persona → link to "The Reborn Collection"
Post about Zodiac gift guide → link to "Zodiac Collections" + specific sign collections
```

In the admin `BlogPost` body (Tiptap rich text), the admin adds these links manually. The **Related Collection CTA component** at the bottom of every post automatically links to:
- `Collection` where `Collection.planet` matches `BlogPost` tag for that planet
- `Collection` where `Collection.zodiac_sign` matches zodiac tags on the post

### 9.2 Product Page → Blog Links

Each PDP surfaces a contextual blog link:
- "Learn more about {Product.planet} energy" → most recent published blog post tagged with that planet

### 9.3 Collection Page → Blog Links

Each collection page surfaces the most recent blog post from the same planet/zodiac category:
- "Read: {BlogPost.title}" → `BlogPost` where tag matches `Collection.planet`

### 9.4 Home → Key Targets

The home page links to:
- 3–4 active collection hero pages (planetary collections)
- Blog listing page (content section)
- "Explore Your Planet" CTA → `/collection` listing

---

## 10. Blog-to-Commerce Conversion Flow

This is the core revenue loop driven by SEO:

```
Google Search: "saturn return meaning"
    ↓
Blog Post: "Saturn Return: What It Means and Why Your Life Is Changing"
    ↓
In-post CTA: "Dress for your Saturn Return → Explore the Shani Collection"
    ↓
Collection Page: Saturn — Shani Collection
    ↓
Product Detail Page: Shani Discipline Hoodie
    ↓
Add to Cart → Checkout → Order
```

**DataLayer events fired in this flow:**
`page_view` → `page_view` (blog) → `view_item_list` (collection) → `select_item` → `view_item` (PDP) → `add_to_cart` → `begin_checkout` → `purchase`

**Meta Pixel events:**
`PageView` → `PageView` → `ViewContent` → `AddToCart` → `InitiateCheckout` → `Purchase`

---

## 11. Brand Voice in SEO Copy

All meta titles, meta descriptions, blog copy, and on-page text must follow Vastrayug's tone of voice. SEO copy is brand copy — they are never separate.

### 11.1 Meta Title Formula

```
[Keyword-rich H1 variant] | Vastrayug
```

Examples:
- ✅ `"Saturn Return: What It Means for Your Identity | Vastrayug"`
- ✅ `"Jupiter — Guru Collection: Wear Wisdom | Vastrayug"`
- ❌ `"Best Astrology Hoodie India Buy Online | Vastrayug"` — transactional language, not premium

### 11.2 Meta Description Formula

Lead with the reader's transformation. Close with a soft brand promise. No promotional language.

```
[What the reader will understand/feel] + [Vastrayug's perspective] + [Implicit CTA]
```

Examples:
- ✅ `"Saturn Return doesn't break you — it reveals you. Understand the transit that reshapes your life and discover the collection made for this chapter."`
- ✅ `"Nine planets. Nine energy signatures. Nine collections designed to align your wardrobe with your cosmic blueprint. Explore the Navagraha Collections."`
- ❌ `"Shop the Saturn collection now. Free shipping on orders above ₹999!"` — wrong tone, wrong priorities

### 11.3 H1 & Body Copy Rules

| Rule | Example |
|------|---------|
| Speak to the reader's experience, not the product | "You are between chapters" not "This hoodie features..." |
| Lead with meaning, follow with specifics | Planet story first, fabric details second |
| No urgency language | Never "limited time", "while stocks last", "sale ends" |
| Cosmic vocabulary is welcome, jargon is not | "Navagraha" with a one-line explanation; no unexplained Sanskrit walls |
| No clickbait | Titles must deliver on their promise in the body |

---

## 12. Phase Rollout

| SEO / Blog Feature | Phase |
|-------------------|:-----:|
| `sitemap.xml` auto-generation | **1** |
| `robots.txt` | **1** |
| Canonical tags on all public pages | **1** |
| OG + Twitter Card meta on all pages | **1** |
| `Organization`, `Product`, `BreadcrumbList` JSON-LD | **1** |
| Next.js ISR for product + collection pages | **1** |
| GTM + GA4 base setup | **1** |
| Blog engine (frontend + admin) | **2** |
| `Article` + `ItemList` JSON-LD | **2** |
| Blog sitemap included in `sitemap.xml` | **2** |
| Blog category + tag archive pages | **2** |
| Blog-to-collection internal CTAs | **2** |
| Seed blog categories + tags | **2** |
| Publish Pillar 1 posts (all 9 planet deep dives) | **2** |
| Publish Pillar 3 posts (life path numbers) | **2** |
| Full GA4 DataLayer events | **3** |
| Meta Pixel standard events + replace Pixel ID | **3** |
| Tag-friendly markup audit (`data-gtm-*` everywhere) | **3** |
| Lighthouse Performance audit + remediation | **3** |
| Product `aggregateRating` JSON-LD (requires reviews) | **4** |
| Advanced cosmic filters → filter page canonical URLs | **4** |
| Search autocomplete (planet / zodiac / life path) | **4** |
| Multi-language / i18n support | **5** |

---

*This document is the definitive reference for all SEO decisions, content strategy, structured data implementation, and blog operations. All product, collection, and blog writing must follow the brand voice rules in Section 11. Technical SEO implementation follows the page-level rules in Section 7 and the checklist in Section 8.*
