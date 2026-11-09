'use client';
import { ArrowRight, Check, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { calculateOrderTotals } from '../utils/orderTotals';

interface OrderSummaryProps {
  subtotal: number;
  onClearCart: () => void;
  discountAmount: number;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
}

export function OrderSummary({
  subtotal,
  onClearCart,
  discountAmount,
  appliedPromo,
  onApplyPromo,
}: OrderSummaryProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoError(false);
      setPromoInput('');
    } else {
      setPromoError(true);
    }
  };

  const { tax, total } = calculateOrderTotals(subtotal, appliedPromo);

  return (
    <aside
      className="bg-surface border border-border rounded-lg p-8 flex flex-col gap-6"
      aria-labelledby="order-summary-title"
    >
      <h2
        id="order-summary-title"
        className="text-xl font-extrabold m-0 border-b border-border pb-2"
      >
        Order Summary
      </h2>

      <dl className="m-0 flex flex-col gap-3">
        <div className="flex items-baseline justify-between text-sm">
          <dt className="text-muted flex items-center gap-1.5 font-normal">
            Hardware Subtotal
          </dt>
          <dd className="m-0 font-bold text-foreground tabular-nums">
            ${subtotal.toLocaleString()}
          </dd>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-baseline justify-between text-sm text-muted">
            <dt className="flex items-center gap-1.5 font-normal text-muted">
              <Tag size={13} aria-hidden="true" /> Promo ({appliedPromo})
            </dt>
            <dd className="m-0 font-bold tabular-nums text-muted">
              -${discountAmount.toFixed(2)}
            </dd>
          </div>
        )}

        <div className="flex items-baseline justify-between text-sm">
          <dt className="text-muted flex items-center gap-1.5 font-normal">
            Estimated Tax (7%)
          </dt>
          <dd className="m-0 font-bold text-foreground tabular-nums">
            ${tax.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between text-sm">
          <dt className="text-muted flex items-center gap-1.5 font-normal">
            Insured Express Shipping
          </dt>
          <dd className="m-0 font-bold tabular-nums text-muted">
            Complimentary
          </dd>
        </div>

        <div className="flex items-baseline justify-between text-sm border-t border-border pt-4 mt-1">
          <dt className="flex items-center gap-1.5 text-base font-extrabold text-foreground">
            Final Order Total
          </dt>
          <dd className="m-0 tabular-nums text-2xl font-extrabold text-primary">
            ${total.toFixed(2)}
          </dd>
        </div>
      </dl>

      {/* Promo Code Form */}
      <form onSubmit={handleApply} className="flex flex-col gap-1.5">
        <label
          htmlFor="promo-input"
          className="text-xs uppercase text-muted font-semibold"
        >
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input
            id="promo-input"
            type="text"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value);
              setPromoError(false);
            }}
            placeholder="Try SILICON10"
            className="flex-1 min-w-0 bg-background border border-border rounded-sm text-foreground py-2 px-2.5 text-sm uppercase tracking-wide"
          />
          <Button type="submit" size="sm" variant="secondary">
            Apply Promo
          </Button>
        </div>
        {promoError && (
          <p className="text-xs text-primary m-0" role="alert">
            Invalid promo code. Use code SILICON10 for 10% off.
          </p>
        )}
        {appliedPromo !== null && (
          <p
            className="text-xs text-muted flex items-center gap-1 m-0"
            role="status"
          >
            <Check size={14} aria-hidden="true" /> 10% promo applied
            successfully!
          </p>
        )}
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button asChild variant="primary" size="lg">
          <Link href="/checkout" className="w-full">
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Button>

        <Button
          variant="secondary"
          type="button"
          className="w-full text-muted"
          onClick={onClearCart}
          size="lg"
        >
          <Trash2 size={14} aria-hidden="true" />
          <span>Clear Shopping Cart</span>
        </Button>
      </div>
    </aside>
  );
}
