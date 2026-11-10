'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { notify } from '../../../shared/notifications/notify';
import type { CourseProduct } from '../../../shared/products/types/courseProduct';
import { useCart } from '../../cart/hooks/useCart';
import { UniqueItemSymbol } from './UniqueItemSymbol';

export interface UniqueItemDetailsProps {
  product: CourseProduct | null;
}
export function UniqueItemDetails({ product }: UniqueItemDetailsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  if (!product)
    return (
      <section className="p-8 text-muted">
        <h1>Item not found</h1>
        <p>This item is no longer in the collection.</p>
        <Link href="/products?collection=unique">Browse unique items</Link>
      </section>
    );
  function add() {
    if (!product || !product.inStock) return;
    addToCart(product, quantity);
    notify.success(`${product.name} added to cart.`);
  }
  return (
    <>
      <Link href="/products?collection=unique">Back to unique items</Link>
      <div className="grid gap-8 py-12 md:grid-cols-2">
        <UniqueItemSymbol category={product.category} />
        <section>
          <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
            Unique Items / {product.category}
          </p>
          <h1>{product.name}</h1>
          <Badge variant={product.inStock ? 'available' : 'unavailable'}>
            {product.inStock
              ? 'In stock and ready for your next adventure.'
              : 'This item is currently out of stock.'}
          </Badge>
          <p className="text-foreground text-3xl">
            ${product.price.toFixed(2)}
          </p>
          <label htmlFor="unique-quantity" className="block">
            Quantity
          </label>
          <Input
            className="p-3 max-w-24 mt-2 mb-6"
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
          <Button
            variant="primary"
            type="button"
            onClick={add}
            disabled={!product.inStock}
            size="lg"
          >
            {product.inStock
              ? `Add to cart ($${(product.price * quantity).toFixed(2)})`
              : 'Out of stock'}
          </Button>
        </section>
      </div>
    </>
  );
}
