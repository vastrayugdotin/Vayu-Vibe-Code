// ─────────────────────────────────────────────────────────────
// Vastrayug — Category & Sub-Category Validation Schemas
// Reference: admin_panel_spec.md §7
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ── Category ─────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      SLUG_REGEX,
      "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
    ),
  description: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  metaTitle: z
    .string()
    .max(60, "Meta title must be 60 characters or fewer")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or fewer")
    .optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ── Sub-Category ─────────────────────────────────────────────

export const subCategorySchema = z.object({
  categoryId: z.string().min(1, "Parent category is required"),
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      SLUG_REGEX,
      "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
    ),
  description: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  metaTitle: z
    .string()
    .max(60, "Meta title must be 60 characters or fewer")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or fewer")
    .optional(),
});

export type SubCategoryInput = z.infer<typeof subCategorySchema>;
