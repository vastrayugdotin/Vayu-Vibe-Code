"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  planet?: string | null;
}

export default function ProductGallery({ images, planet }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const activeImage = images[currentIndex] || null;

  // Handle Swipe
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      paginate(-1);
    } else if (info.offset.x < -threshold) {
      paginate(1);
    }
  };

  const paginate = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    } else if (newIndex < 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Handle Interactive Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-void-black border border-white/5 flex items-center justify-center">
        <span className="font-body text-eclipse-silver">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      {/* Thumbnails (Side on Desktop, Bottom Scroll on Mobile) */}
      <div className="order-2 flex w-full gap-3 overflow-x-auto pb-2 no-scrollbar lg:order-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "relative aspect-[3/4] w-20 flex-shrink-0 border transition-all duration-300 lg:w-full",
              currentIndex === i
                ? "border-nebula-gold"
                : "border-white/5 hover:border-white/20"
            )}
          >
            <Image
              src={img.url}
              alt={img.altText || `View ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="relative order-1 aspect-[3/4] w-full overflow-hidden bg-void-black lg:order-2 lg:flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <Image
              src={activeImage?.url}
              alt={activeImage?.altText || "Product Image"}
              fill
              priority
              className={cn(
                "object-cover transition-transform duration-200 ease-out",
                isZoomed ? "scale-[2]" : "scale-100"
              )}
              style={
                isZoomed
                  ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                  : undefined
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop Only Overlay) */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
            <button
              onClick={() => paginate(-1)}
              className="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full bg-cosmic-black/40 text-stardust-white backdrop-blur-sm transition-colors hover:bg-cosmic-black/80 hover:text-nebula-gold"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full bg-cosmic-black/40 text-stardust-white backdrop-blur-sm transition-colors hover:bg-cosmic-black/80 hover:text-nebula-gold"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Planet Badge (Refined from PRD) */}
        {planet && (
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 border border-nebula-gold/20 bg-void-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-nebula-gold backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-nebula-gold shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
            {planet} Aligned
          </div>
        )}

        {/* Mobile Swipe Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 transition-all duration-300",
                  currentIndex === i ? "w-4 bg-nebula-gold" : "w-1 bg-white/20"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
