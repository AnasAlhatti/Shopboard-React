import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

interface QuickCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function QuickCartDrawer({ isOpen, onClose }: QuickCartDrawerProps) {
  const { items, subtotal } = useCart();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const keepFocusInside = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = event.target instanceof HTMLElement ? event.target : null;
    if (!current) return;

    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="drawer-layer"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside
        ref={dialogRef}
        className="quick-cart"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-cart-title"
        onKeyDown={keepFocusInside}
      >
        <div className="quick-cart__header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="quick-cart-title">Quick cart</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="icon-button"
            type="button"
            aria-label="Close quick cart"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="quick-cart__empty">
            Your cart is waiting for its first component.
          </p>
        ) : (
          <ul className="quick-cart__items">
            {items.map((item) => {
              const title =
                item.type === 'rig' ? item.rig?.name : item.product?.name;
              return (
                <li className="quick-cart__item" key={item.id}>
                  <span>{title ?? 'Silicon component'}</span>
                  <span>
                    {item.quantity} × {currency.format(item.unitPrice)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="quick-cart__summary">
          <span>Subtotal</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <Link
          className="button button--primary quick-cart__checkout"
          to="/cart"
          onClick={onClose}
        >
          View full cart
        </Link>
      </aside>
    </div>
  );
}
