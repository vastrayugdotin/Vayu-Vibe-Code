import Link from 'next/link'
import ProductGrid from '@/components/store/product/ProductGrid'

// Mock Data specific to a collection
const MOCK_COLLECTION = {
  id: 'col_sun',
  name: 'Sun — Surya Collection',
  title: 'The Surya Collection',
  slug: 'surya-collection',
  type: 'PLANETARY',
  planet: 'Sun',
  description: 'Radiant garments channelling the sovereign energy of Surya — warmth, authority, and self-expression. Step into the light and embrace the leader within.',
  colourPaletteJson: { primary: '#D4A017', secondary: '#F4622C', accent: '#FADA5E' },
}

const MOCK_PRODUCTS = [
  {
    id: 'prod_sun_1',
    title: 'Surya Sovereign Oversized Tee',
    slug: 'surya-sovereign-oversized-tee',
    price: 2499,
    compare_at_price: 3499,
    planet: 'Sun',
    zodiac_sign: 'Leo',
    category: { name: 'Oversized Tees', slug: 'oversized-tees' },
    stock: 15,
    images: [
      { url: 'https://placehold.co/800x1200/1B1640/F4F1EC?text=Surya+Tee+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/0A0A0F/C9A84C?text=Surya+Tee+2', alt: 'Back', is_primary: false },
    ],
  },
  {
    id: 'prod_sun_2',
    title: 'Solar Radiance Hoodie',
    slug: 'solar-radiance-hoodie',
    price: 4999,
    planet: 'Sun',
    zodiac_sign: 'Aries',
    category: { name: 'Hoodies', slug: 'hoodies' },
    stock: 8,
    images: [
      { url: 'https://placehold.co/800x1200/D4A017/0A0A0F?text=Surya+Hoodie+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/F4622C/F4F1EC?text=Surya+Hoodie+2', alt: 'Detail', is_primary: false },
    ],
  },
]

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  // In a real application, fetch collection metadata and products from DB using params.slug
  const collection = MOCK_COLLECTION
  const products = MOCK_PRODUCTS

  // Dynamic banner styles based on DB colour palette
  const primaryColor = collection.colourPaletteJson?.primary || '#C9A84C'
  const bannerGradient = `linear-gradient(135deg, ${primaryColor}20 0%, #0A0A0F 100%)`

  return (
    <div className="min-h-screen flex flex-col">
      {/* Collection Hero Banner */}
      <section
        className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center border-b border-white/10"
        style={{ backgroundImage: bannerGradient }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          {collection.planet && (
            <span className="text-xs font-body tracking-[0.3em] uppercase mb-4 block" style={{ color: primaryColor }}>
              Ruling Planet: {collection.planet}
            </span>
          )}
          <h1 className="font-heading text-display-md text-stardust-white mb-6">
            {collection.title}
          </h1>
          <p className="font-body text-eclipse-silver text-lg leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-eclipse-silver font-body mb-8">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-nebula-gold transition-colors">Home</Link></li>
            <li><span className="text-white/20">/</span></li>
            <li><Link href="/collections" className="hover:text-nebula-gold transition-colors">Collections</Link></li>
            <li><span className="text-white/20">/</span></li>
            <li className="text-stardust-white truncate" aria-current="page">{collection.title}</li>
          </ol>
        </nav>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
          <span className="text-sm text-eclipse-silver font-body">
            Showing {products.length} cosmic artifacts
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-eclipse-silver font-body uppercase tracking-wider hidden sm:inline">Sort by:</span>
            <select className="bg-transparent text-sm text-stardust-white border border-white/20 sm:border-none outline-none font-body uppercase tracking-wider cursor-pointer focus:ring-0 p-2 sm:p-0 w-full sm:w-auto">
              <option value="featured" className="bg-cosmic-black">Featured</option>
              <option value="newest" className="bg-cosmic-black">Newest Arrivals</option>
              <option value="price-asc" className="bg-cosmic-black">Price: Low to High</option>
              <option value="price-desc" className="bg-cosmic-black">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
