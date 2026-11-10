import { Card } from '@/components/ui/Card';
import type { Product } from '../../../shared/products/types/product';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="relative overflow-hidden rounded-lg"
    >
      <div className="relative h-feature-media bg-surface overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition duration-200 motion-reduce:transition-none"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>
      <div className="py-3 px-6 border-t border-border flex flex-wrap justify-between items-center gap-2 bg-surface">
        <span className="text-xs font-bold text-primary tracking-wide">
          {product.category.toUpperCase()} SILICON ARCHITECTURE
        </span>
        <span className="text-xs text-muted">
          3nm FinFET Manufacturing Node
        </span>
      </div>
    </Card>
  );
}
