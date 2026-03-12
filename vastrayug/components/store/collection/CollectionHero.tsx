import * as React from "react";
import { cn } from "@/lib/utils";

interface CollectionHeroProps {
  name: string;
  description?: string | null;
  type: string;
  planet?: string | null;
}

/**
 * PLANET_ACCENTS mapping based on Brand_values_and_vision.md §9
 */
const PLANET_ACCENTS: Record<string, { text: string; bg: string; glow: string }> = {
  SUN: {
    text: "text-[#D4A017]",
    bg: "bg-[#D4A017]",
    glow: "from-[#D4A017]/20 to-transparent",
  },
  MOON: {
    text: "text-[#F4F1EC]",
    bg: "bg-[#F4F1EC]",
    glow: "from-[#C0C0C0]/20 to-transparent",
  },
  MARS: {
    text: "text-[#8B0000]",
    bg: "bg-[#8B0000]",
    glow: "from-[#8B0000]/20 to-transparent",
  },
  MERCURY: {
    text: "text-[#50C878]",
    bg: "bg-[#50C878]",
    glow: "from-[#50C878]/20 to-transparent",
  },
  JUPITER: {
    text: "text-[#C9A84C]",
    bg: "bg-[#C9A84C]",
    glow: "from-[#C9A84C]/20 to-transparent",
  },
  VENUS: {
    text: "text-[#FFB6C1]",
    bg: "bg-[#FFB6C1]",
    glow: "from-[#B76E79]/20 to-transparent",
  },
  SATURN: {
    text: "text-[#4B0082]",
    bg: "bg-[#4B0082]",
    glow: "from-[#191970]/20 to-transparent",
  },
  RAHU: {
    text: "text-[#808080]",
    bg: "bg-[#808080]",
    glow: "from-[#1C1C1C]/20 to-transparent",
  },
  KETU: {
    text: "text-[#E8E8E0]",
    bg: "bg-[#E8E8E0]",
    glow: "from-[#800000]/20 to-transparent",
  },
};

/**
 * CollectionHero — Step 4.6o
 * Full-width hero banner for collection pages with dynamic planetary accents.
 * Reference: Brand_values_and_vision.md §9
 */
export default function CollectionHero({
  name,
  description,
  type,
  planet,
}: CollectionHeroProps) {
  const accent = planet ? PLANET_ACCENTS[planet.toUpperCase()] : null;

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-void-black py-20 md:py-32">
      {/* Dynamic Cosmic Glow Backdrop */}
      <div
        className={cn(
          "absolute left-1/2 top-0 h-[500px] w-full max-w-5xl -translate-x-1/2 rounded-full opacity-20 blur-[120px] bg-gradient-to-b",
          accent ? accent.glow : "from-nebula-gold/10 to-transparent"
        )}
        aria-hidden="true"
      />

      {/* Decorative Planet/Vibe Motif (Simple CSS decoration) */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 opacity-5 hidden lg:block">
        <div className={cn(
          "h-64 w-64 rounded-full border border-dashed animate-[spin_60s_linear_infinite]",
          accent ? `border-${accent.text.split('-')[1]}` : "border-nebula-gold"
        )} />
        <div className={cn(
          "absolute inset-8 rounded-full border border-white/20",
        )} />
      </div>

      <div className="relative z-10 mx-auto container max-w-5xl px-4 text-center">
        {/* Category/Type Tag */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className={cn("h-px w-8", accent ? accent.bg : "bg-nebula-gold")} />
          <span
            className={cn(
              "font-body text-[10px] uppercase tracking-[0.4em]",
              accent ? accent.text : "text-nebula-gold"
            )}
          >
            {type === "PLANETARY" && planet ? `${planet} Alignment` : type}
          </span>
          <div className={cn("h-px w-8", accent ? accent.bg : "bg-nebula-gold")} />
        </div>

        {/* Collection Title */}
        <h1 className="mb-8 font-heading text-display-md text-stardust-white md:text-display-lg leading-none tracking-tighter">
          {name}
        </h1>

        {/* Description */}
        {description && (
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-eclipse-silver/80 italic">
            &quot;{description}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
