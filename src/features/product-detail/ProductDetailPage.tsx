import { useParams } from 'react-router-dom';
import { AsyncBoundary } from '../../shared/components/AsyncBoundary';
import { LoadingState } from '../../shared/components/LoadingState';
import { ProductDetails } from './components/ProductDetails';
import './product-detail.css';

export function ProductDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  return (
    <AsyncBoundary
      key={id}
      fallback={<LoadingState label="Loading product…" />}
    >
      <ProductDetails id={id} />
    </AsyncBoundary>
  );
}
