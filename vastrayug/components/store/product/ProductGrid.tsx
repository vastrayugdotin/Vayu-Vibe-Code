import ProductCard from './ProductCard'

interface ProductGridProps {
  products: any[] // We'll refine this type later when integrating Prisma
  title?: string
  subtitle?: string
  viewAllLink?: string
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  viewAllLink,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-eclipse-silver font-body">
        No products found in this collection yet.
      </div>
    )
  }

  return (
    <section className="w-full py-12 md:py-20">
      {/* Optional Header */}
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            {title && (
              <h2 className="font-heading text-heading-lg text-stardust-white tracking-wide mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-body text-eclipse-silver text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <a
              href={viewAllLink}
              className="group inline-flex items-center gap-2 text-sm font-body tracking-widest text-nebula-gold uppercase hover:text-stardust-white transition-colors"
            >
              <span>View Collection</span>
              <span className="w-6 h-[1px] bg-nebula-gold group-hover:bg-stardust-white transition-colors" />
            </a>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        data-gtm-action="view_item_list"
      >
        {products.map((product, index) => (
          <div key={product.id} className="h-full">
            {/* Pass priority=true to the first row of cards for LCP optimization */}
            <ProductCard product={product} priority={index < 4} />
          </div>
        ))}
      </div>
    </section>
  )
}
