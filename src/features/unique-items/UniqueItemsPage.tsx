import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { UniqueItemsList } from './components/UniqueItemsList';
export function UniqueItemsPage() {
  return (
    <main className="pt-8 pb-12 w-shell max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="mb-3 text-3xl lg:text-4xl">Unique Items</h1>
        <p className="m-0 max-w-prose text-base">
          Everyday essentials from the class collection.
        </p>
      </header>
      <AsyncBoundary fallback={<LoadingState label="Loading unique items…" />}>
        <UniqueItemsList />
      </AsyncBoundary>
    </main>
  );
}
