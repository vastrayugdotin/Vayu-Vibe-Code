// ─────────────────────────────────────────────────────────────
// Vastrayug — Database Seed Script
// Creates: Super Admin, Categories, Collections, Default Settings
// Reference: admin_panel_spec.md §3, §7.2, §8.3, §16
// Run: npx prisma db seed
// ─────────────────────────────────────────────────────────────

import { PrismaClient, NavagrahaPlanet } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌌 Seeding Vastrayug database...\n");

  // ═══════════════════════════════════════════════════════════
  // 1. SUPER ADMIN ACCOUNT
  //    admin_panel_spec.md §3 — Default Admin Account
  // ═══════════════════════════════════════════════════════════

  const passwordHash = await bcrypt.hash("admin", 12);

  const admin = await prisma.user.upsert({
    where: { email: "vastrayug.in@gmail.com" },
    update: {},
    create: {
      email: "vastrayug.in@gmail.com",
      passwordHash,
      name: "Vastrayug Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Super Admin created: ${admin.email} (role: ${admin.role})`);

  // ═══════════════════════════════════════════════════════════
  // 2. CATEGORIES
  //    admin_panel_spec.md §7.2 — Seed Data (Phase 1)
  // ═══════════════════════════════════════════════════════════

  const categories = [
    { name: "Oversized Tees", slug: "oversized-tees", sortOrder: 1 },
    { name: "Hoodies", slug: "hoodies", sortOrder: 2 },
    { name: "Co-ord Sets", slug: "co-ord-sets", sortOrder: 3 },
    { name: "Joggers", slug: "joggers", sortOrder: 4 },
    { name: "Jackets", slug: "jackets", sortOrder: 5 },
    { name: "Kurtas", slug: "kurtas", sortOrder: 6 },
    { name: "Accessories", slug: "accessories", sortOrder: 7 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log(`✅ ${categories.length} categories seeded`);

  // ═══════════════════════════════════════════════════════════
  // 3. COLLECTIONS
  //    admin_panel_spec.md §8.3 — Seed Data (Phase 1)
  //    4 Planetary + 5 Vibe collections
  // ═══════════════════════════════════════════════════════════

  const planetaryCollections = [
    {
      name: "Sun — Surya Collection",
      slug: "surya-collection",
      type: "PLANETARY" as const,
      planet: NavagrahaPlanet.SUN,
      description:
        "Radiant garments channelling the sovereign energy of Surya — warmth, authority, and self-expression.",
      colourPaletteJson: {
        primary: "#D4A017",
        secondary: "#F4622C",
        accent: "#FADA5E",
      },
      sortOrder: 1,
    },
    {
      name: "Moon — Chandra Collection",
      slug: "chandra-collection",
      type: "PLANETARY" as const,
      planet: NavagrahaPlanet.MOON,
      description:
        "Ethereal pieces reflecting the nurturing glow of Chandra — intuition, calm, and emotional depth.",
      colourPaletteJson: {
        primary: "#F8F4EC",
        secondary: "#B8D4E3",
        accent: "#C9A84C",
      },
      sortOrder: 2,
    },
    {
      name: "Saturn — Shani Collection",
      slug: "shani-collection",
      type: "PLANETARY" as const,
      planet: NavagrahaPlanet.SATURN,
      description:
        "Structured designs embodying the discipline of Shani — resilience, justice, and karmic wisdom.",
      colourPaletteJson: {
        primary: "#191970",
        secondary: "#0A0A0F",
        accent: "#A8A9AD",
      },
      sortOrder: 3,
    },
    {
      name: "Jupiter — Guru Collection",
      slug: "guru-collection",
      type: "PLANETARY" as const,
      planet: NavagrahaPlanet.JUPITER,
      description:
        "Expansive silhouettes inspired by the wisdom of Guru — growth, abundance, and spiritual knowledge.",
      colourPaletteJson: {
        primary: "#FADA5E",
        secondary: "#C9A84C",
        accent: "#1B1640",
      },
      sortOrder: 4,
    },
  ];

  const vibeCollections = [
    {
      name: "The Sovereign",
      slug: "the-sovereign",
      type: "VIBE" as const,
      description:
        "For those who lead with quiet confidence. Regal tones, structured fits, bold presence.",
      sortOrder: 5,
    },
    {
      name: "The Healer",
      slug: "the-healer",
      type: "VIBE" as const,
      description:
        "Gentle fabrics and calming hues for the nurturers. Comfort meets cosmic intention.",
      sortOrder: 6,
    },
    {
      name: "The Wanderer",
      slug: "the-wanderer",
      type: "VIBE" as const,
      description:
        "Free-spirited designs for the seekers. Movement, adventure, boundless expression.",
      sortOrder: 7,
    },
    {
      name: "The Shadow",
      slug: "the-shadow",
      type: "VIBE" as const,
      description:
        "Embrace the depth within. Dark palettes, mysterious textures, introspective elegance.",
      sortOrder: 8,
    },
    {
      name: "The Reborn",
      slug: "the-reborn",
      type: "VIBE" as const,
      description:
        "Transformation made visible. Fresh starts, evolving silhouettes, new cosmic chapter.",
      sortOrder: 9,
    },
  ];

  for (const col of planetaryCollections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });
  }

  for (const col of vibeCollections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        ...col,
        planet: null,
        colourPaletteJson: {},
      },
    });
  }

  console.log(
    `✅ ${planetaryCollections.length + vibeCollections.length} collections seeded (${planetaryCollections.length} planetary + ${vibeCollections.length} vibe)`,
  );

  // ═══════════════════════════════════════════════════════════
  // 4. DEFAULT SETTINGS
  //    admin_panel_spec.md §16 — Settings key-value rows
  // ═══════════════════════════════════════════════════════════

  const defaultSettings: { key: string; value: string }[] = [
    // Tab: Store Information
    { key: "store_name", value: "Vastrayug" },
    { key: "store_logo_url", value: "" },
    { key: "store_favicon_url", value: "" },
    { key: "contact_email", value: "vastrayug.in@gmail.com" },
    { key: "contact_phone", value: "" },
    {
      key: "social_links",
      value: JSON.stringify({
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
      }),
    },

    // Tab: Shipping
    {
      key: "shipping_config",
      value: JSON.stringify({
        zones: [{ name: "All India", rate: 0, freeAbove: 999 }],
        defaultRate: 99,
        freeShippingThreshold: 999,
      }),
    },

    // Tab: Tax
    {
      key: "tax_config",
      value: JSON.stringify({
        rate: 0,
        inclusive: true,
      }),
    },

    // Tab: Payment
    { key: "razorpay_key_id", value: "" },
    { key: "razorpay_mode", value: "test" },

    // Tab: Email
    { key: "sendgrid_api_key", value: "" },
    {
      key: "email_templates",
      value: JSON.stringify({
        order_confirm: "",
        shipping_update: "",
        out_for_delivery: "",
        delivered: "",
        password_reset: "",
        newsletter_welcome: "",
        exchange_confirm: "",
      }),
    },

    // Tab: Tracking & Analytics
    { key: "gtm_container_id", value: "" },
    { key: "meta_pixel_id", value: "" },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ ${defaultSettings.length} default settings seeded`);

  // ═══════════════════════════════════════════════════════════
  console.log("\n🚀 Vastrayug database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
