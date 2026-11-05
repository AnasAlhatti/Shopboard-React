import { ExplodedTeardown } from './components/ExplodedTeardown';
import { HeroShowcase } from './components/HeroShowcase';
import { SiliconSpotlight } from './components/SiliconSpotlight';
import { useProducts } from '../../hooks/useProducts';
import './home.css';

export function HomePage() {
  const { products, loading, error } = useProducts();
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
        <p className="home-page__error" role="status">
          Performance data is unavailable: {error}
        </p>
      )}
      <ExplodedTeardown />
      <SiliconSpotlight />
    </main>
  );
}
