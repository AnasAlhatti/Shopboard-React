import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { CatalogPage } from './features/catalog/CatalogPage';
import { HomePage } from './features/home/HomePage';
import { CompareDock } from './shared/components/CompareDock';
import { Footer } from './shared/components/Footer';
import { Header } from './shared/components/Header';
import { QuickCartDrawer } from './shared/components/QuickCartDrawer';

function RoutePlaceholder() {
  return (
    <main className="route-placeholder page-width">
      <p className="eyebrow">Aethel Silicon</p>
      <h1>Forged for extreme compute.</h1>
      <p>
        Explore the silicon ecosystem, compare hardware, and shape your next
        build.
      </p>
    </main>
  );
}

function ApplicationShell() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header onOpenCart={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Routes>
      <Footer />
      <CompareDock />
      <QuickCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <CompareProvider>
          <ApplicationShell />
        </CompareProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
