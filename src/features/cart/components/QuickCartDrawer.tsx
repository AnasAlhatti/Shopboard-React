'use client';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useCart } from '../hooks/useCart';
import { getCartItemPrice } from '../utils/cartOperations';
export interface QuickCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export function QuickCartDrawer({ isOpen, onClose }: QuickCartDrawerProps) {
  const { items, subtotal } = useCart();
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Quick cart"
      placement="drawer"
      closeLabel="Close quick cart"
    >
      <div className="flex min-h-80 flex-col">
        {items.length === 0 ? (
          <p className="my-12">Your cart is waiting for its first item.</p>
        ) : (
          <ul className="my-8 grid list-none gap-3 p-0">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-border py-3 text-sm text-muted"
              >
                <span>
                  {item.type === 'rig' ? item.rig.name : item.product.name}
                </span>
                <span>
                  {item.quantity} × {currency.format(getCartItemPrice(item))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex justify-between border-t border-border py-4">
          <span>Subtotal</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <Button asChild>
          <Link href="/cart" onClick={onClose}>
            View full cart
          </Link>
        </Button>
      </div>
    </Modal>
  );
}
