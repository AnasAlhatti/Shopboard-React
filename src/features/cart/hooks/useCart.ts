import { useContext } from 'react';
import { useHydrated } from '../../../shared/hooks/useHydrated';
import { CartContext } from '../context/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  const hydrated = useHydrated();
  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }

  // A nested Suspense boundary can hydrate after the provider has restored storage.
  // Each consumer must still match its own original server snapshot first.
  return hydrated
    ? context
    : {
        ...context,
        items: [],
        subtotal: 0,
        itemCount: 0,
        appliedPromo: null,
        restored: false,
      };
}
