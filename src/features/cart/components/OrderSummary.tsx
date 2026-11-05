import { useState } from 'react';
import { ArrowRight, Check, Shield, Tag, Trash2 } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  onClearCart: () => void;
  onCheckout: () => void;
  discountAmount: number;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
}

export function OrderSummary({
  subtotal,
  onClearCart,
  onCheckout,
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

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.07;
  const total = discountedSubtotal + tax;

  return (
    <aside className="order-summary-card" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-summary-title">
        Order Summary
      </h2>

      <dl className="order-summary-rows">
        <div className="summary-row">
          <dt className="summary-label">Hardware Subtotal</dt>
          <dd className="summary-val">${subtotal.toLocaleString()}</dd>
        </div>

        {discountAmount > 0 && (
          <div className="summary-row summary-row--discount">
            <dt className="summary-label">
              <Tag size={13} aria-hidden="true" /> Promo ({appliedPromo})
            </dt>
            <dd className="summary-val">-${discountAmount.toFixed(2)}</dd>
          </div>
        )}

        <div className="summary-row">
          <dt className="summary-label">Estimated Tax (7%)</dt>
          <dd className="summary-val">${tax.toFixed(2)}</dd>
        </div>

        <div className="summary-row">
          <dt className="summary-label">Insured Express Shipping</dt>
          <dd className="summary-val summary-val--free">Complimentary</dd>
        </div>

        <div className="summary-row summary-row--total">
          <dt className="summary-label">Final Order Total</dt>
          <dd className="summary-val">${total.toFixed(2)}</dd>
        </div>
      </dl>

      {/* Promo Code Form */}
      <form onSubmit={handleApply} className="promo-code-form">
        <label htmlFor="promo-input" className="promo-input-label">
          Promo Code
        </label>
        <div className="promo-input-wrap">
          <input
            id="promo-input"
            type="text"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value);
              setPromoError(false);
            }}
            placeholder="Try SILICON10"
            className="promo-input"
          />
          <button type="submit" className="button button--quiet button--sm">
            Apply Promo
          </button>
        </div>
        {promoError && (
          <p className="promo-error-msg" role="alert">
            Invalid promo code. Use code SILICON10 for 10% off.
          </p>
        )}
        {appliedPromo && (
          <p className="promo-success-msg" role="status">
            <Check size={14} aria-hidden="true" /> 10% promo applied successfully!
          </p>
        )}
      </form>

      {/* Action Buttons */}
      <div className="order-summary-actions">
        <button
          type="button"
          className="button button--primary button--full"
          onClick={onCheckout}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="button button--quiet button--full clear-cart-btn"
          onClick={onClearCart}
        >
          <Trash2 size={14} aria-hidden="true" />
          <span>Clear Shopping Cart</span>
        </button>
      </div>

      <div className="order-security-assurance">
        <Shield size={16} aria-hidden="true" />
        <span>Hardware encrypted order & guaranteed silicon integrity.</span>
      </div>
    </aside>
  );
}
