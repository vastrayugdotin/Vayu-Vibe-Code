// ─────────────────────────────────────────────────────────────
// Vastrayug — Collection Validation Schemas
// Reference: admin_panel_spec.md §8.2
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

export const collectionSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        SLUG_REGEX,
        "Slug must be URL-safe (lowercase letters, numbers, hyphens)",
      ),
    type: z.enum(["PLANETARY", "ZODIAC", "NUMEROLOGY", "VIBE", "RITUAL"]),
    description: z.string().optional(),
    imageUrl: z.string().url().nullable().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
    metaTitle: z
      .string()
      .max(60, "Meta title must be 60 characters or fewer")
      .optional(),
    metaDescription: z
      .string()
      .max(160, "Meta description must be 160 characters or fewer")
      .optional(),

    // Conditional fields — shown based on `type`
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
    colourPaletteJson: z.unknown().nullable().optional(),

    // Product assignment
    productIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "PLANETARY") return data.planet != null;
      return true;
    },
    {
      message: "Planet is required for Planetary collections",
      path: ["planet"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "ZODIAC") return data.zodiacSign != null;
      return true;
    },
    {
      message: "Zodiac sign is required for Zodiac collections",
      path: ["zodiacSign"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "NUMEROLOGY") return data.lifePathNumber != null;
      return true;
    },
    {
      message: "Life path number is required for Numerology collections",
      path: ["lifePathNumber"],
    },
  );

export type CollectionInput = z.infer<typeof collectionSchema>;
