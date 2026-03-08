import * as React from "react";
import { cn } from "@/lib/utils";

interface CollectionHeroProps {
  name: string;
  description?: string | null;
  type: string;
  planet?: string | null;
  accentTextClass?: string;
  accentBgClass?: string;
}

export default function CollectionHero({
  name,
  description,
  type,
  planet,
  accentTextClass = "text-nebula-gold",
  accentBgClass = "bg-nebula-gold",
}: CollectionHeroProps) {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-void-black py-16 md:py-24">
      {/* Subtle accent glow back layer based on planet */}
      <div
        className={cn(
          "absolute left-1/2 top-0 h-full w-full max-w-4xl -translate-x-1/2 rounded-full opacity-5 blur-[100px]",
          accentBgClass,
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto container max-w-4xl px-4 text-center">
        <span
          className={cn(
            "mb-4 block font-body text-xs uppercase tracking-widest",
            accentTextClass,
          )}
        >
          {type === "PLANETARY" && planet ? `${planet} Energy` : type}
        </span>

        <h1 className="mb-6 font-heading text-display-sm text-stardust-white md:text-display-md">
          {name}
        </h1>

        {description && (
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-eclipse-silver">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
