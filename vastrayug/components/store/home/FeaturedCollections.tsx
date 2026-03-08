"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

type Collection = {
  id: string;
  name: string;
  slug: string;
  type: string;
  planet?: string | null;
  imageUrl?: string | null;
};

interface FeaturedCollectionsProps {
  collections: Collection[];
}

export default function FeaturedCollections({
  collections,
}: FeaturedCollectionsProps) {
  // Use IntersectionObserver to animate cards in sequentially as they scroll into view
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!collections || collections.length === 0) {
    return (
      <section className="mb-24">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="border-b-2 border-nebula-gold pb-2 font-heading text-3xl text-stardust-white md:text-4xl">
            Planetary Alignment
          </h2>
          <Link
            href="/collection"
            className="font-body text-sm uppercase tracking-wider text-nebula-gold transition-colors hover:text-stardust-white"
          >
            View All
          </Link>
        </div>
        <p className="text-eclipse-silver">
          Cosmic alignments are currently hidden.
        </p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mb-24">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="border-b-2 border-nebula-gold pb-2 font-heading text-3xl text-stardust-white md:text-4xl">
          Planetary Alignment
        </h2>
        <Link
          href="/collection"
          className="font-body text-sm uppercase tracking-wider text-nebula-gold transition-colors hover:text-stardust-white"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {collections.map((collection, index) => (
          <Link
            href={`/collection/${collection.slug}`}
            key={collection.id}
            className={`group relative aspect-[3/4] cursor-pointer overflow-hidden border border-white/5 bg-deep-indigo opacity-0 transition-all duration-700 hover:border-nebula-gold/30 ${
              isVisible ? "animate-slide-up opacity-100" : ""
            }`}
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: "forwards",
            }}
          >
            {collection.imageUrl ? (
              <Image
                src={collection.imageUrl}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-deep-indigo to-transparent" />
            )}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-8 transition-transform duration-500 md:translate-y-4 md:group-hover:translate-y-0">
              <span className="mb-2 block font-body text-xs uppercase tracking-widest text-nebula-gold">
                {collection.type === "PLANETARY" && collection.planet
                  ? collection.planet
                  : collection.type}
              </span>
              <h3 className="mb-2 font-heading text-2xl text-stardust-white">
                {collection.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
