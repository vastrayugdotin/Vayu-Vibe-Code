import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface CosmicMetadataProps {
  planet?: string;
  zodiacSign?: string;
  lifePathNumber?: number;
  emotionalIntention?: string;
  className?: string;
}

const PLANET_COLORS: Record<string, string> = {
  SUN: "border-[#D4A017] text-[#D4A017] bg-[#D4A017]/5",
  MOON: "border-[#C0C0C0] text-[#F4F1EC] bg-[#C0C0C0]/5",
  MARS: "border-[#8B0000] text-[#8B0000] bg-[#8B0000]/5",
  MERCURY: "border-[#50C878] text-[#50C878] bg-[#50C878]/5",
  JUPITER: "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5",
  VENUS: "border-[#B76E79] text-[#FFB6C1] bg-[#B76E79]/5",
  SATURN: "border-[#4B0082] text-[#4B0082] bg-[#4B0082]/5",
  RAHU: "border-[#808080] text-[#808080] bg-[#808080]/5",
  KETU: "border-[#800000] text-[#E8E8E0] bg-[#800000]/5",
};

export default function CosmicMetadata({
  planet,
  zodiacSign,
  lifePathNumber,
  emotionalIntention,
  className,
}: CosmicMetadataProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {planet && (
          <Badge
            variant="default"
            className={cn(
              "px-3 py-1 uppercase tracking-widest text-[10px] border",
              PLANET_COLORS[planet.toUpperCase()] || "border-nebula-gold text-nebula-gold bg-nebula-gold/5"
            )}
          >
            Planet: {planet}
          </Badge>
        )}

        {zodiacSign && (
          <Badge
            variant="default"
            className="px-3 py-1 uppercase tracking-widest text-[10px] border-white/20 text-stardust-white bg-white/5"
          >
            Zodiac: {zodiacSign}
          </Badge>
        )}

        {lifePathNumber && (
          <Badge
            variant="default"
            className="px-3 py-1 uppercase tracking-widest text-[10px] border-white/20 text-stardust-white bg-white/5"
          >
            Life Path: {lifePathNumber}
          </Badge>
        )}
      </div>

      {emotionalIntention && (
        <p className="font-accent italic text-sm text-eclipse-silver/80">
          Intention: &quot;{emotionalIntention}&quot;
        </p>
      )}
    </div>
  );
}
