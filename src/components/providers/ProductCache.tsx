'use client';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';

export interface ProductCacheProps {
  children: ReactNode;
  fallback: Record<string, unknown>;
}
export function ProductCache({ children, fallback }: ProductCacheProps) {
  return (
    <SWRConfig
      value={{ fallback, revalidateOnMount: false, shouldRetryOnError: false }}
    >
      {children}
    </SWRConfig>
  );
}
