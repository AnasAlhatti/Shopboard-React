import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '../../../shared/products/types/product';

export interface HeroShowcaseProps {
  cpu?: Product;
  gpu?: Product;
  loading: boolean;
}
export function HeroShowcase({ cpu, gpu, loading }: HeroShowcaseProps) {
  let coreSummary: string | undefined;
  if (cpu?.specs.cores && cpu.specs.threads) {
    coreSummary = `${cpu.specs.cores} cores / ${cpu.specs.threads} threads`;
  }

  const specifications = [
    { label: 'Vortex 9950X', value: coreSummary },
    { label: 'Maximum boost clock', value: cpu?.specs.boostClock },
    { label: 'Zenith 9900 XTX memory', value: gpu?.specs.vram },
  ];
  const statusText = loading
    ? 'Loading specifications'
    : 'Specifications unavailable';

  return (
    <section className="pt-6 lg:pt-10" aria-labelledby="home-title">
      <div className="grid items-center gap-6 w-shell max-w-6xl mx-auto lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="mb-3 text-sm font-medium tracking-wide text-muted">
            Aethel Silicon / Desktop hardware
          </p>
          <h1
            id="home-title"
            className="mb-5 text-3xl sm:text-4xl lg:text-5xl leading-tight"
          >
            Vortex processors.
            <br />
            <span className="text-muted">Zenith graphics.</span>
          </h1>
          <p className="mb-4 text-muted text-base leading-relaxed">
            For the games you play.
            <br />
            And the work you put into them.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              className="inline-flex items-center gap-2 min-h-11 text-foreground text-sm font-semibold no-underline"
              href="/products"
            >
              Explore products{' '}
              <ArrowUpRight
                size={16}
                className="text-primary"
                aria-hidden="true"
              />
            </Link>
            <a
              className="inline-flex items-center gap-2 min-h-11 text-muted text-sm no-underline hover:text-foreground"
              href="#home-products"
            >
              Meet the range <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <figure className="m-0 min-w-0">
          <img
            src="/assets/aethel-silicon-studio.jpg"
            alt="Silver Vortex processor beside a graphite triple-fan Zenith graphics card"
            width="1376"
            height="768"
            fetchPriority="high"
            className="block w-full h-auto rounded-md photo-outline motion-safe:animate-photo-enter"
          />
          <figcaption className="pt-3 text-muted text-xs">
            Vortex 9950X &amp; Zenith 9900 XTX
          </figcaption>
        </figure>
      </div>
      <dl
        className="grid grid-cols-2 gap-4 items-center mt-6 mb-0 py-4 border-t border-b border-border md:grid-cols-4 w-shell max-w-6xl mx-auto"
        aria-label="Flagship specifications"
        aria-busy={loading}
      >
        {specifications.map((specification) => (
          <div key={specification.label}>
            <dt className="mb-1 text-muted text-xs">{specification.label}</dt>
            <dd className="m-0 text-foreground text-sm tabular-nums">
              {loading ? statusText : (specification.value ?? statusText)}
            </dd>
          </div>
        ))}
        <div>
          <dt className="mb-1 text-muted text-xs">The full range</dt>
          <dd className="m-0 text-foreground text-sm tabular-nums">
            <Link
              className="inline-flex w-fit min-h-11 items-center gap-2.5 text-muted text-sm no-underline hover:text-foreground sm:col-span-full lg:col-auto"
              href="/compare"
            >
              Compare hardware <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </dd>
        </div>
      </dl>
    </section>
  );
}
