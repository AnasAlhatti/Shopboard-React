import { usePathname } from 'next/navigation';
import NotFound from '../app/not-found';
import { ApplicationLayout } from '../components/layout/ApplicationLayout';
import { CartPage } from '../features/cart/CartPage';
import { CartProvider } from '../features/cart/context/CartContext';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { CompareProvider } from '../features/compare/context/CompareContext';
import { NextTestRouter } from './NextTestRouter';
export function TestApplication() {
  const path = usePathname();
  return (
    <NextTestRouter>
      <CartProvider>
        <CompareProvider>
          <ApplicationLayout>
            {path === '/cart' ? (
              <CartPage />
            ) : path === '/checkout' ? (
              <CheckoutPage />
            ) : (
              <NotFound />
            )}
          </ApplicationLayout>
        </CompareProvider>
      </CartProvider>
    </NextTestRouter>
  );
}
