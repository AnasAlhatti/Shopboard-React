import { ProductCache } from '../../components/providers/ProductCache';
import { CatalogPage } from '../../features/catalog/CatalogPage';
import { UniqueItemsPage } from '../../features/unique-items/UniqueItemsPage';
import { fetchCourseProducts } from '../../lib/products/courseProducts';
import { getHardwareProducts } from '../../lib/products/hardwareProducts';
export interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const unique = params.collection === 'unique';
  const products = unique
    ? await fetchCourseProducts()
    : await getHardwareProducts();
  return (
    <ProductCache
      key={unique ? 'unique' : 'hardware'}
      fallback={{
        [unique ? '/api/course-products' : '/api/products']: products,
      }}
    >
      {unique ? <UniqueItemsPage /> : <CatalogPage />}
    </ProductCache>
  );
}
