import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseProduct } from '../../../shared/products/hooks/useCourseProduct';
import { useCart } from '../../cart/hooks/useCart';
import { notify } from '../../../shared/notifications/notify';
import { UniqueItemSymbol } from './UniqueItemSymbol';

export interface UniqueItemDetailsProps {
  id: string;
}
export function UniqueItemDetails({ id }: UniqueItemDetailsProps) {
  const product = useCourseProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  if (!product)
    return (
      <section className="async-state">
        <h1>Item not found</h1>
        <p>This item is no longer in the collection.</p>
        <Link to="/unique-items">Browse unique items</Link>
      </section>
    );
  function add() {
    if (!product || !product.inStock) return;
    addToCart(product, quantity);
    notify.success(`${product.name} added to cart.`);
  }
  return (
    <>
      <Link to="/unique-items">Back to unique items</Link>
      <div className="unique-item-detail">
        <UniqueItemSymbol category={product.category} />
        <section>
          <p className="eyebrow">Unique Items / {product.category}</p>
          <h1>{product.name}</h1>
          <p>
            {product.inStock
              ? 'In stock and ready for your next adventure.'
              : 'This item is currently out of stock.'}
          </p>
          <p className="unique-item-price">${product.price.toFixed(2)}</p>
          <label htmlFor="unique-quantity">Quantity</label>
          <input
            className="ui-input"
            id="unique-quantity"
            type="number"
            min={1}
            max={10}
            value={quantity}
            disabled={!product.inStock}
            onChange={(event) =>
              setQuantity(
                Math.min(
                  10,
                  Math.max(1, Math.floor(Number(event.target.value) || 1)),
                ),
              )
            }
          />
          <button
            className="button button--primary"
            type="button"
            onClick={add}
            disabled={!product.inStock}
          >
            {product.inStock
              ? `Add to cart ($${(product.price * quantity).toFixed(2)})`
              : 'Out of stock'}
          </button>
        </section>
      </div>
    </>
  );
}
