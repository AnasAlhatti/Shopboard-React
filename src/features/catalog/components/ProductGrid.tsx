import { cn } from '../../../lib/utils';
import type { Product } from '../../../shared/products/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  totalCount?: number;
}

export function ProductGrid({
  products,
  viewMode,
  totalCount = 0,
}: ProductGridProps) {
  if (products.length === 0) {
    const isNoMatch = totalCount > 0;
    return (
      <div
        className="text-center py-16 px-6 bg-surface border border-border rounded-lg"
        role="status"
      >
        <p className="mb-3 text-xs font-extrabold tracking-widest uppercase text-muted">
          {isNoMatch ? 'No Match' : 'Catalog Empty'}
        </p>
        <h3 className="text-2xl my-1 mx-0">
          {isNoMatch
            ? 'No matching processors or graphics cards'
            : 'No silicon products available'}
        </h3>
        <p className="text-muted">
          {isNoMatch
            ? 'Try clearing your active filters or searching for another model or architecture.'
            : 'Hardware inventory is currently unavailable.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3'
          : 'grid-cols-1',
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout={viewMode} />
      ))}
    </div>
  );
}
