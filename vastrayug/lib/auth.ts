// ─────────────────────────────────────────────────────────────
// Vastrayug — NextAuth Configuration
// Reference: tech_stack.md §5, admin_panel_spec.md §3
//
// Providers:
//   • Credentials (email + bcrypt password) — Phase 1
//   • Google OAuth — Phase 4 (commented out)
//
// Session strategy: JWT
// Adapter: PrismaAdapter (for future OAuth account linking)
// ─────────────────────────────────────────────────────────────

import { NextAuthOptions, getServerSession, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'  // Phase 4
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@prisma/client'

// ── NextAuth Type Extensions ───────────────────────────────────────
// Extend the built-in types to include our custom fields
declare module 'next-auth' {
  interface User {
    role: string
    isDefaultPassword?: boolean
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isDefaultPassword?: boolean
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    isDefaultPassword?: boolean
  }
}

// ── Auth Options ───────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
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

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        if (!valid) return null

        if (user.status !== 'ACTIVE') {
          throw new Error('Account suspended')
        }

        // Detect default seed password for admin warning banner
        const isDefaultPassword = await bcrypt.compare(
          'admin',
          user.passwordHash
        )

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isDefaultPassword,
        }
      },
    }),

    // ── Phase 4: Uncomment when deploying Google OAuth ──────────
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: { prompt: 'consent', access_type: 'offline' },
    //   },
    // }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isDefaultPassword = user.isDefaultPassword
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isDefaultPassword = token.isDefaultPassword
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

// ── Server-Side Session Helper ─────────────────────────────────────
// Use in Server Components and API Route Handlers
export async function getSession() {
  return getServerSession(authOptions)
}

// ── RBAC Helpers ───────────────────────────────────────────────────
// Reference: admin_panel_spec.md §3 — Role Permissions Matrix

const ADMIN_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'CONTENT_MANAGER',
  'ORDER_MANAGER',
]

/**
 * Require the session user to have one of the specified roles.
 * Throws an error if the user is unauthenticated or lacks the required role.
 *
 * @example
 *   const session = await requireRole('SUPER_ADMIN', 'CONTENT_MANAGER')
 */
export async function requireRole(...roles: UserRole[]) {
  const session = await getSession()

  if (!session?.user) {
    throw new Error('Unauthenticated')
  }

  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error('Forbidden')
  }

  return session
}

/**
 * Require the session user to be any admin role
 * (SUPER_ADMIN, CONTENT_MANAGER, or ORDER_MANAGER).
 *
 * @example
 *   const session = await requireAdmin()
 */
export async function requireAdmin() {
  return requireRole(...ADMIN_ROLES)
}

/**
 * Require the session user to be a SUPER_ADMIN specifically.
 * Used for role promotions, settings, and activity log access.
 *
 * @example
 *   const session = await requireSuperAdmin()
 */
export async function requireSuperAdmin() {
  return requireRole('SUPER_ADMIN')
}

/**
 * Require the session user to be authenticated (any role).
 * Used for /account/*, /checkout/*, and customer-only API routes.
 *
 * @example
 *   const session = await requireAuth()
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    throw new Error('Unauthenticated')
  }

  return session
}
