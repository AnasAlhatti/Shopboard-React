'use client';
import type { ReactNode } from 'react';
import { Suspense, useState } from 'react';
import { QuickCartDrawer } from '../../features/cart/components/QuickCartDrawer';
import { CompareDock } from '../../features/compare/components/CompareDock';
import { Notifications } from '../../shared/notifications/Notifications';
import { Footer } from './Footer';
import { Header } from './Header';

export interface ApplicationLayoutProps {
  children: ReactNode;
}
export function ApplicationLayout({ children }: ApplicationLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="min-h-18" />}>
        <Header onOpenCart={() => setCartOpen(true)} />
      </Suspense>
      <div className="flex-1">{children}</div>
      <Footer />
      <CompareDock />
      <QuickCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Notifications />
    </div>
  );
}
