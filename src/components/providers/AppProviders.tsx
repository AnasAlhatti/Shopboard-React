'use client';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { CartProvider } from '../../features/cart/context/CartContext';
import { CompareProvider } from '../../features/compare/context/CompareContext';

export interface AppProvidersProps {
  children: ReactNode;
}
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        dedupingInterval: 2000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}
    >
      <CartProvider>
        <CompareProvider>{children}</CompareProvider>
      </CartProvider>
    </SWRConfig>
  );
}
