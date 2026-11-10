'use client';
import { Card } from '@/components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { CartItemRow } from './components/CartItemRow';
import { OrderSummary } from './components/OrderSummary';
import { useCart } from './hooks/useCart';
import { calculateOrderTotals } from './utils/orderTotals';
export function CartPage() {
  const {
    restored,
    items,
    updateQuantity,
    removeFromCart,
    unbundleRig,
    clearCart,
    subtotal,
    appliedPromo,
    applyPromo,
  } = useCart();

  const { discountAmount } = calculateOrderTotals(subtotal, appliedPromo);

  if (restored === false)
    return (
      <main role="status" className="mx-auto w-shell max-w-page py-12">
        Restoring your cart…
      </main>
    );
  if (items.length === 0) {
    return (
      <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
        <Card
          variant="flat"
          padding="none"
          className="text-center py-16 px-6 my-12"
          role="status"
        >
          <ShoppingBag
            size={48}
            className="empty-cart-icon"
            aria-hidden="true"
          />
          <p className="text-xs font-extrabold tracking-widest uppercase text-muted max-w-prose mt-0 mr-auto mb-6 ml-auto">
            Cart Status
          </p>
          <h1 className="text-3xl mt-1 mr-0 mb-2 ml-0">
            Silicon Shopping Cart Empty
          </h1>
          <p className="text-muted max-w-prose mt-0 mr-auto mb-6 ml-auto">
            You have not added any desktop processors, graphics engines, or
            custom assembled battlestations yet.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/products">
              <ArrowLeft size={16} aria-hidden="true" /> Explore Silicon Catalog
            </Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
      <header className="mb-12">
        <p className="mb-3 text-xs font-extrabold tracking-widest uppercase text-muted">
          Hardware Allocation
        </p>
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mt-1 mr-0 mb-0 ml-0">
          Silicon Shopping Cart
        </h1>
        <p className="text-muted">
          Review your selected components and custom assembled configurations.
        </p>
      </header>

      <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-12">
        <section
          className="flex flex-col gap-4"
          aria-label="Items in shopping cart"
        >
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onUnbundle={unbundleRig}
            />
          ))}
        </section>

        <OrderSummary
          subtotal={subtotal}
          onClearCart={clearCart}
          discountAmount={discountAmount}
          appliedPromo={appliedPromo}
          onApplyPromo={applyPromo}
        />
      </div>
    </main>
  );
}
