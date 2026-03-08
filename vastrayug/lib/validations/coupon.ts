// ─────────────────────────────────────────────────────────────
// Vastrayug — Coupon Validation Schemas
// Reference: admin_panel_spec.md §12.2
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .max(30)
      .toUpperCase()
      .regex(
        /^[A-Z0-9_-]+$/,
        "Code may only contain letters, numbers, hyphens, and underscores",
      ),
    description: z.string().max(200).optional(),
    discountType: z.enum(["PERCENTAGE", "FLAT"]),
    discountValue: z.number().positive("Discount value must be greater than 0"),
    minOrderValue: z.number().min(0).default(0),
    maxDiscount: z
      .number()
      .positive("Max discount must be greater than 0")
      .nullable()
      .optional(),
    usageLimit: z.number().int().positive().nullable().optional(),
    perUserLimit: z.number().int().positive().default(1),
    validFrom: z.coerce.date({ required_error: "Start date is required" }),
    validUntil: z.coerce.date({ required_error: "End date is required" }),
    applicability: z.enum(["SITE_WIDE", "CATEGORY", "PRODUCT"]),
    applicableIdsJson: z.array(z.string()).optional(),
    firstOrderOnly: z.boolean().default(false),
    isStackable: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.validUntil > data.validFrom, {
    message: "End date must be after start date",
    path: ["validUntil"],
  })
  .refine(
    (data) => {
      if (data.applicability !== "SITE_WIDE") {
        return data.applicableIdsJson && data.applicableIdsJson.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one applicable item",
      path: ["applicableIdsJson"],
    },
  )
  .refine(
    (data) => {
      if (data.discountType === "PERCENTAGE") {
        return data.discountValue <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  );

export type CouponInput = z.infer<typeof couponSchema>;
