"use client";

// ─────────────────────────────────────────────────────────────
// Storefront Providers — Client boundary for SessionProvider
// Reference: component_architecture.md §3.1
//
// Wraps storefront pages with NextAuth SessionProvider so that
// useSession() works in client components (Navbar user menu,
// wishlist toggle, cart sync, etc.).
//
// The session prop is pre-fetched server-side in the storefront
// layout to avoid a redundant client-side /api/auth/session call.
// ─────────────────────────────────────────────────────────────

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function StorefrontProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
