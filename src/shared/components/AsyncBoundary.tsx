import { Suspense, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { LoadError } from './LoadError';
import { LoadingState } from './LoadingState';
import { notify } from '../notifications';

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  errorFallback?: (props: FallbackProps) => ReactNode;
}

export function AsyncBoundary({
  children,
  fallback = <LoadingState />,
  onReset,
  errorFallback,
}: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={(error) =>
            notify.error(
              error instanceof Error
                ? error.message
                : 'Unable to load this section.',
              { id: 'load-error' },
            )
          }
          onReset={() => {
            reset();
            onReset?.();
          }}
          fallbackRender={
            errorFallback ?? ((props) => <LoadError {...props} />)
          }
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
