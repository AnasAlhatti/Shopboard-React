'use client';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { notify } from '../../shared/notifications/notify';
import { useCart } from '../cart/hooks/useCart';
import { getCartItemPrice } from '../cart/utils/cartOperations';
import { calculateOrderTotals } from '../cart/utils/orderTotals';
import { CheckoutForm } from './components/CheckoutForm';
import type { CheckoutValues } from './schemas/checkoutSchema';
interface OrderReceipt {
  reference: string;
  total: number;
  name: string;
}

export function CheckoutPage() {
  const { restored, items, subtotal, appliedPromo, clearCart } = useCart();
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
  if (restored === false)
    return (
      <main role="status" className="mx-auto w-shell max-w-page py-12">
        Restoring your cart…
      </main>
    );
  if (receipt)
    return (
      <main className="pt-12 pb-20 w-shell max-w-page mx-auto">
        <section className="max-w-96" role="status">
          <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
            Demo order
          </p>
          <h1 className="text-3xl lg:text-6xl">Order confirmed</h1>
          <p>
            Thank you, {receipt.name}. Your demo order is complete. No payment
            was taken.
          </p>
          <dl>
            <div className="flex justify-between gap-4 my-4 text-sm">
              <dt>Reference</dt>
              <dd className="m-0 tabular-nums">{receipt.reference}</dd>
            </div>
            <div className="flex justify-between gap-4 my-4 text-sm">
              <dt>Order total</dt>
              <dd className="m-0 tabular-nums">${receipt.total.toFixed(2)}</dd>
            </div>
          </dl>
          <Button asChild variant="primary" size="lg">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </section>
      </main>
    );
  if (items.length === 0)
    return (
      <main className="pt-12 pb-20 w-shell max-w-page mx-auto">
        <h1 className="text-3xl lg:text-6xl">Your cart is empty</h1>
        <p>Add hardware before proceeding to checkout.</p>
        <Button asChild variant="primary" size="lg">
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
    );
  return (
    <main className="pt-12 pb-20 w-shell max-w-page mx-auto">
      <header>
        <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase">
          Checkout
        </p>
        <h1 className="text-3xl lg:text-6xl">Contact and delivery details</h1>
        <Link
          className="inline-flex w-fit min-h-11 items-center gap-2.5 text-muted text-xs no-underline hover:text-foreground"
          href="/cart"
        >
          Back to cart
        </Link>
      </header>
      <div className="grid gap-8 mt-8 md:grid-cols-2">
        <CheckoutForm onSubmit={placeOrder} disabled={items.length === 0} />
        <aside
          className="p-6 border border-border rounded-card bg-surface"
          aria-labelledby="checkout-summary-title"
        >
          <h2 id="checkout-summary-title">Order summary</h2>
          <ul className="p-0 list-none">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-4 my-4 text-sm"
              >
                <span>
                  {item.product?.name ?? item.rig?.name} × {item.quantity}
                </span>
                <strong>
                  ${(item.quantity * getCartItemPrice(item)).toFixed(2)}
                </strong>
              </li>
            ))}
          </ul>
          <dl>
            <div className="flex justify-between gap-4 my-4 text-sm">
              <dt className="text-muted">Subtotal</dt>
              <dd className="m-0 tabular-nums">${subtotal.toFixed(2)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between gap-4 my-4 text-sm">
                <dt className="text-muted">Promo discount</dt>
                <dd className="m-0 tabular-nums">
                  −${discountAmount.toFixed(2)}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4 my-4 text-sm">
              <dt className="text-muted">Estimated tax (7%)</dt>
              <dd className="m-0 tabular-nums">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between gap-4 my-4 text-sm">
              <dt className="text-muted">Total</dt>
              <dd className="m-0 tabular-nums">${total.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
