import type { FallbackProps } from 'react-error-boundary';

export function LoadError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="async-state" role="alert">
      <h2>Something went wrong</h2>
      <p>
        {error instanceof Error
          ? error.message
          : 'This section could not be loaded.'}
      </p>
      <button
        type="button"
        className="button button--quiet"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}
