import { useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItemRow } from './components/CartItemRow';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSummary } from './components/OrderSummary';
import './cart.css';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    unbundleRig,
    clearCart,
    subtotal,
  } = useCart();

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const discountAmount = appliedPromo === 'SILICON10' ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount) * 1.07;

  const handleApplyPromo = (code: string) => {
    if (code.toUpperCase() === 'SILICON10') {
      setAppliedPromo('SILICON10');
      return true;
    }
    return false;
  };

  const handleConfirmOrder = () => {
    setCheckoutOpen(false);
    clearCart();
    setAppliedPromo(null);
  };

  if (items.length === 0) {
    return (
      <main className="cart-page page-width">
        <div className="cart-empty" role="status">
          <ShoppingBag size={48} className="empty-cart-icon" aria-hidden="true" />
          <p className="eyebrow">Cart Status</p>
          <h1>Silicon Shopping Cart Empty</h1>
          <p>
            You have not added any desktop processors, graphics engines, or custom assembled battlestations yet.
          </p>
          <Link to="/catalog" className="button button--primary">
            <ArrowLeft size={16} aria-hidden="true" /> Explore Silicon Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page page-width">
      <header className="cart-header">
        <p className="eyebrow">Hardware Allocation</p>
        <h1>Silicon Shopping Cart</h1>
        <p>Review your selected components and custom assembled configurations.</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items-list" aria-label="Items in shopping cart">
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
          onCheckout={() => setCheckoutOpen(true)}
          discountAmount={discountAmount}
          appliedPromo={appliedPromo}
          onApplyPromo={handleApplyPromo}
        />
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleConfirmOrder}
        total={finalTotal}
      />
    </main>
  );
}
