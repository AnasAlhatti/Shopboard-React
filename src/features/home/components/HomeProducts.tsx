import { useProducts } from '../../../shared/products/hooks/useProducts';
import { HeroShowcase } from './HeroShowcase';
import { ArchitectureStory } from './ArchitectureStory';
import { SiliconSpotlight } from './SiliconSpotlight';

export function HomeProducts() {
  const { products } = useProducts();
  const cpu = products.find((product) => product.id === 'vortex-9950x');
  const gpu = products.find((product) => product.id === 'zenith-9900xtx');
  return (
    <>
      <HeroShowcase cpu={cpu} gpu={gpu} loading={false} />
      <ArchitectureStory cpu={cpu} />
      <SiliconSpotlight cpu={cpu} gpu={gpu} />
    </>
  );
}
