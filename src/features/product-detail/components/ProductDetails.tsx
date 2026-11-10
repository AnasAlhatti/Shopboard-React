'use client';
import { ArrowLeft, Layers, Plus, Scale } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';
import { notify } from '../../../shared/notifications/notify';
import { useCart } from '../../cart/hooks/useCart';
import { useCompare } from '../../compare/hooks/useCompare';
import { ArchitectureSpecTable } from './ArchitectureSpecTable';
import { MiniBenchmarkCard } from './MiniBenchmarkCard';
import { ProductGallery } from './ProductGallery';

import type { Product } from '../../../shared/products/types/product';
export interface ProductDetailsProps {
  product: Product | null;
}
export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare, category } = useCompare();

  const [quantity, setQuantity] = useState(1);

  const isCompared = product ? isInCompare(product.id) : false;
  const compareDisabled =
    product &&
    category !== null &&
    category !== product.category &&
    !isCompared;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    notify.success(`Added ${quantity} unit(s) of ${product.name} to cart.`);
  };

  if (!product) {
    return (
      <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
        <div
          className="text-center py-16 px-6 bg-surface border border-border rounded-lg my-12"
          role="alert"
        >
          <p className="text-xs font-extrabold tracking-widest uppercase text-muted mb-6">
            404 Architecture Error
          </p>
          <h1 className="text-3xl mb-2">Silicon Not Found</h1>
          <p className="text-muted mb-6">
            The processor or graphics chip you requested does not exist in our
            silicon matrix.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/products">
              <ArrowLeft size={16} aria-hidden="true" /> Return to Catalog
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
      <nav
        className="flex items-center gap-1 text-xs text-muted mb-6"
        aria-label="Breadcrumb"
      >
        <Link href="/products">Silicon Catalog</Link>
        <span className="text-border" aria-hidden="true">
          /
        </span>
        <span className="text-border" aria-hidden="true">
          {product.series}
        </span>
        <span className="text-border" aria-hidden="true">
          /
        </span>
        <span className="text-foreground font-semibold" aria-current="page">
          {product.name}
        </span>
      </nav>

      <section
        className="flex flex-col gap-8 mb-12 md:grid md:grid-cols-2 md:items-start md:gap-8 lg:gap-12"
        aria-labelledby="product-name-heading"
      >
        <ProductGallery product={product} />

        <div className="flex flex-col gap-6">
          <header>
            <p className="text-primary text-xs font-extrabold tracking-widest uppercase mb-1">
              {product.series} Series // {product.category.toUpperCase()}
            </p>
            <h1
              id="product-name-heading"
              className="text-4xl lg:text-5xl font-extrabold tracking-tight mt-0 mr-0 mb-1.5 ml-0"
            >
              {product.name}
            </h1>
            <p className="text-lg text-muted m-0">{product.tagline}</p>
          </header>

          <div className="flex items-baseline gap-2 bg-surface border border-border rounded-md py-4 px-6">
            <span className="text-xs uppercase text-muted">
              MSRP Starting at
            </span>
            <span className="text-4xl font-extrabold text-foreground tabular-nums">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <p className="product-info-desc">{product.description}</p>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-base font-bold uppercase tracking-wide text-muted mt-0 mr-0 mb-2 ml-0">
              Architectural Highlights
            </h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-baseline gap-2 text-sm text-foreground"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="product-qty"
                className="text-sm font-semibold text-muted"
              >
                Quantity
              </label>
              <Input
                id="product-qty"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      10,
                      Math.max(1, Math.floor(Number(e.target.value) || 1)),
                    ),
                  )
                }
                className="w-18 bg-background border border-border rounded-sm text-foreground py-1.5 px-2.5 text-sm font-bold text-center"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                type="button"
                className="sm:flex-1"
                onClick={handleAddToCart}
                size="lg"
              >
                <Plus size={16} aria-hidden="true" /> Add to Cart ($
                {(product.price * quantity).toLocaleString()})
              </Button>

              <Button
                variant="secondary"
                type="button"
                className={cn(
                  `hover:text-foreground${isCompared ? ' border-primary bg-primary/15 text-primary' : ''}`,
                  'sm:flex-1',
                )}
                disabled={Boolean(compareDisabled)}
                onClick={() => toggleCompare(product)}
                title={
                  compareDisabled
                    ? `Compare locked to ${category?.toUpperCase()}s`
                    : ''
                }
                size="lg"
              >
                <Scale size={16} aria-hidden="true" />
                <span>
                  {isCompared ? 'In Compare Bench' : 'Compare Silicon'}
                </span>
              </Button>

              <Button asChild variant="secondary" size="lg">
                <Link href="/configurator" className="sm:flex-1">
                  <Layers size={16} aria-hidden="true" />
                  <span>Custom Rig Builder</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-12 border-t border-border pt-12 lg:grid lg:grid-cols-2 lg:gap-12">
        <ArchitectureSpecTable product={product} />
        <MiniBenchmarkCard product={product} />
      </div>
    </main>
  );
}
