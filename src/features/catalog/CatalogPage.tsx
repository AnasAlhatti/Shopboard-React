import { AsyncBoundary } from '../../shared/components/AsyncBoundary';
import { LoadingState } from '../../shared/components/LoadingState';
import { CatalogBrowser } from './components/CatalogBrowser';
import './catalog.css';

export function CatalogPage() {
  return (
    <main className="catalog-page page-width">
      <header className="catalog-header">
        <p className="eyebrow">Silicon Storefront</p>
        <h1>Engineered for absolute compute.</h1>
        <p>
          Explore desktop processors and graphics cards. Search, filter, and
          compare hardware for your next build.
        </p>
      </header>
      <AsyncBoundary fallback={<LoadingState label="Loading products…" />}>
        <CatalogBrowser />
      </AsyncBoundary>
    </main>
  );
}
