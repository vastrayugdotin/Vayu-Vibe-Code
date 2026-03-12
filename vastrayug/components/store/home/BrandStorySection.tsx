"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandStorySection() {
  return (
    <section className="relative my-32 overflow-hidden px-6 py-24 text-center md:px-12 md:py-32">
      {/* Decorative Glows */}
      <div className="absolute left-0 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-nebula-gold/5 blur-[100px]" />
      <div className="absolute right-0 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-deep-indigo/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-nebula-gold/30" />
          <span className="text-2xl text-nebula-gold">✦</span>
          <div className="h-[1px] w-12 bg-nebula-gold/30" />
        </div>

        <h2 className="mb-12 font-heading text-4xl leading-[1.1] tracking-tight text-stardust-white md:text-5xl lg:text-6xl">
          The Era of <br />
          <span className="italic font-accent text-nebula-gold">Cosmic Dressing</span>
        </h2>

        <div className="mx-auto max-w-2xl space-y-8 font-body text-lg leading-relaxed text-eclipse-silver md:text-xl">
          <p>
            Vastrayug is built on a single, immutable truth: <span className="text-stardust-white">clothing is not neutral.</span> The colors touching your skin, the geometry near your heart, and the intention behind every stitch carry a frequency.
          </p>

          <p>
            We engineer apparel that acts as a conduit between you and the celestial bodies that govern your path. Fashion becomes a ritual—a tool to channel planetary energy, reinforce personal alignment, and command your own reality.
          </p>

          <div className="py-8">
            <p className="font-accent text-2xl italic leading-relaxed text-stardust-white drop-shadow-sm md:text-3xl lg:text-4xl">
              &quot;What you wear is a message to the universe about who you are — and who you are becoming.&quot;
            </p>
          </div>

          <p className="text-base uppercase tracking-[0.3em] text-nebula-gold/80">
            Vastrayug: Written in the stars. Worn on the skin.
          </p>
        </div>

        <div className="mt-16">
          <Link
            href="/shop"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden border border-nebula-gold bg-transparent px-10 font-body text-sm font-bold uppercase tracking-[0.2em] text-nebula-gold transition-all hover:bg-nebula-gold hover:text-cosmic-black"
          >
            <span className="relative z-10">Align Your Wardrobe</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
