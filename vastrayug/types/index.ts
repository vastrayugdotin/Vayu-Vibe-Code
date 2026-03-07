// ─────────────────────────────────────────────────────────────
// Vastrayug — Shared TypeScript Types
// Reference: component_architecture.md §7.2, §8.2, §4.5
//
// Non-Prisma types shared across the codebase:
//   • API response envelopes
//   • Cart / checkout types (Zustand store)
//   • Admin table filter/sort params
//   • Branded string types
// ─────────────────────────────────────────────────────────────

import type { Decimal } from '@prisma/client/runtime/library'

// ═════════════════════════════════════════════════════════════
// API RESPONSE ENVELOPES
// ═════════════════════════════════════════════════════════════

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: PaginationMeta
}

// ═════════════════════════════════════════════════════════════
// CART TYPES (Zustand store)
// ═════════════════════════════════════════════════════════════

export interface CartItemProduct {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number | null
  imageUrl?: string | null
}

export interface CartItemVariant {
  id: string
  size: string
  colour?: string | null
  sku: string
  stock: number
  priceOverride?: number | null
}

export interface CartItem {
  id: string
  product: CartItemProduct
  variant: CartItemVariant
  quantity: number
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  discountAmount: number
  couponCode: string | null
  shippingCost: number
  taxAmount: number
  total: number
}

// ═════════════════════════════════════════════════════════════
// CHECKOUT TYPES
// ═════════════════════════════════════════════════════════════

export type CheckoutStep = 'address' | 'shipping' | 'payment' | 'confirmation'

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

// ═════════════════════════════════════════════════════════════
// ADMIN TABLE PARAMS
// ═════════════════════════════════════════════════════════════

export type SortDirection = 'asc' | 'desc'

export interface SortParam {
  field: string
  direction: SortDirection
}

export interface PaginationParam {
  page: number
  perPage: number
}

export interface DateRangeParam {
  from?: string
  to?: string
}

export interface AdminListParams {
  pagination: PaginationParam
  sort?: SortParam
  search?: string
  filters?: Record<string, string | string[] | boolean>
  dateRange?: DateRangeParam
}

// ═════════════════════════════════════════════════════════════
// BRANDED STRING TYPES
// ═════════════════════════════════════════════════════════════

declare const __brand: unique symbol

type Brand<T, B extends string> = T & { readonly [__brand]: B }

export type Slug = Brand<string, 'Slug'>
export type Cuid = Brand<string, 'Cuid'>

// ═════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═════════════════════════════════════════════════════════════

/** Convert Prisma Decimal fields to number for client-side use. */
export type SerializedDecimal<T> = {
  [K in keyof T]: T[K] extends Decimal
    ? number
    : T[K] extends Decimal | null
      ? number | null
      : T[K] extends object
        ? SerializedDecimal<T[K]>
        : T[K]
}

/** Extract the `data` field type from an ApiSuccessResponse. */
export type ExtractData<T> = T extends ApiSuccessResponse<infer D> ? D : never

// ═════════════════════════════════════════════════════════════
// NAV TYPES (Admin sidebar)
// ═════════════════════════════════════════════════════════════

export interface AdminNavItem {
  label: string
  href: string
  icon: string
  allowedRoles: string[]
  badge?: number
}

export interface AdminNavSection {
  title: string
  items: AdminNavItem[]
}
