import { ExplodedTeardown } from './components/ExplodedTeardown';
import { HeroShowcase } from './components/HeroShowcase';
import { SiliconSpotlight } from './components/SiliconSpotlight';
import { useProducts } from '../../hooks/useProducts';
import './home.css';

export function HomePage() {
  const { products, loading, error, retry } = useProducts();
  const flagshipCpu = products.find((product) => product.id === 'vortex-9950x');
  const flagshipGpu = products.find(
    (product) => product.id === 'zenith-9900xtx',
  );

  return (
    <main className="home-page">
      <HeroShowcase
        boostClock={flagshipCpu?.specs.boostClock ?? '—'}
        tflops={flagshipGpu?.specs.tflops ?? 0}
        loading={loading}
      />
      {error && (
        <div className="home-page__error" role="status">
          <p>Performance data is unavailable: {error}</p>
          <button
            type="button"
            className="button button--secondary button--sm"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      )}
      <ExplodedTeardown />
      <SiliconSpotlight />
    </main>
  );
}
