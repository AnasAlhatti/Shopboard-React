import type { Product } from '../../../shared/products/types/product';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div className="product-gallery">
      <div className="product-gallery__viewer">
        <img
          src={product.image}
          alt={product.name}
          className="product-gallery__image"
        />
        <div className="product-gallery__glow" aria-hidden="true" />
      </div>
      <div className="product-gallery__meta">
        <span className="product-gallery__badge">
          {product.category.toUpperCase()} SILICON ARCHITECTURE
        </span>
        <span className="product-gallery__lithography">
          3nm FinFET Manufacturing Node
        </span>
      </div>
    </div>
  );
}
