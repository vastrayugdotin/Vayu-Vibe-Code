"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingBag, User, Heart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import MiniCart from "../cart/MiniCart";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // TODO: integrate with real auth and cart stores
  const { data: session } = useSession();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { isMiniCartOpen, openMiniCart, closeMiniCart } = useUIStore();

  // Blog toggle via env var
  const blogEnabled = process.env.NEXT_PUBLIC_BLOG_ENABLED !== "false";
  const wishlistEnabled = process.env.NEXT_PUBLIC_WISHLIST_ENABLED !== "false";

  const links = [...NAV_LINKS];
  if (blogEnabled) {
    links.push({ href: "/blog", label: "Blog" });
  }

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cosmic-black/90 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-stardust-white p-1 hover:text-nebula-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide font-body hover:text-nebula-gold transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-nebula-gold"
                    : "text-stardust-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-heading tracking-widest text-stardust-white flex items-center gap-2"
          >
            <span className="text-nebula-gold">✦</span>
            VASTRAYUG
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 md:gap-6 text-stardust-white">
            <button
              className="hover:text-nebula-gold transition-colors hidden md:block"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {wishlistEnabled && (
              <Link
                href="/account/wishlist"
                className="hover:text-nebula-gold transition-colors hidden md:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* User Menu */}
            <div className="hidden md:block relative group">
              <Link
                href={session ? "/account" : "/login"}
                className="hover:text-nebula-gold transition-colors block"
              >
                <User className="w-5 h-5" />
              </Link>
              {/* Simple dropdown mock - would use Radix DropdownMenu in real implementation */}
              {session && (
                <div className="absolute right-0 mt-2 w-48 bg-deep-indigo border border-white/10 rounded-md shadow-cosmic opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-stardust-white hover:bg-white/5"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-stardust-white hover:bg-white/5"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-mangal-red hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon with Badge */}
            <button
              onClick={openMiniCart}
              className="hover:text-nebula-gold transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-nebula-gold text-cosmic-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} />

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed inset-0 bg-cosmic-black/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 bottom-0 w-[280px] bg-deep-indigo border-r border-white/10 p-6 transition-transform duration-300 ease-cosmic flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-heading text-stardust-white tracking-widest flex items-center gap-2">
              <span className="text-nebula-gold">✦</span>
              VASTRAYUG
            </span>
            <button
              className="text-stardust-white/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search the cosmos..."
              className="w-full bg-cosmic-black border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-stardust-white focus:outline-none focus:border-nebula-gold"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stardust-white/50" />
          </div>

          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-heading text-stardust-white hover:text-nebula-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {wishlistEnabled && (
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-3 text-stardust-white hover:text-nebula-gold"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
              )}
              {session ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-stardust-white hover:text-nebula-gold"
                  >
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-mangal-red flex items-center gap-3 pt-2"
                  >
                    <span className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 text-stardust-white hover:text-nebula-gold"
                >
                  <User className="w-5 h-5" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
