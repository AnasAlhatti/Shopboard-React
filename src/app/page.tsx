import { ProductCache } from '../components/providers/ProductCache';
import { HomePage } from '../features/home/HomePage';
import { getHardwareProducts } from '../lib/products/hardwareProducts';
export default async function Page() {
  const products = await getHardwareProducts();
  return (
    <ProductCache fallback={{ '/api/products': products }}>
      <HomePage />
    </ProductCache>
  );
}
