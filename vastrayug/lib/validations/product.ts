// ─────────────────────────────────────────────────────────────
// Vastrayug — Product Validation Schemas
// Reference: admin_panel_spec.md §6.2
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

// ── Product Variant ──────────────────────────────────────────

export const productVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  colour: z.string().optional(),
  sku: z.string().min(1, "Variant SKU is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  priceOverride: z
    .number()
    .positive("Price must be greater than 0")
    .multipleOf(0.01)
    .nullable()
    .optional(),
  isActive: z.boolean().default(true),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// ── Product Image ────────────────────────────────────────────

export const productImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

// ── Product ──────────────────────────────────────────────────

export const productSchema = z
  .object({
    // Section 1 — Basic Info
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        SLUG_REGEX,
        "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
      ),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    featured: z.boolean().default(false),

    // Section 2 — Pricing & Inventory
    price: z.number().positive("Price must be greater than 0").multipleOf(0.01),
    compareAtPrice: z
      .number()
      .positive("Compare-at price must be greater than 0")
      .multipleOf(0.01)
      .nullable()
      .optional(),
    sku: z.string().min(1, "SKU is required"),
    stock: z.number().int().min(0, "Stock cannot be negative"),

    // Section 3 — Images
    images: z.array(productImageSchema).optional(),

    // Section 4 — Variants
    variants: z.array(productVariantSchema).optional(),

    // Section 5 — Categorisation
    categoryId: z.string().min(1, "Category is required"),
    subCategoryId: z.string().nullable().optional(),
    collectionIds: z.array(z.string()).optional(),

    // Section 6 — Cosmic Metadata
    planet: z
      .enum([
        "SUN",
        "MOON",
        "MARS",
        "MERCURY",
        "JUPITER",
        "VENUS",
        "SATURN",
        "RAHU",
        "KETU",
      ])
      .nullable()
      .optional(),
    zodiacSign: z
      .enum([
        "ARIES",
        "TAURUS",
        "GEMINI",
        "CANCER",
        "LEO",
        "VIRGO",
        "LIBRA",
        "SCORPIO",
        "SAGITTARIUS",
        "CAPRICORN",
        "AQUARIUS",
        "PISCES",
      ])
      .nullable()
      .optional(),
    lifePathNumber: z
      .number()
      .int()
      .refine(
        (n) =>
          LIFE_PATH_NUMBERS.includes(n as (typeof LIFE_PATH_NUMBERS)[number]),
        {
          message: "Must be 1–9, 11, 22, or 33",
        },
      )
      .nullable()
      .optional(),
    emotionalIntention: z.string().nullable().optional(),
    tags: z.string().nullable().optional(),

    // Section 7 — SEO
    metaTitle: z
      .string()
      .max(60, "Meta title must be 60 characters or fewer")
      .optional(),
    metaDescription: z
      .string()
      .max(160, "Meta description must be 160 characters or fewer")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.compareAtPrice != null) {
        return data.compareAtPrice > data.price;
      }
      return true;
    },
    {
      message: "Compare-at price must be greater than the selling price",
      path: ["compareAtPrice"],
    },
  );

export type ProductInput = z.infer<typeof productSchema>;

// ── Bulk Update ──────────────────────────────────────────────

export const productBulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, "Select at least one product"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().optional(),
});

export type ProductBulkUpdateInput = z.infer<typeof productBulkUpdateSchema>;
