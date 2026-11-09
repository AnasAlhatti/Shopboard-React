import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../shared/products/types/product';

export function ArchitectureStory({ cpu }: { cpu?: Product }) {
  return (
    <section
      className="home-architecture page-width"
      aria-labelledby="architecture-title"
    >
      <div className="home-architecture__copy">
        <p className="home-label">A closer look</p>
        <h2 id="architecture-title">Inside Vortex.</h2>
        <p>
          A metal heat spreader. A dense circuit layout. A processor built for
          long rendering sessions and everyday desktop work.
        </p>
        <p className="home-architecture__detail">
          {cpu?.specs.cores && cpu.specs.threads
            ? `${cpu.specs.cores} cores and ${cpu.specs.threads} threads, with ${cpu.specs.cache ?? 'on-chip'} cache.`
            : 'Explore the core counts, clocks, and cache across the Vortex processor range.'}
        </p>
        <Link
          className="home-text-link"
          to={cpu ? `/product/${cpu.id}` : '/catalog'}
        >
          Explore Vortex <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <figure className="home-architecture__image">
        <img
          src="/assets/vortex-heat-spreader-detail.jpg"
          alt="Close-up of the Vortex metal heat spreader, substrate, and circuit traces"
          width="1200"
          height="896"
          loading="lazy"
        />
        <figcaption>Package detail — heat spreader and substrate</figcaption>
      </figure>
    </section>
  );
}
