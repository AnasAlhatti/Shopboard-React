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
      variant="flat"
      padding="none"
      as="article"
      className="flex flex-col gap-4 p-5 "
      aria-labelledby={`unique-title-${product.id}`}
    >
      <div className="flex items-center gap-3">
        <UniqueItemSymbol category={product.category} />
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium text-muted">
            {product.category}
          </p>
          <h2
            id={`unique-title-${product.id}`}
            className="text-lg leading-snug mb-0"
          >
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h2>
        </div>
      </div>
      <Badge
        className="self-start"
        variant={product.inStock ? 'available' : 'unavailable'}
      >
        {product.inStock ? 'In stock' : 'Out of stock'}
      </Badge>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-border">
        <strong className="text-xl font-semibold tabular-nums">
          ${product.price.toFixed(2)}
        </strong>
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
