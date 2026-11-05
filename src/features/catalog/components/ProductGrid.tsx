import type { Product } from '../../../types/product';
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
      <div className="catalog-empty" role="status">
        <p className="eyebrow">{isNoMatch ? 'No Match' : 'Catalog Empty'}</p>
        <h3>
          {isNoMatch
            ? 'No matching processors or graphics cards'
            : 'No silicon products available'}
        </h3>
        <p>
          {isNoMatch
            ? 'Try clearing your active filters or searching for another model or architecture.'
            : 'Hardware inventory is currently unavailable.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`product-grid product-grid--${viewMode}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
