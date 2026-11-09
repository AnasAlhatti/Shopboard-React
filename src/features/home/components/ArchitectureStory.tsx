import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '../../../shared/products/types/product';

export interface ArchitectureStoryProps {
  cpu?: Product;
}
export function ArchitectureStory({ cpu }: ArchitectureStoryProps) {
  return (
    <section
      className="grid gap-8 items-center py-16 lg:py-32 lg:grid-cols-2 lg:gap-16 w-shell max-w-page mx-auto"
      aria-labelledby="architecture-title"
    >
      <div>
        <p className="mb-5 text-xs font-medium tracking-wide text-muted">
          A closer look
        </p>
        <h2
          id="architecture-title"
          className="mb-6 text-3xl lg:text-6xl leading-tight"
        >
          Inside Vortex.
        </h2>
        <p className="max-w-96 text-sm">
          A metal heat spreader. A dense circuit layout. A processor built for
          long rendering sessions and everyday desktop work.
        </p>
        <p className="text-foreground max-w-96 text-sm">
          {cpu?.specs.cores && cpu.specs.threads
            ? `${cpu.specs.cores} cores and ${cpu.specs.threads} threads, with ${cpu.specs.cache ?? 'on-chip'} cache.`
            : 'Explore the core counts, clocks, and cache across the Vortex processor range.'}
        </p>
        <Link
          className="inline-flex w-fit items-center gap-3 min-h-11 p-0 border-0 bg-transparent text-foreground text-sm font-medium no-underline"
          href={cpu ? `/products/${cpu.id}` : '/products'}
        >
          Explore Vortex{' '}
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="text-primary transition duration-200 motion-reduce:duration-200 motion-reduce:transition-none"
          />
        </Link>
      </div>
      <figure className="m-0 min-w-0">
        <img
          src="/assets/vortex-heat-spreader-detail.jpg"
          alt="Close-up of the Vortex metal heat spreader, substrate, and circuit traces"
          width="1200"
          height="896"
          loading="lazy"
          className="block w-full h-auto rounded-sm outline-none"
        />
        <figcaption className="pt-3 text-muted text-2xs">
          Package detail — heat spreader and substrate
        </figcaption>
      </figure>
    </section>
  );
}
