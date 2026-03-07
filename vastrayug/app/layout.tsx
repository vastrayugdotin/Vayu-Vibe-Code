import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'
import './globals.css'

// ── Font Definitions (CSS variable injections) ─────────────────────
// Reference: tech_stack.md §3 — Fonts (via next/font/google)
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

// ── GTM Configuration ──────────────────────────────────────────────
// Reference: tracking_events.md §2.1
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID // 'GTM-TWDX4B9R'

// ── Organization JSON-LD (site-wide) ───────────────────────────────
// Reference: seo_blog_strategy.md §3.1
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vastrayug',
  alternateName: 'Vastrayug — Wear Your Cosmic Identity',
  url: 'https://vastrayug.in',
  logo: 'https://vastrayug.in/brand/logo.png',
  description:
    'Premium cosmic-inspired fashion brand blending astrology, Navagraha planetary energy, and luxury apparel.',
  sameAs: [
    'https://www.instagram.com/vastrayug',
    'https://twitter.com/vastrayug',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@vastrayug.in',
  },
}

// ── Default Metadata ───────────────────────────────────────────────
// Reference: Brand_values_and_vision.md — Brand Overview, Taglines, Visual Identity
export const metadata: Metadata = {
  metadataBase: new URL('https://vastrayug.in'),
  title: {
    default: 'Vastrayug — Wear Your Cosmic Identity',
    template: '%s | Vastrayug',
  },
  description:
    'Premium cosmic-inspired fashion rooted in Navagraha planetary energy, zodiac identity, and numerology. Discover luxury apparel designed to align your wardrobe with your cosmic blueprint.',
  keywords: [
    'Vastrayug',
    'cosmic fashion',
    'astrology clothing',
    'Navagraha fashion',
    'zodiac apparel',
    'planetary energy clothing',
    'premium Indian fashion',
    'numerology fashion',
    'spiritual fashion brand',
  ],
  authors: [{ name: 'Vastrayug', url: 'https://vastrayug.in' }],
  creator: 'Vastrayug',
  publisher: 'Vastrayug',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vastrayug.in',
    siteName: 'Vastrayug',
    title: 'Vastrayug — Wear Your Cosmic Identity',
    description:
      'Premium cosmic-inspired fashion rooted in Navagraha planetary energy, zodiac identity, and numerology.',
    images: [
      {
        url: '/brand/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Vastrayug — Wear Your Cosmic Identity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vastrayug — Wear Your Cosmic Identity',
    description:
      'Premium cosmic-inspired fashion rooted in Navagraha planetary energy, zodiac identity, and numerology.',
    images: ['/brand/og-default.png'],
    creator: '@vastrayug',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/brand/apple-touch-icon.png',
  },
}

// ── Root Layout ────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${playfair.variable}`}
    >
      <head>
        {/* ── Organization JSON-LD (seo_blog_strategy.md §3.1) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        {/* ── Google Tag Manager (head) — tracking_events.md §2.1 ── */}
        {GTM_ID && (
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
        )}
      </head>

      <body className="font-body bg-cosmic-black text-stardust-white antialiased">
        {/* ── Google Tag Manager (noscript body) ── */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* ── App Providers ── */}
        <Providers>
          {children}
        </Providers>

        {/* ── Toast Notifications ── */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1B1640',
              color: '#F4F1EC',
              border: '1px solid rgba(201, 168, 76, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#C9A84C',
                secondary: '#1B1640',
              },
            },
            error: {
              iconTheme: {
                primary: '#8B0000',
                secondary: '#F4F1EC',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
