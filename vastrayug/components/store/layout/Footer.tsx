import Link from 'next/link'
import { Instagram, Facebook, Twitter, Phone as WhatsApp } from 'lucide-react'

const FOOTER_LINKS = {
  shop: [
    { href: '/shop', label: 'All Products' },
    { href: '/collections', label: 'Cosmic Collections' },
    { href: '/shop?category=apparel', label: 'Apparel' },
    { href: '/shop?category=accessories', label: 'Accessories' },
  ],
  company: [
    { href: '/about', label: 'Our Story' },
    { href: '/blog', label: 'Cosmic Journal' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/exchange-policy', label: 'Exchange Policy' },
  ],
}

const SOCIAL_LINKS = [
  { href: 'https://instagram.com/vastrayug', icon: Instagram, label: 'Instagram' },
  { href: 'https://wa.me/yourwhatsappnumber', icon: WhatsApp, label: 'WhatsApp' },
  { href: 'https://facebook.com/vastrayug', icon: Facebook, label: 'Facebook' },
  // Using Twitter icon as fallback for X/Pinterest if needed, though Pinterest is requested.
  // Lucide has no Pinterest icon by default in some older versions, so we use Twitter as a placeholder if needed,
  // but let's try to import a generic one or use text if it fails. We will use a custom SVG for Pinterest.
]

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="22" x2="12" y2="13" />
      <circle cx="12" cy="10" r="4" />
      <path d="M12 6v4" />
      <path d="M12 14v8" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}


export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-void-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="font-heading text-2xl tracking-widest text-stardust-white mb-4 flex items-center gap-2">
              <span className="text-nebula-gold">✦</span>
              VASTRAYUG
            </Link>
            <p className="text-eclipse-silver font-accent italic text-lg mb-8">
              &quot;Wear Your Cosmic Identity.&quot;
            </p>

            <div className="w-full max-w-md">
              <h3 className="text-sm font-heading tracking-widest text-stardust-white uppercase mb-4">
                Join the Cosmic Circle
              </h3>
              <p className="text-sm text-stardust-white/60 mb-4 font-body">
                Subscribe for planetary insights, early access to drops, and exclusive offers.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-cosmic-black border border-white/10 rounded-md px-4 py-2 text-sm text-stardust-white focus:outline-none focus:border-nebula-gold transition-colors font-body"
                  required
                />
                <button
                  type="submit"
                  className="bg-nebula-gold text-cosmic-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-stardust-white transition-colors font-body"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-8">
            {/* Shop */}
            <div>
              <h3 className="text-sm font-heading tracking-widest text-stardust-white uppercase mb-6">
                Shop
              </h3>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-eclipse-silver hover:text-nebula-gold transition-colors font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-heading tracking-widest text-stardust-white uppercase mb-6">
                Company
              </h3>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-eclipse-silver hover:text-nebula-gold transition-colors font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-heading tracking-widest text-stardust-white uppercase mb-6">
                Legal
              </h3>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-eclipse-silver hover:text-nebula-gold transition-colors font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
          <p className="text-sm text-stardust-white/40 font-body text-center md:text-left">
            &copy; {currentYear} Vastrayug. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eclipse-silver hover:text-nebula-gold transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
            <a
              href="https://pinterest.com/vastrayug"
              target="_blank"
              rel="noopener noreferrer"
              className="text-eclipse-silver hover:text-nebula-gold transition-colors"
              aria-label="Pinterest"
            >
              <PinterestIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}