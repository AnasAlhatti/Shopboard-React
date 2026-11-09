import { useParams } from 'react-router-dom';
import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { UniqueItemDetails } from './components/UniqueItemDetails';
import './unique-items.css';

export function UniqueItemDetailPage() {
  const { id = '' } = useParams();
  return (
    <main className="unique-items-page page-width">
      <AsyncBoundary
        key={id}
        fallback={<LoadingState label="Loading unique item…" />}
      >
        <UniqueItemDetails id={id} />
      </AsyncBoundary>
    </main>
  );
}
