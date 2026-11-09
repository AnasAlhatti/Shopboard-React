import { notFound } from 'next/navigation';
import { ProductDetails } from '../../../features/product-detail/components/ProductDetails';
import { UniqueItemDetails } from '../../../features/unique-items/components/UniqueItemDetails';
import { fetchCourseProduct } from '../../../lib/products/courseProducts';
import { getHardwareProduct } from '../../../lib/products/hardwareProducts';
export interface ProductPageProps {
  params: Promise<{ id: string }>;
}
export const dynamic = 'force-dynamic';
export default async function Page({ params }: ProductPageProps) {
  const { id } = await params;
  if (/^[1-9]\d*$/.test(id)) {
    const product = await fetchCourseProduct(id);
    if (!product) notFound();
    return (
      <main className="mx-auto w-shell max-w-page py-12">
        <UniqueItemDetails key={id} product={product} />
      </main>
    );
  }
  const product = await getHardwareProduct(id);
  if (!product) notFound();
  return <ProductDetails key={id} product={product} />;
}
