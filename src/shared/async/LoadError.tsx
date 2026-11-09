import type { FallbackProps } from 'react-error-boundary';

export function LoadError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-8 text-muted" role="alert">
      <h2 className="text-foreground">Something went wrong</h2>
      <p>
        {error instanceof Error
          ? error.message
          : 'This section could not be loaded.'}
      </p>
      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center gap-2.5 py-3 px-4 border rounded-lg font-bold no-underline transition motion-reduce:transition-none duration-150 motion-safe:enabled:active:scale-95 motion-safe:enabled:active:duration-150 motion-reduce:duration-150 border-foreground/15 bg-surface text-foreground hover:border-foreground/35 hover:bg-foreground/10 hover:text-foreground"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}
