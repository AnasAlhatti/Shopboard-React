import type { Product } from '../../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="catalog-empty" role="status">
        <p className="eyebrow">No silicon found</p>
        <h3>No matching processors or graphics cards</h3>
        <p>Try clearing your active filters or searching for another model or architecture.</p>
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
