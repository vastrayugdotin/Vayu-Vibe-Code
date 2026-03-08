"use client";

import * as React from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: any[];
  planet?: string | null;
}

export default function ProductGallery({
  images,
  planet,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(
    images.find((img) => img.isPrimary) || images[0] || null,
  );

  if (!images || images.length === 0) {
    return (
      <div className="flex w-full flex-col gap-4 lg:w-[55%] lg:flex-row">
        <div className="relative aspect-[3/4] w-full bg-deep-indigo/30">
          <div className="flex h-full w-full items-center justify-center text-eclipse-silver">
            No image available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:w-[55%] lg:flex-row">
      {/* Thumbnails (desktop left, mobile bottom) */}
      <div className="no-scrollbar order-2 flex w-full flex-shrink-0 gap-4 overflow-x-auto pb-2 md:order-1 md:w-24 md:flex-col md:overflow-visible md:pb-0">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setSelectedImage(img)}
            className={`relative flex-shrink-0 w-20 md:w-full aspect-[3/4] border transition-all duration-300 ${
              selectedImage?.url === img.url
                ? "border-nebula-gold"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <Image
              src={img.url}
              alt={img.altText || `Thumbnail ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="group relative order-1 aspect-[3/4] w-full bg-deep-indigo/30 md:order-2 overflow-hidden cursor-crosshair">
        <Image
          src={selectedImage?.url}
          alt={selectedImage?.altText || "Product Image"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
        />

        {/* Planet Badge Overlay */}
        {planet && (
          <div className="absolute left-4 top-4 flex items-center gap-2 border border-nebula-gold/30 bg-cosmic-black/80 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-surya-gold" />
            <span className="font-heading text-xs uppercase tracking-widest text-nebula-gold">
              {planet} Energy
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
