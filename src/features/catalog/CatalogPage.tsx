import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { LoadingState } from '../../shared/async/LoadingState';
import { CatalogBrowser } from './components/CatalogBrowser';
export function CatalogPage() {
  return (
    <main className="py-8 w-shell max-w-page mx-auto">
      <header className="mb-8">
        <p className="mb-3 text-xs font-extrabold tracking-widest uppercase text-muted max-w-prose">
          Silicon Storefront
        </p>
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-1">
          Engineered for absolute compute.
        </h1>
        <p className="text-muted max-w-prose">
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
