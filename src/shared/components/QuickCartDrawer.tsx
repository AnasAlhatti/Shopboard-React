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

  if (!isOpen) return null;

  return (
    <div className="drawer-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="quick-cart" role="dialog" aria-modal="true" aria-labelledby="quick-cart-title">
        <div className="quick-cart__header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="quick-cart-title">Quick cart</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close quick cart" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="quick-cart__empty">Your cart is waiting for its first component.</p>
        ) : (
          <ul className="quick-cart__items">
            {items.map((item) => {
              const title = item.type === 'rig' ? item.rig?.name : item.product?.name;
              return (
                <li className="quick-cart__item" key={item.id}>
                  <span>{title ?? 'Silicon component'}</span>
                  <span>{item.quantity} × {currency.format(item.unitPrice)}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="quick-cart__summary">
          <span>Subtotal</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <Link className="button button--primary quick-cart__checkout" to="/cart" onClick={onClose}>
          View full cart
        </Link>
      </aside>
    </div>
  );
}
