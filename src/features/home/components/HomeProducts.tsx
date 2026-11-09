'use client';
import { RefreshNotice } from '../../../components/ui/RefreshNotice';
import { useProducts } from '../../../shared/products/hooks/useProducts';
import { ArchitectureStory } from './ArchitectureStory';
import { HeroShowcase } from './HeroShowcase';
import { SiliconSpotlight } from './SiliconSpotlight';

export function HomeProducts() {
  const { products, error, refresh } = useProducts();
  const cpu = products.find((product) => product.id === 'vortex-9950x');
  const gpu = products.find((product) => product.id === 'zenith-9900xtx');
  return (
    <>
      {Boolean(error) && (
        <div className="mx-auto w-shell max-w-page">
          <RefreshNotice error={error} onRefresh={refresh} />
        </div>
      )}
      <HeroShowcase cpu={cpu} gpu={gpu} loading={false} />
      <ArchitectureStory cpu={cpu} />
      <SiliconSpotlight cpu={cpu} gpu={gpu} />
    </>
  );
}
