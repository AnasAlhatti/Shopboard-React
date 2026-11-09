import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CourseProduct } from '../../../shared/products/types/courseProduct';

export interface CourseCartItemRowProps {
  id: string;
  product: CourseProduct;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
export function CourseCartItemRow({
  id,
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CourseCartItemRowProps) {
  return (
    <article className="cart-item-card" aria-labelledby={`cart-title-${id}`}>
      <div className="cart-item-media cart-item-symbol">
        <ShoppingBag size={48} aria-hidden="true" />
      </div>
      <div className="cart-item-info">
        <span className="cart-item-tag">Unique Items / {product.category}</span>
        <h3 id={`cart-title-${id}`} className="cart-item-name">
          <Link to={`/unique-items/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="cart-item-specs">
          {product.inStock ? 'In stock' : 'Currently unavailable'}
        </p>
      </div>
      <div className="cart-item-pricing-column">
        <div className="cart-qty-controls">
          <button
            type="button"
            className="qty-btn"
            aria-label={`Decrease quantity of ${product.name}`}
            onClick={() => onUpdateQuantity(id, quantity - 1)}
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <span className="qty-val">
            <span className="sr-only">Quantity: </span>
            {quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="cart-item-totals">
          <span className="cart-item-price">
            ${(product.price * quantity).toLocaleString()}
          </span>
          <button
            type="button"
            className="cart-remove-btn"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => onRemove(id)}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
