'use client';
import Link from 'next/link';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { notify } from '../../../shared/notifications/notify';
import type { CourseProduct } from '../../../shared/products/types/courseProduct';
import { useCart } from '../../cart/hooks/useCart';
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
    <Card
      as="article"
      className="flex flex-col p-6 border border-border rounded-card bg-surface"
      aria-labelledby={`unique-title-${product.id}`}
    >
      <UniqueItemSymbol category={product.category} />
      <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
        {product.category}
      </p>
      <h2 id={`unique-title-${product.id}`} className="text-xl">
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h2>
      <Badge variant={product.inStock ? 'available' : 'unavailable'}>
        {product.inStock ? 'In stock' : 'Out of stock'}
      </Badge>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <strong>${product.price.toFixed(2)}</strong>
        <Button
          variant="primary"
          type="button"
          disabled={!product.inStock}
          onClick={add}
          aria-label={`Add ${product.name} to cart`}
          size="sm"
        >
          {product.inStock ? 'Add to cart' : 'Unavailable'}
        </Button>
      </div>
    </Card>
  );
}
