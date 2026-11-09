'use client';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useSWRConfig } from 'swr';
import { LoadError } from './LoadError';
import { LoadingState } from './LoadingState';

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
  const { cache, mutate } = useSWRConfig();
  return (
    <ErrorBoundary
      onReset={() => {
        for (const key of cache.keys()) {
          const state = cache.get(key);
          if (state?.error) cache.set(key, { ...state, error: undefined });
        }
        void mutate(() => true);
        onReset?.();
      }}
      fallbackRender={errorFallback ?? ((props) => <LoadError {...props} />)}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
