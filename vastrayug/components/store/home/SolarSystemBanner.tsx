"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PLANETS = [
  { name: "Sun", slug: "sun", color: "bg-surya-gold", radius: "16vmin", size: "w-8 h-8", animation: "animate-orbit-fast" },
  { name: "Moon", slug: "moon", color: "bg-chandra-pearl", radius: "20vmin", size: "w-6 h-6", animation: "animate-orbit-med" },
  { name: "Mars", slug: "mars", color: "bg-mangal-red", radius: "24vmin", size: "w-5 h-5", animation: "animate-orbit-slow" },
  { name: "Mercury", slug: "mercury", color: "bg-budh-emerald", radius: "28vmin", size: "w-4 h-4", animation: "animate-orbit-fast" },
  { name: "Jupiter", slug: "jupiter", color: "bg-guru-yellow", radius: "32vmin", size: "w-10 h-10", animation: "animate-orbit-slow" },
  { name: "Venus", slug: "venus", color: "bg-shukra-blush", radius: "36vmin", size: "w-7 h-7", animation: "animate-orbit-med" },
  { name: "Saturn", slug: "saturn", color: "bg-shani-indigo", radius: "40vmin", size: "w-9 h-9", animation: "animate-orbit-slow" },
  { name: "Rahu", slug: "rahu", color: "bg-rahu-violet", radius: "44vmin", size: "w-5 h-5", animation: "animate-orbit-med" },
  { name: "Ketu", slug: "ketu", color: "bg-ketu-maroon", radius: "48vmin", size: "w-4 h-4", animation: "animate-orbit-fast" },
];

export default function SolarSystemBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredPlanet, setHoveredPlanet] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative flex h-[95vh] min-h-[700px] w-full items-center justify-center overflow-hidden bg-cosmic-black">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-indigo/20 via-cosmic-black to-void-black" />

      {/* Star Field */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-stardust-white animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.2,
                animationDuration: Math.random() * 3 + 2 + "s",
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* CSS-Animated Solar System */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[0.6] sm:scale-[0.8] md:scale-100 lg:scale-110">
        <div className="relative flex items-center justify-center">
          {/* Central Sun */}
          <div className="absolute z-10 h-24 w-24 rounded-full bg-surya-gold shadow-[0_0_80px_rgba(201,168,76,0.6)] animate-pulse-glow" />

          {PLANETS.map((planet, i) => (
            <React.Fragment key={planet.name}>
              {/* Orbital Path */}
              <div
                className="absolute rounded-full border border-white/[0.03]"
                style={{
                  width: `calc(${planet.radius} * 2)`,
                  height: `calc(${planet.radius} * 2)`,
                }}
              />

              {/* Orbiting Body */}
              <div
                className={cn("absolute inset-0 flex items-center justify-center", planet.animation)}
                style={{
                  animationDelay: `-${(i * 1234) % 60}s`,
                  willChange: "transform"
                } as React.CSSProperties}
              >
                <div
                  className={cn(
                    "rounded-full shadow-cosmic transition-transform duration-500",
                    planet.color,
                    planet.size,
                    hoveredPlanet === planet.name ? "scale-150" : ""
                  )}
                  style={{ transform: `translateX(${planet.radius})` }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent" />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex max-w-4xl flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-4 block font-body text-xs uppercase tracking-[0.4em] text-nebula-gold">
            Estd. 2026 • Astrology Focused Luxury
          </span>
          <h1 className="mb-6 font-heading text-display-md leading-[1.1] tracking-tight text-stardust-white md:text-display-lg lg:text-display-xl">
            Wear Your <br />
            <span className="italic text-nebula-gold font-accent">Cosmic Identity</span>
          </h1>
          <p className="mb-12 max-w-xl mx-auto font-body text-lg text-eclipse-silver leading-relaxed">
            Premium apparel engineered for your planetary frequency.
            Step into the era of intentional dressing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-stardust-white px-10 py-4 font-body text-sm font-bold uppercase tracking-widest text-cosmic-black transition-all hover:pr-12"
            >
              <span className="relative z-10">Shop Catalogue</span>
              <div className="absolute right-4 translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                →
              </div>
            </Link>
            <Link
              href="/collection"
              className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-stardust-white underline underline-offset-8 transition-colors hover:text-nebula-gold"
            >
              Explore Planets
            </Link>
          </div>
        </motion.div>

        {/* Planet Quick-Nav */}
        <div className="mt-20 hidden md:flex items-center gap-8 border-t border-white/5 pt-10">
          {PLANETS.slice(0, 7).map((planet) => (
            <Link
              key={planet.name}
              href={`/collection/${planet.slug}`}
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className="group flex flex-col items-center gap-3"
            >
              <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:scale-[2.5]", planet.color)} />
              <span className="font-body text-[10px] uppercase tracking-widest text-eclipse-silver transition-colors group-hover:text-stardust-white">
                {planet.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Animated Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <div className="h-10 w-[1px] bg-gradient-to-b from-stardust-white to-transparent animate-pulse" />
      </div>
    </section>
  );
}
