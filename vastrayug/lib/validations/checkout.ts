// ─────────────────────────────────────────────────────────────
// Vastrayug — Checkout Validation Schemas
// Reference: admin_panel_spec.md §9.2, prd_new.md checkout flow
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

// ── Shipping Address ─────────────────────────────────────────

export const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().min(1, "Address line 1 is required").max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("IN"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ── Coupon Application ───────────────────────────────────────

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Enter a coupon code").toUpperCase(),
});

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;

// ── Checkout Initiation ──────────────────────────────────────

export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Select a shipping address"),
  couponCode: z.string().toUpperCase().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ── Payment Verification ─────────────────────────────────────

export const paymentVerificationSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type PaymentVerificationInput = z.infer<
  typeof paymentVerificationSchema
>;
