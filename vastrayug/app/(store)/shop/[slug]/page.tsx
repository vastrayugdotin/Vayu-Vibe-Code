import Image from 'next/image'
import Link from 'next/link'
import { Heart, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock product data for initial build
const MOCK_PRODUCT = {
  id: 'prod_sun_1',
  title: 'Surya Sovereign Oversized Tee',
  slug: 'surya-sovereign-oversized-tee',
  price: 2499,
  compare_at_price: 3499,
  description: '<p>The Surya Sovereign Oversized Tee is crafted from heavyweight 240 GSM premium cotton. Designed for those who lead, this piece channels the commanding energy of the Sun. Featuring subtle gold embroidery of the Surya yantra on the nape and a structured, boxy fit that refuses to be ignored.</p><p>Wear this when you need to step into your power, present your ideas, or reclaim your autonomy.</p>',
  planet: 'Sun',
  zodiac_sign: 'Leo',
  emotional_intention: 'Confidence & Authority',
  life_path_number: 1,
  category: { name: 'Oversized Tees' },
  stock: 15,
  images: [
    { url: 'https://placehold.co/800x1200/1B1640/F4F1EC?text=Surya+Tee+Front', alt: 'Front view' },
    { url: 'https://placehold.co/800x1200/0A0A0F/C9A84C?text=Surya+Tee+Back', alt: 'Back view' },
    { url: 'https://placehold.co/800x1200/1B1640/F4F1EC?text=Surya+Tee+Detail', alt: 'Detail view' },
  ],
  variants: [
    { id: 'v1', size: 'S', stock: 5 },
    { id: 'v2', size: 'M', stock: 10 },
    { id: 'v3', size: 'L', stock: 0 },
    { id: 'v4', size: 'XL', stock: 2 },
  ],
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // In a real implementation, we would fetch the product by slug from Prisma here
  const product = MOCK_PRODUCT

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const isOutOfStock = product.stock <= 0

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-eclipse-silver font-body mb-8">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-nebula-gold transition-colors">Home</Link></li>
          <li><span className="text-white/20">/</span></li>
          <li><Link href="/shop" className="hover:text-nebula-gold transition-colors">Shop</Link></li>
          <li><span className="text-white/20">/</span></li>
          <li className="text-stardust-white truncate" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-4">
          {/* Thumbnails (desktop left, mobile bottom) */}
          <div className="flex md:flex-col order-2 md:order-1 gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0 w-full md:w-24 flex-shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`relative aspect-[3/4] md:w-full w-20 flex-shrink-0 border transition-all duration-300 ${
                  i === 0 ? 'border-nebula-gold' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative aspect-[3/4] w-full order-1 md:order-2 bg-deep-indigo/30">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.planet && (
              <div className="absolute top-4 left-4 bg-cosmic-black/80 backdrop-blur-md border border-nebula-gold/30 px-3 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surya-gold animate-pulse" />
                <span className="text-xs font-heading tracking-widest text-nebula-gold uppercase">
                  {product.planet} Energy
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-8">
          <div className="mb-8 border-b border-white/10 pb-8">
            <h1 className="font-heading text-heading-xl text-stardust-white mb-4">
              {product.title}
            </h1>

            <div className="flex items-end gap-4">
              <span className="font-body text-3xl text-stardust-white font-medium">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-body text-xl text-eclipse-silver line-through decoration-mangal-red/50 mb-1">
                    {formatCurrency(product.compare_at_price!)}
                  </span>
                  <span className="font-body text-sm text-mangal-red uppercase tracking-wider font-semibold mb-2">
                    Save {formatCurrency(product.compare_at_price! - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-eclipse-silver mt-2">Inclusive of all taxes.</p>
          </div>

          {/* Cosmic Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-void-black border border-white/5 p-4 flex flex-col">
              <span className="text-xs text-stardust-white/50 uppercase tracking-widest mb-1 font-body">Ruling Planet</span>
              <span className="text-nebula-gold font-heading text-lg">{product.planet}</span>
            </div>
            <div className="bg-void-black border border-white/5 p-4 flex flex-col">
              <span className="text-xs text-stardust-white/50 uppercase tracking-widest mb-1 font-body">Zodiac Sign</span>
              <span className="text-stardust-white font-heading text-lg">{product.zodiac_sign}</span>
            </div>
            <div className="bg-void-black border border-white/5 p-4 flex flex-col">
              <span className="text-xs text-stardust-white/50 uppercase tracking-widest mb-1 font-body">Life Path Number</span>
              <span className="text-stardust-white font-heading text-lg">{product.life_path_number}</span>
            </div>
            <div className="bg-void-black border border-white/5 p-4 flex flex-col">
              <span className="text-xs text-stardust-white/50 uppercase tracking-widest mb-1 font-body">Emotional Intention</span>
              <span className="text-stardust-white font-heading text-lg truncate">{product.emotional_intention}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-stardust-white uppercase tracking-widest">Select Size</span>
              <button className="text-sm text-eclipse-silver hover:text-nebula-gold underline underline-offset-4 transition-colors font-body">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.variants.map((v) => {
                const outOfStock = v.stock <= 0
                return (
                  <button
                    key={v.id}
                    disabled={outOfStock}
                    className={`
                      py-3 border text-sm font-body font-medium transition-colors
                      ${outOfStock
                        ? 'border-white/5 text-white/20 bg-white/5 cursor-not-allowed'
                        : v.size === 'M' // Mocking selected state
                          ? 'border-nebula-gold text-cosmic-black bg-nebula-gold'
                          : 'border-white/20 text-stardust-white hover:border-nebula-gold/50 hover:text-nebula-gold'
                      }
                    `}
                  >
                    {v.size}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-4 mb-10">
            <button
              className="flex-1 bg-stardust-white text-cosmic-black font-body font-semibold uppercase tracking-widest py-4 hover:bg-nebula-gold transition-colors duration-300"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button
              className="p-4 border border-white/20 text-stardust-white hover:border-mangal-red hover:text-mangal-red transition-colors duration-300"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="font-body text-sm text-stardust-white uppercase tracking-widest mb-4">The Meaning</h3>
            <div
              className="prose prose-invert prose-p:text-eclipse-silver prose-p:leading-relaxed prose-p:mb-4 max-w-none font-body"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* Value Props */}
          <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center gap-3">
              <Truck className="w-6 h-6 text-nebula-gold" />
              <span className="text-xs text-stardust-white uppercase tracking-wider font-body">Free Shipping<br/>Above ₹999</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <RefreshCcw className="w-6 h-6 text-nebula-gold" />
              <span className="text-xs text-stardust-white uppercase tracking-wider font-body">14-Day<br/>Exchange Only</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck className="w-6 h-6 text-nebula-gold" />
              <span className="text-xs text-stardust-white uppercase tracking-wider font-body">Premium<br/>Quality</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
