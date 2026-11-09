import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CompareDock } from '../../features/compare/components/CompareDock';
import { QuickCartDrawer } from '../../features/cart/components/QuickCartDrawer';
import { Notifications } from '../../shared/notifications/Notifications';

export function ApplicationLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="app-shell">
      <Header onOpenCart={() => setCartOpen(true)} />
      <div className="route-content" key={location.pathname}>
        <Outlet />
      </div>
      <Footer />
      <CompareDock />
      <QuickCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Notifications />
    </div>
  );
}
