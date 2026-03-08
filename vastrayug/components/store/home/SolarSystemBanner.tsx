"use client";

import * as React from "react";
import Link from "next/link";

const PLANETS = [
  {
    name: "Sun (Surya)",
    radius: "16vmin",
    size: "w-8 h-8",
    color: "bg-surya-gold",
    animation: "animate-orbit-fast",
    startAngle: "0deg",
  },
  {
    name: "Moon (Chandra)",
    radius: "20vmin",
    size: "w-6 h-6",
    color: "bg-chandra-pearl",
    animation: "animate-orbit-med",
    startAngle: "40deg",
  },
  {
    name: "Mars (Mangal)",
    radius: "24vmin",
    size: "w-5 h-5",
    color: "bg-mangal-red",
    animation: "animate-orbit-slow",
    startAngle: "80deg",
  },
  {
    name: "Mercury (Budh)",
    radius: "28vmin",
    size: "w-4 h-4",
    color: "bg-budh-emerald",
    animation: "animate-orbit-fast",
    startAngle: "120deg",
  },
  {
    name: "Jupiter (Guru)",
    radius: "32vmin",
    size: "w-10 h-10",
    color: "bg-guru-yellow",
    animation: "animate-orbit-slow",
    startAngle: "160deg",
  },
  {
    name: "Venus (Shukra)",
    radius: "36vmin",
    size: "w-7 h-7",
    color: "bg-shukra-blush",
    animation: "animate-orbit-med",
    startAngle: "200deg",
  },
  {
    name: "Saturn (Shani)",
    radius: "40vmin",
    size: "w-9 h-9",
    color: "bg-shani-indigo",
    animation: "animate-orbit-slow",
    startAngle: "240deg",
  },
  {
    name: "Rahu",
    radius: "44vmin",
    size: "w-5 h-5",
    color: "bg-rahu-violet",
    animation: "animate-orbit-med",
    startAngle: "280deg",
  },
  {
    name: "Ketu",
    radius: "48vmin",
    size: "w-4 h-4",
    color: "bg-ketu-maroon",
    animation: "animate-orbit-fast",
    startAngle: "320deg",
  },
];

export default function SolarSystemBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative flex h-[90vh] min-h-[600px] w-full items-center justify-center overflow-hidden bg-cosmic-black">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-deep-indigo/30 via-cosmic-black to-void-black" />

      {/* Stars - rendered only on client to avoid hydration mismatch */}
      {mounted && !prefersReducedMotion && (
        <div className="absolute inset-0 opacity-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-stardust-white animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDuration: Math.random() * 3 + 1 + "s",
                animationDelay: Math.random() * 2 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Solar System */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 md:opacity-100 ${
          prefersReducedMotion ? "opacity-30" : ""
        }`}
      >
        <div className="relative flex items-center justify-center scale-50 sm:scale-75 md:scale-100">
          {/* The Sun (Center) */}
          <div className="absolute z-10 h-16 w-16 animate-pulse-glow rounded-full bg-nebula-gold shadow-gold-glow" />

          {/* Orbital Rings & Planets */}
          {PLANETS.map((planet) => (
            <React.Fragment key={planet.name}>
              {/* Orbit Ring */}
              <div
                className="absolute rounded-full border border-white/5"
                style={{
                  width: `calc(${planet.radius} * 2)`,
                  height: `calc(${planet.radius} * 2)`,
                }}
              />

              {/* Orbiting Planet Container - Handles Rotation */}
              {!prefersReducedMotion ? (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${planet.animation}`}
                  style={
                    {
                      "--orbit-radius": planet.radius,
                      willChange: "transform",
                      animationDelay: `-${Math.random() * 60}s`, // Random start position
                    } as React.CSSProperties
                  }
                >
                  {/* The Planet itself */}
                  <div
                    className={`rounded-full shadow-cosmic ${planet.color} ${planet.size}`}
                    title={planet.name}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent" />
                  </div>
                </div>
              ) : (
                /* Static fallback for reduced motion */
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={
                    {
                      transform: `rotate(${planet.startAngle}) translateX(${planet.radius})`,
                      willChange: "transform",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`rounded-full shadow-cosmic ${planet.color} ${planet.size}`}
                    title={planet.name}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center px-4 text-center">
        <h1 className="mb-6 font-heading text-display-md leading-tight tracking-wide text-stardust-white drop-shadow-lg md:text-display-lg lg:text-display-xl">
          Wear Your{" "}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Cosmic Identity
          </span>
        </h1>
        <p className="mb-10 max-w-2xl font-accent text-xl italic text-eclipse-silver drop-shadow-md md:text-2xl">
          Your ruling planet chose you. Now wear it.
        </p>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/collection"
            className="bg-nebula-gold px-8 py-4 font-body font-semibold uppercase tracking-widest text-cosmic-black transition-colors duration-300 hover:bg-stardust-white"
          >
            Explore Planets
          </Link>
          <Link
            href="/shop"
            className="border border-white/20 bg-transparent px-8 py-4 font-body font-semibold uppercase tracking-widest text-stardust-white backdrop-blur-sm transition-colors duration-300 hover:border-nebula-gold hover:text-nebula-gold"
          >
            Shop All
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-stardust-white/50">
        <div className="mx-auto h-12 w-[1px] bg-gradient-to-b from-stardust-white/50 to-transparent" />
      </div>
    </section>
  );
}
