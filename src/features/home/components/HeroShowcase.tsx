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
    <section className="pt-10 lg:pt-20" aria-labelledby="home-title">
      <div className="grid gap-4 lg:grid-cols-hero lg:gap-12 lg:items-end w-shell max-w-page mx-auto">
        <div>
          <p className="mb-5 text-xs font-medium tracking-wide text-muted">
            Aethel Silicon / Desktop hardware
          </p>
          <h1
            id="home-title"
            className="m-0 text-4xl md:text-6xl lg:text-7xl leading-tight"
          >
            Vortex processors.
            <br />
            <span className="text-muted">Zenith graphics.</span>
          </h1>
        </div>
        <div className="lg:justify-self-end lg:pb-1">
          <p className="mb-4 text-muted text-base leading-relaxed">
            For the games you play.
            <br />
            And the work you put into them.
          </p>
          <div className="flex flex-wrap gap-1">
            <Link
              className="inline-flex w-fit items-center gap-3 min-h-11 p-0 border-0 bg-transparent text-foreground text-sm font-medium no-underline"
              href="/products"
            >
              Explore products{' '}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="text-primary transition duration-200 motion-reduce:duration-200 motion-reduce:transition-none"
              />
            </Link>
            <a
              className="inline-flex w-fit min-h-11 items-center gap-2.5 text-muted text-xs no-underline hover:text-foreground"
              href="#home-products"
            >
              Meet the range <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <figure className="mt-8 mb-0 lg:mt-11 w-shell max-w-page mx-auto">
        <img
          src="/assets/aethel-silicon-studio.jpg"
          alt="Silver Vortex processor beside a graphite triple-fan Zenith graphics card"
          width="1376"
          height="768"
          fetchPriority="high"
          className="w-full h-auto rounded-sm outline-none motion-safe:animate-photo-enter"
        />
        <figcaption className="flex justify-between gap-4 py-4 text-muted text-2xs">
          <span className="last:hidden sm:last:inline">
            Vortex 9950X & Zenith 9900 XTX
          </span>
          <span className="last:hidden sm:last:inline">
            Processors & graphics
          </span>
        </figcaption>
      </figure>
      <dl
        className="grid grid-cols-2 gap-6 items-center mt-2 mb-0 py-6 border-t border-b border-border sm:grid-cols-3 lg:grid-cols-2 w-shell max-w-page mx-auto"
        aria-label="Flagship specifications"
        aria-busy={loading}
      >
        {specifications.map((specification) => (
          <div key={specification.label}>
            <dt className="mb-2 text-muted text-2xs">{specification.label}</dt>
            <dd className="m-0 text-foreground text-sm tabular-nums">
              {loading ? statusText : (specification.value ?? statusText)}
            </dd>
          </div>
        ))}
        <div>
          <dt className="mb-2 text-muted text-2xs">The full range</dt>
          <dd className="m-0 text-foreground text-sm tabular-nums">
            <Link
              className="inline-flex w-fit min-h-11 items-center gap-2.5 text-muted text-xs no-underline hover:text-foreground sm:col-span-full lg:col-auto"
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
