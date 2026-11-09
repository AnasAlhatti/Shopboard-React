import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
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
    <Card
      as="article"
      className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-4 transition duration-200 motion-reduce:transition-none sm:flex-row sm:items-center sm:p-6 hover:border-border"
      aria-labelledby={`cart-title-${id}`}
    >
      <div className="w-24 h-16 bg-surface rounded-md overflow-hidden shrink-0 grid min-h-24 place-items-center text-muted">
        <ShoppingBag size={48} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <span className="text-2xs font-bold text-primary uppercase tracking-wide">
          Unique Items / {product.category}
        </span>
        <h3
          id={`cart-title-${id}`}
          className="text-base font-extrabold mt-0.5 mr-0 mb-1 ml-0"
        >
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <Badge
          variant={product.inStock ? 'available' : 'unavailable'}
          className="text-xs text-muted m-0"
        >
          {product.inStock ? 'In stock' : 'Currently unavailable'}
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-6 border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
        <div className="flex items-center border border-border rounded-sm overflow-hidden bg-background">
          <Button
            variant="ghost"
            type="button"
            className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
            aria-label={`Decrease quantity of ${product.name}`}
            onClick={() => onUpdateQuantity(id, quantity - 1)}
          >
            <Minus size={14} aria-hidden="true" />
          </Button>
          <span className="text-sm font-bold py-0 px-1.5 min-w-5 text-center tabular-nums">
            <span className="sr-only">Quantity: </span>
            {quantity}
          </span>
          <Button
            variant="ghost"
            type="button"
            className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Plus size={14} aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold text-foreground tabular-nums">
            ${(product.price * quantity).toLocaleString()}
          </span>
          <Button
            variant="ghost"
            type="button"
            className="bg-transparent border-0 text-muted cursor-pointer p-1 transition duration-200 motion-reduce:transition-none hover:text-primary"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => onRemove(id)}
          >
            <Trash2 size={15} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
