import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProductDetails } from '../features/product-detail/components/ProductDetails';
import { AsyncBoundary } from '../shared/async/AsyncBoundary';
import useSWR from 'swr';
import { fetchProductById } from '../shared/products/api/productService';
export function TestProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useSWR(
    `/api/products/${id}`,
    () => fetchProductById(id),
    { suspense: true },
  );
  return (
    <Suspense>
      <AsyncBoundary>
        <ProductDetails product={product} />
      </AsyncBoundary>
    </Suspense>
  );
}
