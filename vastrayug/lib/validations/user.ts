// ─────────────────────────────────────────────────────────────
// Vastrayug — User Validation Schemas
// Reference: admin_panel_spec.md §10
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── Status Toggle (§10.2) ────────────────────────────────────

export const userStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
})

export type UserStatusInput = z.infer<typeof userStatusSchema>

// ── Role Change (§10.2 — SUPER_ADMIN only) ───────────────────

export const userRoleSchema = z.object({
  role: z.enum(['CUSTOMER', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'SUPER_ADMIN']),
})

export type UserRoleInput = z.infer<typeof userRoleSchema>
