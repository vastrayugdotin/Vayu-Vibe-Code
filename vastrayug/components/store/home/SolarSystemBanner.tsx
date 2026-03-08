'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Planets of Navagraha
const PLANETS = [
  { name: 'Surya', color: 'bg-surya-gold', size: 'w-8 h-8', orbit: '12rem', speed: 'orbit-fast' },
  { name: 'Chandra', color: 'bg-chandra-pearl', size: 'w-6 h-6', orbit: '16rem', speed: 'orbit-med' },
  { name: 'Mangal', color: 'bg-mangal-red', size: 'w-5 h-5', orbit: '20rem', speed: 'orbit-slow' },
  { name: 'Budh', color: 'bg-budh-emerald', size: 'w-4 h-4', orbit: '24rem', speed: 'orbit-fast' },
  { name: 'Guru', color: 'bg-guru-yellow', size: 'w-10 h-10', orbit: '28rem', speed: 'orbit-slow' },
  { name: 'Shukra', color: 'bg-shukra-blush', size: 'w-7 h-7', orbit: '32rem', speed: 'orbit-med' },
  { name: 'Shani', color: 'bg-shani-indigo', size: 'w-9 h-9', orbit: '36rem', speed: 'orbit-slow' },
  { name: 'Rahu', color: 'bg-rahu-violet', size: 'w-5 h-5', orbit: '40rem', speed: 'orbit-med' },
  { name: 'Ketu', color: 'bg-ketu-maroon', size: 'w-4 h-4', orbit: '44rem', speed: 'orbit-fast' },
]

export default function SolarSystemBanner() {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-cosmic-black flex items-center justify-center">
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
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 1 + 's',
                animationDelay: Math.random() * 2 + 's',
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Solar System */}
      {mounted && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 md:opacity-100 ${prefersReducedMotion ? 'opacity-30' : ''}`}>
          <div className="relative flex items-center justify-center scale-50 sm:scale-75 md:scale-100">
            {/* The Sun (Center) */}
            <div className="absolute w-16 h-16 rounded-full bg-nebula-gold animate-pulse-glow shadow-gold-glow z-10" />

            {/* Orbital Rings & Planets */}
            {PLANETS.map((planet, index) => {
              // Extract the numeric value from rem (e.g., '12rem' -> 12)
              const orbitSize = parseFloat(planet.orbit) * 16

              return (
                <div key={planet.name} className="absolute flex items-center justify-center">
                  {/* Orbit Ring */}
                  <div
                    className="absolute border border-white/5 rounded-full"
                    style={{
                      width: `${orbitSize * 2}px`,
                      height: `${orbitSize * 2}px`,
                    }}
                  />

                  {/* Planet Container - Handles Rotation */}
                  {!prefersReducedMotion ? (
                    <div
                      className={`absolute w-full h-full animate-${planet.speed}`}
                      style={{
                        animationDelay: `-${Math.random() * 60}s`, // Random start position
                      }}
                    >
                      {/* The Planet itself */}
                      <div
                        className={`absolute rounded-full ${planet.color} ${planet.size} shadow-cosmic`}
                        style={{
                          left: '50%',
                          top: 0,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent" />
                      </div>
                    </div>
                  ) : (
                    /* Static fallback for reduced motion */
                    <div
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${index * 40}deg)`,
                      }}
                    >
                      <div
                        className={`absolute rounded-full ${planet.color} ${planet.size} shadow-cosmic`}
                        style={{
                          left: '50%',
                          top: 0,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="font-heading text-display-md md:text-display-lg lg:text-display-xl text-stardust-white mb-6 tracking-wide drop-shadow-lg">
          Wear Your <span className="text-transparent bg-clip-text bg-gold-gradient">Cosmic Identity</span>
        </h1>
        <p className="font-accent text-xl md:text-2xl text-eclipse-silver mb-10 italic max-w-2xl drop-shadow-md">
          Your ruling planet chose you. Now wear it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/collections"
            className="px-8 py-4 bg-nebula-gold text-cosmic-black font-body font-semibold rounded-none tracking-widest uppercase hover:bg-stardust-white transition-colors duration-300"
          >
            Explore Planets
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 bg-transparent text-stardust-white border border-white/20 font-body font-semibold rounded-none tracking-widest uppercase hover:border-nebula-gold hover:text-nebula-gold transition-colors duration-300 backdrop-blur-sm"
          >
            Shop All
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stardust-white/50 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-stardust-white/50 to-transparent mx-auto" />
      </div>
    </section>
  )
}