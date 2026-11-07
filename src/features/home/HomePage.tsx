import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../catalog/hooks/useProducts';
import { ArchitectureStory } from './components/ArchitectureStory';
import { HeroShowcase } from './components/HeroShowcase';
import { SiliconSpotlight } from './components/SiliconSpotlight';
import './home.css';

export function HomePage() {
  const { products, loading, error, retry } = useProducts();
  const cpu = products.find((product) => product.id === 'vortex-9950x');
  const gpu = products.find((product) => product.id === 'zenith-9900xtx');

  return (
    <main className="home-page">
      <HeroShowcase cpu={cpu} gpu={gpu} loading={loading} />
      {error && (
        <div className="home-page__error page-width" role="status">
          <p>
            Product specifications are unavailable. You can still explore the
            range.
          </p>
          <button type="button" className="home-text-link" onClick={retry}>
            Try again <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      <ArchitectureStory cpu={cpu} />
      <SiliconSpotlight cpu={cpu} gpu={gpu} loading={loading} />
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
