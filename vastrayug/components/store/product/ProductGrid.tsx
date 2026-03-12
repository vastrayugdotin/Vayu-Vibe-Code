import ProductCard from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  columns?: 3 | 4;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  viewAllLink,
  columns = 3,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="No products found matching your cosmic alignment."
      />
    );
  }

  return (
    <section className="w-full py-6 md:py-8">
      {/* Optional Header */}
      {(title || subtitle) && (
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {title && (
              <h2 className="mb-3 font-heading text-heading-lg tracking-wide text-stardust-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-body text-lg text-eclipse-silver">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <a
              href={viewAllLink}
              className="group inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-nebula-gold transition-colors hover:text-stardust-white"
            >
              <span>View Collection</span>
              <span className="h-[1px] w-6 bg-nebula-gold transition-colors group-hover:bg-stardust-white" />
            </a>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className={
          columns === 4
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4"
            : "grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
        }
        data-gtm-action="view_item_list"
      >
        {products.map((product, index) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} priority={index < columns} />
          </div>
        ))}
      </div>
    </section>
  );
}
