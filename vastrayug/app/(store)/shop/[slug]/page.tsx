import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/store/product/ProductGallery";
import ProductInfo from "@/components/store/product/ProductInfo";
import RelatedProducts from "@/components/store/product/RelatedProducts";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return { title: "Product Not Found | Vastrayug" };

  return {
    title: `${product.title} | Vastrayug`,
    description: product.metaDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.title} | Vastrayug`,
      description: product.metaDescription || product.description.substring(0, 160),
      url: `https://vastrayug.in/shop/${product.slug}`,
      type: "article",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      category: true,
      variants: {
        where: { isActive: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Format images for the gallery component
  const galleryImages = product.images.map((img) => ({
    id: img.id,
    url: img.url,
    altText: img.altText,
    isPrimary: img.isPrimary,
  }));

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-eclipse-silver font-body mb-8">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-nebula-gold transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="text-white/20">/</span>
          </li>
          <li>
            <Link href="/shop" className="hover:text-nebula-gold transition-colors">
              Shop
            </Link>
          </li>
          <li>
            <span className="text-white/20">/</span>
          </li>
          <li>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-nebula-gold transition-colors"
            >
              {product.category.name}
            </Link>
          </li>
          <li>
            <span className="text-white/20">/</span>
          </li>
          <li className="text-stardust-white truncate" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="w-full lg:w-[55%]">
          <ProductGallery images={galleryImages} planet={product.planet} />
        </div>
        <div className="w-full lg:w-[45%]">
          <ProductInfo product={product} variants={product.variants} />
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId}
        planet={product.planet}
      />
    </div>
  );
}
