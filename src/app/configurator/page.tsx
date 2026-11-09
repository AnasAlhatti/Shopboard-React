import { ProductCache } from '../../components/providers/ProductCache';
import { ConfiguratorPage } from '../../features/configurator/ConfiguratorPage';
import { getHardwareProducts } from '../../lib/products/hardwareProducts';
export default async function Page() {
  const products = await getHardwareProducts();
  return (
    <ProductCache fallback={{ '/api/products': products }}>
      <ConfiguratorPage />
    </ProductCache>
  );
}
