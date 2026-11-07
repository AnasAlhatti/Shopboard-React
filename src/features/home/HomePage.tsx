import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AsyncBoundary } from '../../shared/components/AsyncBoundary';
import { LoadingState } from '../../shared/components/LoadingState';
import { LoadError } from '../../shared/components/LoadError';
import { HomeProducts } from './components/HomeProducts';
import { HeroShowcase } from './components/HeroShowcase';
import './home.css';

export function HomePage() {
  return (
    <main className="home-page">
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
        className="home-build page-width"
        aria-labelledby="home-build-title"
      >
        <div className="home-build__image">
          <img
            src="/assets/aethel-silicon-studio-alternate.jpg"
            alt="Vortex processor and Zenith graphics card on separate dark studio stands"
            width="1376"
            height="768"
            loading="lazy"
          />
        </div>
        <div className="home-build__copy">
          <p className="home-label">Your next build</p>
          <h2 id="home-build-title">
            Start with the parts.
            <br />
            Make it your own.
          </h2>
          <p>
            Choose your processor and graphics card, then check the estimated
            power draw before adding your build to the cart.
          </p>
          <Link className="home-text-link" to="/configurator">
            Build a custom rig <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
