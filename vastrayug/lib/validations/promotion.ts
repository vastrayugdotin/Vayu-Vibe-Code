// ─────────────────────────────────────────────────────────────
// Vastrayug — Promotion Validation Schemas
// Reference: admin_panel_spec.md §13
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

export const promotionSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    discountType: z.enum(['PERCENTAGE', 'FLAT']),
    discountValue: z.number().positive('Discount value must be greater than 0'),
    applicability: z.enum(['SITE_WIDE', 'CATEGORY', 'PRODUCT']),
    applicableIdsJson: z.array(z.string()).optional(),
    autoApply: z.boolean().default(true),
    promoCode: z
      .string()
      .max(30)
      .toUpperCase()
      .regex(/^[A-Z0-9_-]*$/, 'Code may only contain letters, numbers, hyphens, and underscores')
      .optional(),
    startDate: z.coerce.date({ required_error: 'Start date is required' }),
    endDate: z.coerce.date({ required_error: 'End date is required' }),
    isActive: z.boolean().default(false),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      if (!data.autoApply) return !!data.promoCode
      return true
    },
    { message: 'Promo code is required when auto-apply is off', path: ['promoCode'] }
  )
  .refine(
    (data) => {
      if (data.applicability !== 'SITE_WIDE') {
        return data.applicableIdsJson && data.applicableIdsJson.length > 0
      }
      return true
    },
    { message: 'Select at least one applicable item', path: ['applicableIdsJson'] }
  )
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE') return data.discountValue <= 100
      return true
    },
    { message: 'Percentage discount cannot exceed 100%', path: ['discountValue'] }
  )

export type PromotionInput = z.infer<typeof promotionSchema>
