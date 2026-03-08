import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    price: number
    compare_at_price?: number | null
    images: { url: string; alt: string; is_primary: boolean }[]
    category: { name: string; slug: string }
    planet?: string | null
    zodiac_sign?: string | null
    stock: number
  }
  priority?: boolean // For LCP optimization on first few cards
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0]
  const hoverImage = product.images.length > 1 ? product.images[1] : primaryImage

  const isOutOfStock = product.stock <= 0
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <div
      className="group relative flex flex-col w-full h-full bg-void-black border border-white/5 hover:border-nebula-gold/30 transition-colors duration-500 overflow-hidden"
      data-product-id={product.id}
      data-product-name={product.title}
      data-product-category={product.category.name}
      data-product-price={product.price}
      data-gtm-action="select_item"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isOutOfStock ? (
          <span className="bg-cosmic-black/80 backdrop-blur-sm text-stardust-white text-xs font-semibold px-2.5 py-1 tracking-wider border border-white/10 uppercase">
            Sold Out
          </span>
        ) : hasDiscount ? (
          <span className="bg-mangal-red text-stardust-white text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
            {discountPercentage}% OFF
          </span>
        ) : null}

        {/* Planet Badge */}
        {product.planet && (
          <span className="bg-nebula-gold/10 backdrop-blur-sm text-nebula-gold border border-nebula-gold/20 text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
            {product.planet}
          </span>
        )}
      </div>

      {/* Wishlist Toggle */}
      <button
        className="absolute top-3 right-3 z-20 p-2 bg-cosmic-black/40 backdrop-blur-sm rounded-full text-stardust-white hover:text-mangal-red hover:bg-cosmic-black/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Add to Wishlist"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Gallery */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-deep-indigo/30 w-full block">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            />
            <Image
              src={hoverImage.url}
              alt={hoverImage.alt || product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 scale-105 group-hover:scale-100"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stardust-white/20">
            <span className="font-heading tracking-widest text-sm uppercase">Vastrayug</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <button
            className="w-full bg-nebula-gold text-cosmic-black font-body font-semibold py-3 text-sm tracking-widest uppercase hover:bg-stardust-white transition-colors"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 md:p-5 flex flex-col flex-1 z-10 bg-void-black">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link href={`/shop/${product.slug}`} className="hover:text-nebula-gold transition-colors flex-1">
            <h3 className="font-heading text-lg text-stardust-white leading-tight line-clamp-2">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-auto pt-2 flex items-center gap-3">
          <span className="font-body font-medium text-stardust-white">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-body text-sm text-eclipse-silver line-through decoration-mangal-red/50">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
