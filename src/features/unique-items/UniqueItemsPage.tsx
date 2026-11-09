import Link from 'next/link';
import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { UniqueItemsList } from './components/UniqueItemsList';
export function UniqueItemsPage() {
  return (
    <main className="pt-12 pb-16 w-shell max-w-page mx-auto">
      <header className="mb-8">
        <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
          The class collection
        </p>
        <h1 className="text-3xl lg:text-6xl">Unique Items</h1>
        <p>
          A small collection of everyday essentials, alongside our silicon
          range.
        </p>
        <Link href="/products">Back to hardware</Link>
      </header>
      <AsyncBoundary fallback={<LoadingState label="Loading unique items…" />}>
        <UniqueItemsList />
      </AsyncBoundary>
    </main>
  );
}
