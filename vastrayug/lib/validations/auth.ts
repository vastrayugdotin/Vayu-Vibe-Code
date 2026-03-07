// ─────────────────────────────────────────────────────────────
// Vastrayug — Auth Validation Schemas
// Reference: admin_panel_spec.md §10.3, tech_stack.md §5
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── Login ────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ── Registration ─────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// ── Password Change (§10.3) ──────────────────────────────────

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmNewPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  })

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

// ── Admin Profile Update (§10.3) ─────────────────────────────

export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .nullable()
    .optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
