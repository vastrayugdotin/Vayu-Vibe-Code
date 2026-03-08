// ─────────────────────────────────────────────────────────────
// Vastrayug — Blog Validation Schemas
// Reference: admin_panel_spec.md §11
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ── Blog Post ────────────────────────────────────────────────

export const blogPostSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        SLUG_REGEX,
        "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
      ),
    body: z.string().min(1, "Body is required"),
    excerpt: z.string().max(500).optional(),
    featuredImageUrl: z.string().url().nullable().optional(),
    featuredImageAlt: z.string().max(200).optional(),
    blogCategoryId: z.string().nullable().optional(),
    authorId: z.string().min(1, "Author is required"),
    status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
    publishedAt: z.coerce.date().nullable().optional(),
    isFeatured: z.boolean().default(false),
    metaTitle: z
      .string()
      .max(60, "Meta title must be 60 characters or fewer")
      .optional(),
    metaDescription: z
      .string()
      .max(160, "Meta description must be 160 characters or fewer")
      .optional(),
    canonicalUrl: z.string().url("Must be a valid URL").optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.status === "SCHEDULED") return data.publishedAt != null;
      return true;
    },
    {
      message: "Published date is required for scheduled posts",
      path: ["publishedAt"],
    },
  );

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ── Blog Category ────────────────────────────────────────────

export const blogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      SLUG_REGEX,
      "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
    ),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;

// ── Blog Tag ─────────────────────────────────────────────────

export const blogTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      SLUG_REGEX,
      "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
    ),
});

export type BlogTagInput = z.infer<typeof blogTagSchema>;
