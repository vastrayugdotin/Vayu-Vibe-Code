import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import SolarSystemBanner from "@/components/store/home/SolarSystemBanner";
import FeaturedCollections from "@/components/store/home/FeaturedCollections";
import FeaturedProducts from "@/components/store/home/FeaturedProducts";
import BrandStorySection from "@/components/store/home/BrandStorySection";

export const revalidate = 3600; // ISR: Revalidate every hour

async function getFeaturedCollections() {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true,
      },
      take: 3, // Defaulting to first 3 active collections for home page if 'featured' isn't explicitly on schema
      orderBy: {
        sortOrder: "asc",
      },
    });
    return collections;
  } catch (error) {
    console.error("Error fetching featured collections:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },
      take: 8,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function Home() {
  const [collections, featuredProducts] = await Promise.all([
    getFeaturedCollections(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-cosmic-black">
      {/* 1. Hero Section */}
      <SolarSystemBanner />

      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
        {/* 2. Featured Collections */}
        <FeaturedCollections collections={collections} />

        {/* 3. Featured Products */}
        <FeaturedProducts products={featuredProducts} />

        {/* 4. Brand Story Section */}
        <BrandStorySection />
      </div>
    </div>
  );
}
