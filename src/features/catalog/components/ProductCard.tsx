'use client';
import { Cpu, Gauge, Plus, Scale } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { notify } from '../../../shared/notifications/notify';
import type { Product } from '../../../shared/products/types/product';
import { useCart } from '../../cart/hooks/useCart';
import { useCompare } from '../../compare/hooks/useCompare';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare, category } = useCompare();

  const isCompared = isInCompare(product.id);
  const compareDisabled =
    category !== null && category !== product.category && !isCompared;

  return (
    <Card
      as="article"
      className={cn(
        'p-0',
        cn(
          'bg-surface border border-border rounded-lg overflow-hidden flex flex-col transition duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:border-border hover:shadow-card',
          layout === 'list' && 'md:flex-row',
        ),
      )}
      aria-labelledby={`title-${product.id}`}
    >
      <div
        className={cn(
          'relative aspect-video bg-surface overflow-hidden',
          layout === 'list' && 'md:w-64 md:shrink-0',
        )}
      >
        <img
          className="w-full h-full object-cover transition duration-200 motion-reduce:transition-none"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 bg-surface backdrop-blur-md border border-border text-primary text-2xs font-bold uppercase tracking-wide py-1 px-2 rounded-xl flex items-center gap-1">
          {product.category === 'cpu' ? (
            <>
              <Cpu size={12} aria-hidden="true" /> Processor
            </>
          ) : (
            <>
              <Gauge size={12} aria-hidden="true" /> Graphics
            </>
          )}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">
          {product.series} Series
        </p>
        <h3
          id={`title-${product.id}`}
          className="text-lg font-extrabold leading-tight mt-0 mr-0 mb-1 ml-0"
        >
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-xs text-muted mt-0 mr-0 mb-4 ml-0">
          {product.tagline}
        </p>

        <dl className="grid grid-cols-2 gap-1.5 bg-background border border-border rounded-sm py-2 px-2.5 mt-0 mr-0 mb-4 ml-0">
          {product.category === 'cpu' ? (
            <>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">Cores</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.cores}C / {product.specs.threads}T
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">Boost</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.boostClock}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">Cache</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.cache}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">TDP</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.tdp}W
                </dd>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">VRAM</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.vram}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">Boost</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.boostClock}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">Compute</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.tflops?.toFixed(1)} TFLOPs
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xs uppercase text-muted">TDP</dt>
                <dd className="text-sm font-bold text-foreground m-0 tabular-nums">
                  {product.specs.tdp}W
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>

      <footer className="border-t border-border py-3 px-4 flex items-center justify-between bg-surface">
        <div className="flex flex-col">
          <span className="text-2xs uppercase text-muted">MSRP</span>
          <span className="text-xl font-extrabold text-foreground tabular-nums">
            ${product.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor={`compare-${product.id}`}
            className={cn(
              `inline-flex items-center gap-1.5 text-xs text-muted py-1.5 px-2.5 border border-border rounded-sm cursor-pointer transition duration-200 motion-reduce:transition-none select-none focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2 hover:border-primary hover:text-foreground${compareDisabled ? ' opacity-40 cursor-not-allowed pointer-events-none' : ''}${isCompared ? ' bg-surface border-primary text-primary font-semibold' : ''}`,
            )}
            title={
              compareDisabled
                ? `Compare tray is locked to ${category?.toUpperCase()}s`
                : 'Toggle comparison'
            }
          >
            <input
              id={`compare-${product.id}`}
              type="checkbox"
              checked={isCompared}
              disabled={compareDisabled}
              onChange={() => toggleCompare(product)}
              className="sr-only"
            />
            <Scale size={14} aria-hidden="true" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </label>

          <Button
            variant="primary"
            type="button"
            onClick={() => {
              addToCart(product, 1);
              notify.success(`Added ${product.name} to cart.`);
            }}
            aria-label={`Add ${product.name} to cart`}
            size="sm"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Add</span>
          </Button>
        </div>
      </footer>
    </Card>
  );
}
