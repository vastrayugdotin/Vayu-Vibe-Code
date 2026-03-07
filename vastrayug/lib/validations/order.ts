// ─────────────────────────────────────────────────────────────
// Vastrayug — Order Validation Schemas
// Reference: admin_panel_spec.md §9
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── Status Transitions (§9.3) ────────────────────────────────

const ORDER_STATUS = [
  'PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY',
  'DELIVERED', 'CANCELLED', 'REFUNDED', 'EXCHANGED',
] as const

export const orderStatusUpdateSchema = z.object({
  status: z.enum(ORDER_STATUS),
  note: z.string().optional(),
})

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>

// ── Tracking Info (§9.2) ─────────────────────────────────────

export const orderTrackingSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  shippingProvider: z.string().min(1, 'Shipping provider is required'),
  trackingUrl: z.string().url('Must be a valid URL').optional(),
})

export type OrderTrackingInput = z.infer<typeof orderTrackingSchema>

// ── Admin Notes ──────────────────────────────────────────────

export const orderNotesSchema = z.object({
  notes: z.string().max(2000).optional(),
})

export type OrderNotesInput = z.infer<typeof orderNotesSchema>

// ── Exchange (§9.4) ──────────────────────────────────────────

export const orderExchangeSchema = z.object({
  items: z
    .array(
      z.object({
        productVariantId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, 'At least one exchange item is required'),
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
})

export type OrderExchangeInput = z.infer<typeof orderExchangeSchema>

// ── Status Transition Map (server-side enforcement) ──────────

export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['EXCHANGED'],
  CANCELLED: ['REFUNDED'],
  REFUNDED: [],
  EXCHANGED: [],
}
