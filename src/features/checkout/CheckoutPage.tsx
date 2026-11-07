import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/hooks/useCart';
import { calculateOrderTotals } from '../cart/utils/orderTotals';
import { notify } from '../../shared/notifications';
import { CheckoutForm } from './components/CheckoutForm';
import type { CheckoutValues } from './data/checkoutSchema';
import './checkout.css';

interface OrderReceipt {
  reference: string;
  total: number;
  name: string;
}

export function CheckoutPage() {
  const { items, subtotal, appliedPromo, clearCart } = useCart();
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const { discountAmount, tax, total } = calculateOrderTotals(
    subtotal,
    appliedPromo,
  );
  async function placeOrder(values: CheckoutValues) {
    if (items.length === 0)
      throw new Error('Your cart is empty. Add a product before checking out.');
    // This app has no payment/order backend. Confirmation is a local demo action.
    setReceipt({
      reference: `ATH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      total,
      name: values.name,
    });
    clearCart();
    notify.success('Demo order confirmed.');
  }
  if (receipt)
    return (
      <main className="checkout-page page-width">
        <section className="checkout-confirmation" role="status">
          <p className="eyebrow">Demo order</p>
          <h1>Order confirmed</h1>
          <p>
            Thank you, {receipt.name}. Your demo order is complete. No payment
            was taken.
          </p>
          <dl>
            <div>
              <dt>Reference</dt>
              <dd>{receipt.reference}</dd>
            </div>
            <div>
              <dt>Order total</dt>
              <dd>${receipt.total.toFixed(2)}</dd>
            </div>
          </dl>
          <Link to="/catalog" className="button button--primary">
            Continue shopping
          </Link>
        </section>
      </main>
    );
  if (items.length === 0)
    return (
      <main className="checkout-page page-width">
        <h1>Your cart is empty</h1>
        <p>Add hardware before proceeding to checkout.</p>
        <Link to="/catalog" className="button button--primary">
          Browse products
        </Link>
      </main>
    );
  return (
    <main className="checkout-page page-width">
      <header>
        <p className="eyebrow">Checkout</p>
        <h1>Contact and delivery details</h1>
        <Link className="home-quiet-link" to="/cart">
          Back to cart
        </Link>
      </header>
      <div className="checkout-layout">
        <CheckoutForm onSubmit={placeOrder} disabled={items.length === 0} />
        <aside
          className="checkout-summary"
          aria-labelledby="checkout-summary-title"
        >
          <h2 id="checkout-summary-title">Order summary</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.product?.name ?? item.rig?.name} × {item.quantity}
                </span>
                <strong>${(item.quantity * item.unitPrice).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            {discountAmount > 0 && (
              <div>
                <dt>Promo discount</dt>
                <dd>−${discountAmount.toFixed(2)}</dd>
              </div>
            )}
            <div>
              <dt>Estimated tax (7%)</dt>
              <dd>${tax.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
