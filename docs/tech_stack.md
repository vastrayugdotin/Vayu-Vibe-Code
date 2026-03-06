# Tech Stack — Vastrayug E-Commerce Platform

> **Document Version:** 1.0 · **Date:** 2026-03-06 · **Status:** Final Pre-Development Lock
> This document is the single source of truth for all technology choices, package versions, and configuration for the Vastrayug platform. No technology or version should be introduced into the codebase without first being recorded here.

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Core Framework](#2-core-framework)
3. [Styling](#3-styling)
4. [Database & ORM](#4-database--orm)
5. [Authentication](#5-authentication)
6. [Payment Gateway — Razorpay](#6-payment-gateway--razorpay)
7. [Email — SendGrid](#7-email--sendgrid)
8. [SMS — Twilio](#8-sms--twilio)
9. [File Storage](#9-file-storage)
10. [CDN — Cloudflare](#10-cdn--cloudflare)
11. [Hosting — Hostinger](#11-hosting--hostinger)
12. [Dev Tooling](#12-dev-tooling)
13. [Package Registry — Full `package.json`](#13-package-registry--full-packagejson)
14. [Configuration Files](#14-configuration-files)
15. [Environment Variables Reference](#15-environment-variables-reference)
16. [Browser & Device Support](#16-browser--device-support)
17. [Deferred / Future Technologies](#17-deferred--future-technologies)

---

## 1. Stack Overview

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js | `14.2.x` | App Router, SSR + SSG |
| **Language** | TypeScript | `5.4.x` | Strict mode enabled |
| **UI Library** | React | `18.3.x` | Bundled with Next.js 14 |
| **Styling** | Tailwind CSS | `3.4.x` | Custom brand tokens |
| **Animations** | Pure CSS | — | Solar system banner; no JS dependency |
| **Database** | MySQL | `8.0.x` | Hostinger native |
| **ORM** | Prisma | `5.14.x` | Type-safe queries, migrations |
| **Auth** | NextAuth.js | `4.24.x` | Credentials + Google OAuth |
| **Payment** | Razorpay Node SDK | `2.9.x` | Cards, UPI, net banking, wallets |
| **Email** | `@sendgrid/mail` | `8.1.x` | Transactional email |
| **SMS** | `twilio` | `5.3.x` | Order status SMS (Phase 4) |
| **Hosting** | Hostinger Node.js | — | hPanel-managed, SSH, SSL |
| **CDN** | Cloudflare | — | DNS, CDN, DDoS |
| **Storage** | Hostinger Object Storage | — | Images, media assets |

---

## 2. Core Framework

### Next.js `14.2.x`

**Why Next.js 14 (not 15):** Next.js 15 introduced breaking changes in caching behaviour and the `fetch` semantics. For a production e-commerce store, v14's well-tested App Router with stable PPR and ISR is the safer choice. Migrate to v15 after GA stabilisation.

#### Rendering Strategy Per Page Type

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
| API Routes | Server-only | No caching by default |

#### Directory Structure

```
vastrayug/
├── app/
│   ├── (storefront)/           # Public routes
│   │   ├── page.tsx            # Home — ISR
│   │   ├── shop/
│   │   ├── collections/[slug]/
│   │   ├── products/[slug]/
│   │   ├── blog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   ├── (admin)/               # Admin routes — auth-gated
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── users/
│   │       ├── blog/
│   │       ├── coupons/
│   │       ├── promotions/
│   │       ├── popups/
│   │       └── settings/
│   ├── api/                   # API Route Handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── webhooks/
│   │   │   └── razorpay/
│   │   ├── blog/
│   │   ├── newsletter/
│   │   └── admin/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Atomic components
│   ├── storefront/            # Page-level storefront components
│   ├── admin/                 # Admin panel components
│   └── shared/                # Used in both storefront + admin
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── auth.ts                # NextAuth config
│   ├── razorpay.ts            # Razorpay client init
│   ├── sendgrid.ts            # SendGrid helpers
│   ├── twilio.ts              # Twilio helpers
│   ├── storage.ts             # File upload helpers
│   └── utils.ts               # Shared utilities
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── fonts/
│   ├── images/
│   └── brand/
├── types/
│   └── index.ts               # Shared TypeScript types
├── hooks/                     # Custom React hooks
├── store/                     # Zustand global state
├── middleware.ts               # Route protection, auth checks
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
└── .env.example
```

---

## 3. Styling

### Tailwind CSS `3.4.x`

#### Brand Design Token Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary Brand Palette ───────────────────────────
        'cosmic-black':   '#0A0A0F',
        'nebula-gold':    '#C9A84C',
        'stardust-white': '#F4F1EC',
        'deep-indigo':    '#1B1640',
        // ── Extended Palette ────────────────────────────────
        'eclipse-silver': '#A8A9AD',
        'astral-purple':  '#4B0082',
        'celestial-blue': '#003087',
        'void-black':     '#050507',
        // ── Navagraha Planet Accents ─────────────────────────
        'surya-gold':     '#D4A017',  // Sun
        'surya-saffron':  '#F4622C',
        'chandra-pearl':  '#F8F4EC',  // Moon
        'chandra-blue':   '#B8D4E3',
        'mangal-red':     '#8B0000',  // Mars
        'budh-emerald':   '#50C878',  // Mercury
        'guru-yellow':    '#FADA5E',  // Jupiter
        'shukra-blush':   '#FFB6C1',  // Venus
        'shukra-rose':    '#B76E79',
        'shani-indigo':   '#191970',  // Saturn
        'rahu-violet':    '#9400D3',  // Rahu
        'ketu-maroon':    '#800000',  // Ketu
      },
      fontFamily: {
        // Loaded via next/font/google
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        accent:  ['var(--font-playfair-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem',    { lineHeight: '1.15' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.2' }],
        'heading-lg': ['1.875rem',{ lineHeight: '1.25' }],
        'heading-md': ['1.5rem',  { lineHeight: '1.3' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
      },
      animation: {
        'orbit-slow':   'orbit 60s linear infinite',
        'orbit-med':    'orbit 40s linear infinite',
        'orbit-fast':   'orbit 20s linear infinite',
        'spin-slow':    'spin 30s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'fade-in':      'fadeIn 0.4s ease-in-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(201, 168, 76, 0.7)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'cosmic-gradient':   'linear-gradient(135deg, #0A0A0F 0%, #1B1640 50%, #0A0A0F 100%)',
        'gold-gradient':     'linear-gradient(135deg, #C9A84C 0%, #FADA5E 50%, #C9A84C 100%)',
        'shimmer-gradient':  'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold-glow':   '0 0 30px rgba(201, 168, 76, 0.4)',
        'gold-subtle': '0 0 15px rgba(201, 168, 76, 0.2)',
        'cosmic':      '0 25px 50px rgba(0, 0, 0, 0.8)',
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),    // Blog rich-text prose styles
    require('@tailwindcss/forms'),         // Form element base styles
    require('@tailwindcss/aspect-ratio'), // Product image aspect ratios
    require('@tailwindcss/container-queries'), // Responsive card components
  ],
}

export default config
```

#### Fonts (via `next/font/google`)

```typescript
// app/layout.tsx
import { Inter, Cormorant_Garamond, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  style: ['normal', 'italic'],
  display: 'swap',
})
```

---

## 4. Database & ORM

### MySQL `8.0.x`

- **Hosted on:** Hostinger — native MySQL included in Node.js hosting plan.
- **Charset:** `utf8mb4` (full Unicode support including emojis in product descriptions).
- **Collation:** `utf8mb4_unicode_ci`.
- **Connection pool:** Managed by Prisma; default pool size of 10. Tuned to `DATABASE_CONNECTION_LIMIT` env var for production.
- **Max connections on Hostinger:** Check plan limits (typically 100 on shared, unlimited on VPS).

### Prisma `5.14.x`

#### `lib/prisma.ts` — Client Singleton

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### Prisma Configuration

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

#### Key Prisma CLI Commands

```bash
# Development — create + apply migration
npx prisma migrate dev --name <descriptive_name>

# Production — apply existing migrations only
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio (local DB browser)
npx prisma studio

# Re-generate Prisma Client after schema change
npx prisma generate

# Verify schema + DB are in sync
npx prisma migrate status
```

---

## 5. Authentication

### NextAuth.js `4.24.x`

> **Phase 1–3:** Credentials only (email + password).
> **Phase 4:** Add Google OAuth.
> **Future Phase:** Facebook (deferred — requires separate Meta App review and approval).

#### Providers Configured

```typescript
// lib/auth.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'  // Enabled Phase 4
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password_hash) return null
        const valid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!valid) return null
        if (user.status !== 'ACTIVE') throw new Error('Account suspended')
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
    // ── Phase 4: Uncomment when deploying Google OAuth ──
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: { params: { prompt: 'consent', access_type: 'offline' } },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/account',
  },
}
```

#### Password Hashing

- **Library:** `bcryptjs` — pure JS implementation, no native bindings required on Hostinger.
- **Salt rounds:** `12` (balance of security and performance).

```typescript
import bcrypt from 'bcryptjs'

const hash = await bcrypt.hash(password, 12)
const valid = await bcrypt.compare(password, hash)
```

#### Route Protection (`middleware.ts`)

```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    if (isAdminRoute && !['SUPER_ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
}
```

---

## 6. Payment Gateway — Razorpay

### `razorpay` Node SDK `2.9.x`

#### Initialisation (`lib/razorpay.ts`)

```typescript
import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})
```

#### Payment Flow

```
1. POST /api/checkout/create-order
   → razorpay.orders.create({ amount, currency: 'INR', receipt: orderNumber })
   → Returns razorpay_order_id

2. Frontend: Razorpay Checkout JS loaded (via <Script strategy="lazyOnload">)
   → User pays

3. Razorpay calls webhook: POST /api/webhooks/razorpay
   → Verify signature using crypto.createHmac
   → Update Order.payment_status = PAID
   → Update Order.status = PROCESSING
   → Trigger confirmation email + DataLayer purchase event

4. Frontend: razorpay.handler callback
   → POST /api/checkout/verify-payment
   → Redirect to /order-confirmation/[orderId]
```

#### Webhook Signature Verification

```typescript
import crypto from 'crypto'

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expectedSig === signature
}
```

#### Razorpay Checkout Widget Config

```typescript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: totalInPaise,           // Amount in paise (INR × 100)
  currency: 'INR',
  name: 'Vastrayug',
  description: `Order ${orderNumber}`,
  image: '/brand/logo.png',
  order_id: razorpayOrderId,
  prefill: {
    name: user.name,
    email: user.email,
    contact: user.phone,
  },
  theme: {
    color: '#C9A84C',             // Nebula Gold
    backdrop_color: '#0A0A0F',
  },
  modal: {
    confirm_close: true,
    animation: true,
  },
}
```

---

## 7. Email — SendGrid

### `@sendgrid/mail` `8.1.x`

#### Initialisation (`lib/sendgrid.ts`)

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export { sgMail }
```

#### Email Templates Required

| Template | Trigger | Key Variables |
|----------|---------|--------------|
| **Order Confirmation** | Order placed + payment confirmed | `orderNumber`, `items[]`, `total`, `shippingAddress`, `estimatedDelivery` |
| **Shipping Update** | Admin updates order to SHIPPED | `orderNumber`, `trackingNumber`, `shippingProvider`, `trackingUrl` |
| **Out for Delivery** | Admin updates order status | `orderNumber`, `customerName` |
| **Order Delivered** | Admin marks as DELIVERED | `orderNumber`, `customerName` |
| **Password Reset** | User requests reset | `resetLink`, `expiresIn` |
| **Newsletter Welcome** | Email subscription | `customerName` |
| **Exchange Confirmation** | Admin creates exchange | `originalOrderNumber`, `newOrderNumber` |

#### Sending Helper

```typescript
export async function sendTransactionalEmail({
  to, subject, templateId, dynamicData,
}: {
  to: string
  subject: string
  templateId: string
  dynamicData: Record<string, unknown>
}) {
  await sgMail.send({
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'Vastrayug',
    },
    subject,
    templateId,
    dynamicTemplateData: dynamicData,
  })
}
```

#### SendGrid Domain Setup

1. Add domain `vastrayug.in` in SendGrid Sender Authentication
2. Add DNS TXT + CNAME records to Cloudflare for SPF, DKIM, DMARC
3. Set `SENDGRID_FROM_EMAIL=orders@vastrayug.in`

---

## 8. SMS — Twilio

### `twilio` `5.3.x` · **Phase 4 only**

> **Not active at Phase 1–3 launch.** Code stubs present but feature-flagged.

#### Initialisation (`lib/twilio.ts`)

```typescript
import twilio from 'twilio'

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendSMS(to: string, message: string) {
  if (process.env.NEXT_PUBLIC_SMS_ENABLED !== 'true') return
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_FROM_NUMBER!,
    to: `+91${to}`,
  })
}
```

#### SMS Trigger Points (Phase 4)

| Trigger | Message Template |
|---------|-----------------|
| Order Placed | "Your Vastrayug order #{orderNumber} has been placed. Track it at vastrayug.in/account" |
| Shipped | "Your order #{orderNumber} has shipped. Tracking: {trackingUrl}" |
| Out for Delivery | "Your Vastrayug order #{orderNumber} is out for delivery today. 🌟" |
| Delivered | "Your Vastrayug order #{orderNumber} has been delivered. Wear your cosmic identity." |

---

## 9. File Storage

### Hostinger Object Storage (S3-compatible API)

- **SDK:** `@aws-sdk/client-s3` `3.x` — Hostinger Object Storage is S3-compatible.
- **Bucket name:** `vastrayug-assets`
- **Public read:** Enabled for product/blog images.
- **Upload restriction:** API-only (admin panel uploads routed via `/api/admin/upload`).
- **Accepted types:** `image/jpeg`, `image/webp`, `image/avif`, `image/png`
- **Max file size:** 5 MB per image.

```typescript
// lib/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
})

export async function uploadImage(
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.STORAGE_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
    CacheControl: 'max-age=31536000',
  }))
  return `${process.env.STORAGE_PUBLIC_URL}/${key}`
}
```

#### File Key Convention

```
products/{productId}/{uuid}.webp
blog/{postId}/{uuid}.webp
brand/logo.png
brand/favicon.ico
```

---

## 10. CDN — Cloudflare

- **Plan:** Free tier adequate for launch. Upgrade to Pro if WAF rules needed.
- **DNS:** All records managed in Cloudflare (proxied through orange cloud).
- **SSL:** Full (strict) mode — Hostinger SSL + Cloudflare SSL.
- **Cache Rules:**
  - `*.webp`, `*.avif`, `*.png`, `*.jpg`, `*.js`, `*.css` → Cache at edge, 1 year.
  - `/api/*` → Bypass cache (always dynamic).
  - `/admin/*` → Bypass cache.
- **Image Delivery via `next/image`:**

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.STORAGE_PUBLIC_HOSTNAME, // Hostinger storage domain
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars (Phase 4)
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

---

## 11. Hosting — Hostinger

### Plan: Node.js Hosting (Business or above)

| Setting | Value |
|---------|-------|
| **Node.js version** | `20.x` LTS |
| **Entry point** | `server.js` (Next.js custom server, or standard `npm start`) |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |
| **Port** | `3000` (Hostinger proxies to port 80/443) |
| **Process manager** | hPanel built-in Node.js manager |
| **SSH** | Enabled — used for deployment and DB migrations |

#### Deployment Flow

```bash
# Local: build and verify no errors
npm run build

# Push to git repository (GitHub/GitLab)
git push origin main

# SSH into Hostinger
ssh u{user}@{server}.hostinger.com

# Pull latest code
git pull origin main

# Install production dependencies only
npm ci --production=false   # Prisma needs devDeps for generate

# Run Prisma generate + migrate
npx prisma generate
npx prisma migrate deploy

# Restart Node.js process via hPanel, or:
pm2 restart vastrayug       # If PM2 is available
```

#### `.env` on Hostinger

Set all environment variables via **hPanel → Node.js → Environment Variables** UI. Never commit `.env` files to git.

---

## 12. Dev Tooling

### TypeScript `5.4.x`

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint `8.x`

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier `3.x`

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Husky `9.x` + lint-staged

```json
// package.json (scripts)
"prepare": "husky install"

// .husky/pre-commit
npx lint-staged

// lint-staged.config.js
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
}
```

### Zustand `4.5.x` — Global State Management

Used for: cart state, mini-cart open/close, popup visibility, search state.

```typescript
// store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}
```

### React Query (TanStack Query) `5.x`

Used for: admin panel data fetching, product listing pagination, search, order history.

```typescript
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

### Additional Utilities

| Package | Version | Use |
|---------|---------|-----|
| `zod` | `3.23.x` | API input validation + form schemas |
| `react-hook-form` | `7.51.x` | Form state + validation |
| `@hookform/resolvers` | `3.x` | Zod + react-hook-form bridge |
| `slugify` | `1.6.x` | Auto-generate URL slugs |
| `date-fns` | `3.6.x` | Date formatting and manipulation |
| `sharp` | `0.33.x` | Next.js image optimisation (required by `next/image` in production) |
| `nanoid` | `5.x` | Order number generation, unique IDs |
| `clsx` | `2.x` | Conditional className merging |
| `tailwind-merge` | `2.x` | Merge Tailwind classes without conflicts |
| `@radix-ui/react-*` | `1.x` | Accessible UI primitives (Dialog, Select, Checkbox, etc.) |
| `lucide-react` | `0.378.x` | Icon set — consistent, lightweight |
| `react-hot-toast` | `2.4.x` | Toast notifications |
| `framer-motion` | `11.x` | Page transitions, subtle non-CSS animations |
| `@tiptap/react` | `2.4.x` | Rich text editor for blog + product descriptions |
| `react-dropzone` | `14.x` | Image upload drag-and-drop in admin |
| `recharts` | `2.12.x` | Admin dashboard charts (revenue, orders) |
| `crypto` | Node built-in | Razorpay signature verification |

---

## 13. Package Registry — Full `package.json`

```json
{
  "name": "vastrayug",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prepare": "husky install"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^1.6.0",
    "@aws-sdk/client-s3": "^3.583.0",
    "@hookform/resolvers": "^3.4.2",
    "@prisma/client": "^5.14.0",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@sendgrid/mail": "^8.1.3",
    "@tanstack/react-query": "^5.40.0",
    "@tiptap/extension-image": "^2.4.0",
    "@tiptap/extension-link": "^2.4.0",
    "@tiptap/react": "^2.4.0",
    "@tiptap/starter-kit": "^2.4.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.2.10",
    "lucide-react": "^0.378.0",
    "nanoid": "^5.0.7",
    "next": "14.2.10",
    "next-auth": "^4.24.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.51.5",
    "react-hot-toast": "^2.4.1",
    "razorpay": "^2.9.2",
    "recharts": "^2.12.7",
    "sharp": "^0.33.4",
    "slugify": "^1.6.6",
    "tailwind-merge": "^2.3.0",
    "twilio": "^5.3.0",
    "zod": "^3.23.8",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@tailwindcss/container-queries": "^0.1.1",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.13",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.12.0",
    "@typescript-eslint/parser": "^7.12.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.10",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.7",
    "prettier": "^3.3.2",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "prisma": "^5.14.0",
    "tailwindcss": "^3.4.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 14. Configuration Files

### `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.STORAGE_PUBLIC_HOSTNAME ?? '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars — Phase 4
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vastrayug.in' }],
        destination: 'https://vastrayug.in/:path*',
        permanent: true,
      },
    ]
  },

  // Bundle analyser (run with ANALYZE=true npm run build)
  ...(process.env.ANALYZE === 'true' && {
    experimental: { bundlePagesRouterDeps: true },
  }),
}

export default nextConfig
```

---

## 15. Environment Variables Reference

> **Never commit `.env.local` or any file with real secrets to git.**
> Store a `.env.example` with placeholder values in the repository.

```env
# ─── Application ────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Database ────────────────────────────────────────────────
DATABASE_URL="mysql://vastrayug_user:password@localhost:3306/vastrayug"
DATABASE_CONNECTION_LIMIT=10

# ─── NextAuth ────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=         # Generate: openssl rand -hex 32

# ─── Google OAuth (Phase 4 — leave blank until ready) ────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Razorpay ────────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx   # Exposed to client (safe — public key only)
RAZORPAY_WEBHOOK_SECRET=xxxx                 # Set in Razorpay dashboard webhook config

# ─── SendGrid ────────────────────────────────────────────────
SENDGRID_API_KEY=SG.xxxx
SENDGRID_FROM_EMAIL=orders@vastrayug.in
# Dynamic Template IDs (create in SendGrid dashboard):
SENDGRID_TEMPLATE_ORDER_CONFIRM=d-xxxx
SENDGRID_TEMPLATE_SHIPPING_UPDATE=d-xxxx
SENDGRID_TEMPLATE_OUT_FOR_DELIVERY=d-xxxx
SENDGRID_TEMPLATE_DELIVERED=d-xxxx
SENDGRID_TEMPLATE_PASSWORD_RESET=d-xxxx
SENDGRID_TEMPLATE_NEWSLETTER_WELCOME=d-xxxx
SENDGRID_TEMPLATE_EXCHANGE_CONFIRM=d-xxxx

# ─── Twilio (Phase 4 — leave blank until ready) ──────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
NEXT_PUBLIC_SMS_ENABLED=false

# ─── Hostinger Object Storage ────────────────────────────────
STORAGE_ENDPOINT=https://xxxx.hostinger.com
STORAGE_ACCESS_KEY=xxxx
STORAGE_SECRET_KEY=xxxx
STORAGE_BUCKET_NAME=vastrayug-assets
STORAGE_PUBLIC_URL=https://xxxx.hostinger.com/vastrayug-assets
STORAGE_PUBLIC_HOSTNAME=xxxx.hostinger.com  # For next/image remotePatterns

# ─── Analytics & Tracking ────────────────────────────────────
# These are set via the Admin Settings UI and stored in DB.
# Include here as fallbacks for local dev if needed:
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=

# ─── Feature Flags ───────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=false    # Set true in Phase 4
NEXT_PUBLIC_REVIEWS_ENABLED=false         # Set true in Phase 4
NEXT_PUBLIC_WISHLIST_ENABLED=false        # Set true in Phase 4
NEXT_PUBLIC_BLOG_ENABLED=false            # Set true in Phase 2

# ─── Misc ────────────────────────────────────────────────────
ANALYZE=false   # Set true to run bundle analyser: ANALYZE=true npm run build
```

---

## 16. Browser & Device Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Samsung Internet | Last 1 version |

| Viewport | Breakpoint | Priority |
|----------|-----------|---------|
| Mobile (portrait) | 360px–639px | **Primary** — design mobile-first |
| Mobile (landscape) | 640px–767px | High |
| Tablet | 768px–1023px | High |
| Desktop | 1024px–1279px | High |
| Wide desktop | 1280px+ | Medium |

- **OS:** Android 8+, iOS 14+, Windows 10+, macOS 11+
- **Input:** Touch-first interaction; keyboard navigation (WCAG AA compliance)

---

## 17. Deferred / Future Technologies

These are documented here to prevent re-introduction without planning:

| Technology | Deferred Reason | When to Add |
|-----------|----------------|------------|
| **Facebook OAuth** | Requires separate Meta App review and approval process | Future phase post Phase 4 |
| **Meta Conversions API (server-side)** | Requires hashed user data pipeline | Phase 5 |
| **Shipping Provider APIs** (Delhivery, DTDC, etc.) | Manual tracking at launch | Phase 5 |
| **Multi-currency** | INR only at launch | Phase 5 |
| **Internationalisation (i18n)** | English only at launch | Phase 5 |
| **Redis** | No caching layer needed at launch scale | If 1k+ concurrent users hit DB bottlenecks |
| **Elasticsearch** | Prisma full-text search adequate for launch | If product catalogue exceeds 50k items |
| **Stripe** | Razorpay covers all Indian payment methods | If international expansion |
| **Next.js 15** | Breaking caching changes; await GA stabilisation | After v15.1+ stable |
| **React Server Components patterns (advanced)** | Next.js 14 App Router RSC used conservatively | Evaluate with Next.js 15 upgrade |
| **A/B Testing** | No infrastructure at launch | Phase 5 |

---

*This tech stack document is locked for Phase 1 development. Any changes to versions, packages, or configuration decisions must be recorded here before implementation.*
