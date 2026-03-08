import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "sun"
    | "moon"
    | "mars"
    | "mercury"
    | "jupiter"
    | "venus"
    | "saturn"
    | "rahu"
    | "ketu";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-gold focus:ring-offset-2",
          {
            "border-eclipse-silver/20 bg-eclipse-silver/10 text-stardust-white":
              variant === "default",
            "border-transparent bg-green-400/10 text-green-400":
              variant === "success",
            "border-transparent bg-yellow-400/10 text-yellow-400":
              variant === "warning",
            "border-transparent bg-red-400/10 text-red-400":
              variant === "error",
            "border-transparent bg-celestial-blue/10 text-celestial-blue":
              variant === "info",
            // Planets (placeholders, map to actual design tokens if specified)
            "border-transparent bg-orange-500/10 text-orange-500":
              variant === "sun",
            "border-transparent bg-gray-200/10 text-gray-200":
              variant === "moon",
            "border-transparent bg-red-600/10 text-red-600": variant === "mars",
            "border-transparent bg-emerald-500/10 text-emerald-500":
              variant === "mercury",
            "border-transparent bg-yellow-500/10 text-yellow-500":
              variant === "jupiter",
            "border-transparent bg-pink-400/10 text-pink-400":
              variant === "venus",
            "border-transparent bg-blue-900/30 text-blue-400":
              variant === "saturn",
            "border-transparent bg-zinc-700/30 text-zinc-300":
              variant === "rahu",
            "border-transparent bg-stone-500/20 text-stone-400":
              variant === "ketu",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
