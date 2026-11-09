import { Link } from 'react-router-dom';
import type { CourseProduct } from '../../../shared/products/types/courseProduct';
import { useCart } from '../../cart/hooks/useCart';
import { notify } from '../../../shared/notifications/notify';
import { UniqueItemSymbol } from './UniqueItemSymbol';

export interface UniqueItemCardProps {
  product: CourseProduct;
}
export function UniqueItemCard({ product }: UniqueItemCardProps) {
  const { addToCart } = useCart();
  function add() {
    addToCart(product);
    notify.success(`${product.name} added to cart.`);
  }
  return (
    <article
      className="unique-item-card"
      aria-labelledby={`unique-title-${product.id}`}
    >
      <UniqueItemSymbol category={product.category} />
      <p className="eyebrow">{product.category}</p>
      <h2 id={`unique-title-${product.id}`}>
        <Link to={`/unique-items/${product.id}`}>{product.name}</Link>
      </h2>
      <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
      <div className="unique-item-actions">
        <strong>${product.price.toFixed(2)}</strong>
        <button
          type="button"
          className="button button--primary button--sm"
          disabled={!product.inStock}
          onClick={add}
          aria-label={`Add ${product.name} to cart`}
        >
          {product.inStock ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </article>
  );
}
