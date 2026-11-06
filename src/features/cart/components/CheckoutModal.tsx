import { useState } from 'react';
import { CheckCircle2, PackageCheck, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  total,
}: CheckoutModalProps) {
  const [orderNumber] = useState(
    () => `ATH-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  if (!isOpen) return null;

  return (
    <div
      className="checkout-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="checkout-modal">
        <header className="checkout-modal__header">
          <button
            type="button"
            className="checkout-close-btn"
            onClick={onClose}
            aria-label="Close checkout modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="checkout-modal__body">
          <div className="checkout-success-icon" aria-hidden="true">
            <CheckCircle2 size={54} />
          </div>

          <p className="eyebrow">Order Dispatched to Fabrication</p>
          <h2 id="checkout-title">Order Confirmed</h2>
          <p className="checkout-desc">
            Your high-performance silicon hardware has been allocated from our
            precision testing lab.
          </p>

          <dl className="checkout-receipt-box">
            <div className="receipt-row">
              <dt className="receipt-label">Order Reference</dt>
              <dd className="receipt-val">{orderNumber}</dd>
            </div>
            <div className="receipt-row">
              <dt className="receipt-label">Total Amount Paid</dt>
              <dd className="receipt-val">${total.toFixed(2)}</dd>
            </div>
            <div className="receipt-row">
              <dt className="receipt-label">Estimated Delivery</dt>
              <dd className="receipt-val">
                2–3 Business Days (Express Insured)
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className="button button--primary button--full"
            onClick={onConfirm}
          >
            <PackageCheck size={18} aria-hidden="true" />
            <span>Complete & Clear Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
