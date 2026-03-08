import ProductGrid from '@/components/store/product/ProductGrid'

// Mock data for the shop page
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
    id: 'prod_moon_1',
    title: 'Chandra Flow Co-ord Set',
    slug: 'chandra-flow-coord-set',
    price: 4999,
    planet: 'Moon',
    zodiac_sign: 'Cancer',
    category: { name: 'Co-ord Sets', slug: 'co-ord-sets' },
    stock: 8,
    images: [
      { url: 'https://placehold.co/800x1200/F8F4EC/1B1640?text=Chandra+Coord+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/B8D4E3/0A0A0F?text=Chandra+Coord+2', alt: 'Detail', is_primary: false },
    ],
  },
  {
    id: 'prod_mars_1',
    title: 'Mangal Power Hoodie',
    slug: 'mangal-power-hoodie',
    price: 3999,
    compare_at_price: 4599,
    planet: 'Mars',
    zodiac_sign: 'Aries',
    category: { name: 'Hoodies', slug: 'hoodies' },
    stock: 0, // Out of stock example
    images: [
      { url: 'https://placehold.co/800x1200/8B0000/F4F1EC?text=Mangal+Hoodie+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/36454F/F4F1EC?text=Mangal+Hoodie+2', alt: 'Back', is_primary: false },
    ],
  },
  {
    id: 'prod_saturn_1',
    title: 'Shani Discipline Jacket',
    slug: 'shani-discipline-jacket',
    price: 6999,
    planet: 'Saturn',
    zodiac_sign: 'Capricorn',
    category: { name: 'Jackets', slug: 'jackets' },
    stock: 4,
    images: [
      { url: 'https://placehold.co/800x1200/191970/F4F1EC?text=Shani+Jacket+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/0A0A0F/F4F1EC?text=Shani+Jacket+2', alt: 'Side', is_primary: false },
    ],
  },
  {
    id: 'prod_mercury_1',
    title: 'Budh Agility Joggers',
    slug: 'budh-agility-joggers',
    price: 2999,
    planet: 'Mercury',
    zodiac_sign: 'Gemini',
    category: { name: 'Joggers', slug: 'joggers' },
    stock: 22,
    images: [
      { url: 'https://placehold.co/800x1200/50C878/0A0A0F?text=Budh+Joggers+1', alt: 'Front', is_primary: true },
    ],
  },
  {
    id: 'prod_jupiter_1',
    title: 'Guru Abundance Kurta',
    slug: 'guru-abundance-kurta',
    price: 3499,
    planet: 'Jupiter',
    zodiac_sign: 'Sagittarius',
    category: { name: 'Kurtas', slug: 'kurtas' },
    stock: 12,
    images: [
      { url: 'https://placehold.co/800x1200/FADA5E/1B1640?text=Guru+Kurta+1', alt: 'Front', is_primary: true },
      { url: 'https://placehold.co/800x1200/C9A84C/0A0A0F?text=Guru+Kurta+2', alt: 'Detail', is_primary: false },
    ],
  },
]

export default function ShopPage() {
  // In a real app, this would be fetched from Prisma, possibly with search params filtering
  const products = MOCK_PRODUCTS

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-display-sm md:text-display-md text-stardust-white mb-4">
          All Products
        </h1>
        <p className="font-body text-eclipse-silver text-lg">
          Discover pieces aligned with your cosmic frequency. Filter by your ruling planet, zodiac sign, or life path number.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Mocked for now) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 border border-white/5 bg-void-black p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-stardust-white tracking-widest uppercase">Filters</h2>
              <button className="text-xs text-eclipse-silver hover:text-nebula-gold underline underline-offset-4 uppercase tracking-widest font-body">
                Clear
              </button>
            </div>

            {/* Filter Categories */}
            <div className="space-y-8 font-body">
              {/* Planets */}
              <div>
                <h3 className="text-sm font-semibold text-stardust-white mb-4 uppercase tracking-wider">Ruling Planet</h3>
                <div className="space-y-3">
                  {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map(planet => (
                    <label key={planet} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-white/20 group-hover:border-nebula-gold transition-colors flex items-center justify-center">
                        {/* Checkmark icon would go here when active */}
                      </div>
                      <span className="text-sm text-eclipse-silver group-hover:text-stardust-white transition-colors">{planet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-white/5" />

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-stardust-white mb-4 uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                  {['Oversized Tees', 'Hoodies', 'Co-ord Sets', 'Joggers', 'Jackets'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-white/20 group-hover:border-nebula-gold transition-colors" />
                      <span className="text-sm text-eclipse-silver group-hover:text-stardust-white transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <span className="text-sm text-eclipse-silver font-body">
              Showing {products.length} products
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-eclipse-silver font-body uppercase tracking-wider">Sort by:</span>
              <select className="bg-transparent text-sm text-stardust-white border-none outline-none font-body uppercase tracking-wider cursor-pointer focus:ring-0">
                <option value="featured" className="bg-cosmic-black">Featured</option>
                <option value="newest" className="bg-cosmic-black">Newest Arrivals</option>
                <option value="price-asc" className="bg-cosmic-black">Price: Low to High</option>
                <option value="price-desc" className="bg-cosmic-black">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid products={products} />

          {/* Pagination Mock */}
          <div className="mt-16 flex justify-center">
            <button className="px-8 py-3 border border-white/20 text-stardust-white font-body text-sm uppercase tracking-widest hover:border-nebula-gold hover:text-nebula-gold transition-colors">
              Load More
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
