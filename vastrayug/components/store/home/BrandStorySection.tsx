"use client";

import Link from "next/link";
import * as React from "react";

export default function BrandStorySection() {
  return (
    <section className="relative my-32 overflow-hidden border border-white/5 bg-deep-indigo/40 px-6 py-20 text-center md:px-12 md:py-28">
      {/* Top and Bottom accent lines */}
      <div className="absolute left-1/2 top-0 h-[1px] w-48 -translate-x-1/2 bg-nebula-gold/80" />
      <div className="absolute bottom-0 left-1/2 h-[1px] w-48 -translate-x-1/2 bg-nebula-gold/80" />

      {/* Decorative Star Icon */}
      <span className="mb-8 block text-3xl text-nebula-gold opacity-80 md:text-4xl">
        ✦
      </span>

      {/* Headline */}
      <h2 className="mb-10 font-heading text-4xl leading-tight tracking-wide text-stardust-white drop-shadow-sm md:text-5xl lg:text-heading-xl">
        The Era of Cosmic Dressing
      </h2>

      {/* Body Copy derived from Brand_values_and_vision.md */}
      <div className="mx-auto max-w-3xl space-y-6 font-body text-lg leading-relaxed text-eclipse-silver md:text-xl md:leading-relaxed">
        <p>
          Vastrayug is built on the belief that clothing is not neutral. The
          colours touching your skin, the symbols near your heart, and the
          intention behind your garments carry frequency.
        </p>

        <p>
          They shape how you feel, how you move, and how the world responds to
          you. Fashion becomes a tool to channel cosmic energy, reinforce
          personal belief, support emotional healing, and create confidence and
          identity.
        </p>

        {/* Highlight Quote */}
        <div className="py-6">
          <p className="font-accent text-2xl italic leading-relaxed tracking-wide text-stardust-white drop-shadow-md md:text-3xl">
            &quot;What you wear is a message to the universe about who you are —
            and who you are becoming. Vastrayug makes sure that message is
            written in the stars.&quot;
          </p>
        </div>

        <p>
          Every garment is more than clothing — it is a symbol of alignment
          between the wearer and the cosmos.
        </p>
      </div>

      {/* Call to action */}
      <div className="mt-14">
        <Link
          href="/shop"
          className="inline-flex h-14 items-center justify-center border border-nebula-gold bg-transparent px-10 font-body text-sm font-semibold uppercase tracking-[0.2em] text-nebula-gold transition-colors duration-300 hover:bg-nebula-gold hover:text-cosmic-black focus:outline-none focus:ring-2 focus:ring-nebula-gold focus:ring-offset-2 focus:ring-offset-deep-indigo"
        >
          Align Your Wardrobe
        </Link>
      </div>
    </section>
  );
}
