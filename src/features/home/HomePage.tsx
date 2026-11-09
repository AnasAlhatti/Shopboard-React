'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadError } from '../../shared/async/LoadError';
import { LoadingState } from '../../shared/async/LoadingState';
import { HeroShowcase } from './components/HeroShowcase';
import { HomeProducts } from './components/HomeProducts';
export function HomePage() {
  return (
    <main className="flex-1 bg-background">
      <AsyncBoundary
        fallback={
          <>
            <HeroShowcase loading />
            <LoadingState label="Loading product specifications." />
          </>
        }
        errorFallback={(props) => (
          <>
            <HeroShowcase loading={false} />
            <LoadError {...props} />
          </>
        )}
      >
        <HomeProducts />
      </AsyncBoundary>
      <section
        className="grid gap-8 items-center pt-8 pb-20 border-t border-border lg:grid-cols-2 lg:gap-16 lg:pt-14 lg:pb-20 w-shell max-w-page mx-auto"
        aria-labelledby="home-build-title"
      >
        <div className="min-w-0">
          <img
            src="/assets/aethel-silicon-studio-alternate.jpg"
            alt="Vortex processor and Zenith graphics card on separate dark studio stands"
            width="1376"
            height="768"
            loading="lazy"
            className="w-full h-auto rounded-sm outline-none"
          />
        </div>
        <div>
          <p className="mb-5 text-muted text-xs font-medium tracking-wide">
            Your next build
          </p>
          <h2
            id="home-build-title"
            className="font-medium tracking-tight mb-6 text-3xl lg:text-6xl leading-tight"
          >
            Start with the parts.
            <br />
            Make it your own.
          </h2>
          <p className="max-w-96 text-sm">
            Choose your processor and graphics card, then check the estimated
            power draw before adding your build to the cart.
          </p>
          <Link
            className="inline-flex w-fit items-center gap-3 min-h-11 p-0 border-0 bg-transparent text-foreground text-sm font-medium no-underline"
            href="/configurator"
          >
            Build a custom rig{' '}
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="text-primary transition duration-200 motion-reduce:duration-200 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
