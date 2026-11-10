import type { FallbackProps } from 'react-error-boundary';
import { Button } from '../../components/ui/Button';

export function LoadError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-8 text-muted" role="alert">
      <h2 className="text-foreground">Something went wrong</h2>
      <p>
        {error instanceof Error
          ? error.message
          : 'This section could not be loaded.'}
      </p>
      <Button variant="secondary" type="button" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}
