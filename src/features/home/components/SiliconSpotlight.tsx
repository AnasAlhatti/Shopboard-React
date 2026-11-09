'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, type KeyboardEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import type { Product } from '../../../shared/products/types/product';
import {
  getSiliconDashboard,
  type SiliconKind,
} from '../data/siliconArchitecture';

const siliconKinds: readonly SiliconKind[] = ['cpu', 'gpu'];
const spotlightContent = {
  cpu: {
    tab: 'Vortex processors',
    name: 'Vortex 9950X',
    label: 'Desktop processors',
    description:
      'More cores for the work that needs them. Vortex brings high-frequency compute to rendering, compiling, and the desktop tasks in between.',
    image: '/assets/vortex-heat-spreader-detail.jpg',
    alt: 'Vortex processor package and surrounding circuit traces',
    width: 1200,
    height: 896,
  },
  gpu: {
    tab: 'Zenith graphics',
    name: 'Zenith 9900 XTX',
    label: 'Graphics cards',
    description:
      'A triple-fan design and high-capacity graphics memory for detailed scenes, demanding games, and creative projects.',
    image: '/assets/zenith-gpu-studio.jpg',
    alt: 'Full front view of the graphite triple-fan Zenith graphics card',
    width: 896,
    height: 1200,
  },
};

export interface SiliconSpotlightProps {
  cpu?: Product;
  gpu?: Product;
  loading?: boolean;
}
export function SiliconSpotlight({
  cpu,
  gpu,
  loading = false,
}: SiliconSpotlightProps) {
  const [active, setActive] = useState<SiliconKind>('gpu');
  const product = active === 'cpu' ? cpu : gpu;
  const content = spotlightContent[active];
  const metrics = getSiliconDashboard(product, active);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let next: SiliconKind;
    switch (event.key) {
      case 'Home':
        next = 'cpu';
        break;
      case 'End':
        next = 'gpu';
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        next = active === 'cpu' ? 'gpu' : 'cpu';
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    document.getElementById(`spotlight-tab-${next}`)?.focus();
  }

  return (
    <section
      id="home-products"
      className="scroll-mt-24 pt-4 pb-16 lg:pb-28 w-shell max-w-page mx-auto"
      aria-labelledby="spotlight-title"
    >
      <div className="flex flex-col gap-2 mb-8 sm:flex-row sm:justify-between sm:items-end sm:gap-8">
        <div>
          <p className="mb-5 text-xs font-medium tracking-wide text-muted">
            The range
          </p>
          <h2
            id="spotlight-title"
            className="text-3xl lg:text-6xl leading-tight mb-2"
          >
            Choose your hardware.
          </h2>
        </div>
        <div className="flex gap-6" role="tablist" aria-label="Product family">
          {siliconKinds.map((kind) => (
            <Button
              variant="ghost"
              key={kind}
              id={`spotlight-tab-${kind}`}
              type="button"
              role="tab"
              aria-controls="spotlight-panel"
              aria-selected={active === kind}
              tabIndex={active === kind ? 0 : -1}
              onClick={() => setActive(kind)}
              onKeyDown={handleTabKeyDown}
              className="min-h-12 py-3 px-0 border-0 border-b-2 border-border bg-transparent text-muted text-xs transition duration-200 aria-selected:border-b-primary aria-selected:text-foreground hover:text-foreground motion-reduce:duration-200 motion-reduce:transition-none"
            >
              {spotlightContent[kind].tab}
            </Button>
          ))}
        </div>
      </div>
      <Card
        as="article"
        id="spotlight-panel"
        className="p-0 grid items-center gap-8 border-0 bg-transparent shadow-none lg:grid-cols-2 lg:gap-16"
        role="tabpanel"
        aria-labelledby={`spotlight-tab-${active}`}
      >
        <div
          className={cn(
            `overflow-hidden aspect-product rounded-sm bg-carbon sm:aspect-product lg:aspect-product home-product-panel__photo--${active}`,
          )}
        >
          <img
            key={active}
            src={content.image}
            alt={content.alt}
            width={content.width}
            height={content.height}
            loading="lazy"
            className="w-full h-full object-cover outline-none motion-safe:animate-photo-change"
          />
        </div>
        <div>
          <p className="mb-5 text-xs font-medium tracking-wide text-muted">
            {content.label}
          </p>
          <h3 className="mb-4 text-3xl lg:text-4xl">
            {product ? product.name.replace(/^Aethel\s+/, '') : content.name}
          </h3>
          <p className="max-w-96 text-sm">{content.description}</p>
          {product ? (
            <>
              <dl className="grid grid-cols-2 gap-6 my-6 py-6 border-t border-b border-border">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="mb-2 text-muted text-2xs">{metric.label}</dt>
                    <dd className="m-0 text-base tabular-nums">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <span className="text-lg">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </span>
                <Link
                  className="inline-flex w-fit items-center gap-3 min-h-11 p-0 border-0 bg-transparent text-foreground text-sm font-medium no-underline"
                  href={`/products/${product.id}`}
                >
                  View product{' '}
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="text-primary transition duration-200 motion-reduce:duration-200 motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </>
          ) : (
            <p
              className="home-product-panel__unavailable max-w-96 text-sm"
              role="status"
            >
              {loading
                ? 'Loading product specifications.'
                : 'Product specifications are currently unavailable.'}
            </p>
          )}
          <Link
            className="inline-flex w-fit min-h-11 items-center gap-2.5 text-muted text-xs no-underline hover:text-foreground"
            href={`/products?category=${active}`}
          >
            All {active === 'cpu' ? 'processors' : 'graphics cards'}{' '}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </Card>
    </section>
  );
}
