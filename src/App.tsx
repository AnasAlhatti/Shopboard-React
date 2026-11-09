import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './features/cart/context/CartContext';
import { CompareProvider } from './features/compare/context/CompareContext';
import { queryClient } from './shared/api/queryClient';
import { ApplicationLayout } from './app/layout/ApplicationLayout';
import { createLazyPage } from './app/routing/createLazyPage';

const pages = {
  uniqueItems: createLazyPage(() =>
    import('./features/unique-items/UniqueItemsPage').then((module) => ({
      default: module.UniqueItemsPage,
    })),
  ),
  uniqueItem: createLazyPage(() =>
    import('./features/unique-items/UniqueItemDetailPage').then((module) => ({
      default: module.UniqueItemDetailPage,
    })),
  ),
  home: createLazyPage(() =>
    import('./features/home/HomePage').then((module) => ({
      default: module.HomePage,
    })),
  ),
  catalog: createLazyPage(() =>
    import('./features/catalog/CatalogPage').then((module) => ({
      default: module.CatalogPage,
    })),
  ),
  product: createLazyPage(() =>
    import('./features/product-detail/ProductDetailPage').then((module) => ({
      default: module.ProductDetailPage,
    })),
  ),
  compare: createLazyPage(() =>
    import('./features/compare/ComparePage').then((module) => ({
      default: module.ComparePage,
    })),
  ),
  configurator: createLazyPage(() =>
    import('./features/configurator/ConfiguratorPage').then((module) => ({
      default: module.ConfiguratorPage,
    })),
  ),
  cart: createLazyPage(() =>
    import('./features/cart/CartPage').then((module) => ({
      default: module.CartPage,
    })),
  ),
  checkout: createLazyPage(() =>
    import('./features/checkout/CheckoutPage').then((module) => ({
      default: module.CheckoutPage,
    })),
  ),
  notFound: createLazyPage(() =>
    import('./features/not-found/NotFoundPage').then((module) => ({
      default: module.NotFoundPage,
    })),
  ),
};

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <CompareProvider>
            <Routes>
              <Route element={<ApplicationLayout />}>
                <Route path="unique-items" element={<pages.uniqueItems />} />
                <Route path="unique-items/:id" element={<pages.uniqueItem />} />
                <Route index element={<pages.home />} />
                <Route path="catalog" element={<pages.catalog />} />
                <Route path="product/:id" element={<pages.product />} />
                <Route path="compare" element={<pages.compare />} />
                <Route path="configurator" element={<pages.configurator />} />
                <Route path="cart" element={<pages.cart />} />
                <Route path="checkout" element={<pages.checkout />} />
                <Route path="*" element={<pages.notFound />} />
              </Route>
            </Routes>
          </CompareProvider>
        </CartProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
