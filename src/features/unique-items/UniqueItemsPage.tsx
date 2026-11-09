import { Link } from 'react-router-dom';
import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { UniqueItemsList } from './components/UniqueItemsList';
import './unique-items.css';

export function UniqueItemsPage() {
  return (
    <main className="unique-items-page page-width">
      <header>
        <p className="eyebrow">The class collection</p>
        <h1>Unique Items</h1>
        <p>
          A small collection of everyday essentials, alongside our silicon
          range.
        </p>
        <Link to="/catalog">Back to hardware</Link>
      </header>
      <AsyncBoundary fallback={<LoadingState label="Loading unique items…" />}>
        <UniqueItemsList />
      </AsyncBoundary>
    </main>
  );
}
