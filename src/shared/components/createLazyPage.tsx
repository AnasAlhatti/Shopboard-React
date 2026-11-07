import { lazy, type ComponentType } from 'react';
import { AsyncBoundary } from './AsyncBoundary';

// Call at module scope so ordinary renders preserve the page's identity and state.
export function createLazyPage(
  load: () => Promise<{ default: ComponentType }>,
) {
  let Page = lazy(load);
  function retryImport() {
    // React caches a rejected lazy import; a retry requires a fresh identity.
    Page = lazy(load);
  }
  function PageContent() {
    return <Page />;
  }
  return function LazyPage() {
    return (
      <AsyncBoundary onReset={retryImport}>
        <PageContent />
      </AsyncBoundary>
    );
  };
}
