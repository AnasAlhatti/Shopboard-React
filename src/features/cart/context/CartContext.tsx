import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { BundledRig, CartContextValue, CartItem } from '../types/cart';
import { isProduct, type Product } from '../../../shared/types/product';
import { notify } from '../../../shared/notifications';

const STORAGE_KEY = 'aethel-cart';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBundledRig(value: unknown): value is BundledRig {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isProduct(value.cpu) &&
    isProduct(value.gpu) &&
    typeof value.ramTier === 'string' &&
    typeof value.storageTier === 'string' &&
    typeof value.totalPrice === 'number' &&
    Number.isFinite(value.totalPrice) &&
    value.totalPrice >= 0 &&
    typeof value.totalTdp === 'number' &&
    Number.isFinite(value.totalTdp) &&
    value.totalTdp >= 0
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || typeof value.id !== 'string') return false;
  if (
    typeof value.quantity !== 'number' ||
    !Number.isSafeInteger(value.quantity) ||
    value.quantity < 1
  )
    return false;
  if (
    typeof value.unitPrice !== 'number' ||
    !Number.isFinite(value.unitPrice) ||
    value.unitPrice < 0
  )
    return false;

  return value.type === 'standalone'
    ? isProduct(value.product)
    : value.type === 'rig' && isBundledRig(value.rig);
}

function readStoredItems(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isCartItem) ? parsed : [];
  } catch {
    return [];
  }
}

function makeCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function productItem(product: Product, quantity = 1): CartItem {
  return {
    id: `product-${product.id}`,
    type: 'standalone',
    product,
    quantity,
    unitPrice: product.price,
  };
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const applyPromo = useCallback((code: string) => {
    if (code.trim().toUpperCase() !== 'SILICON10') return false;
    setAppliedPromo('SILICON10');
    return true;
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      notify.error(
        'Your cart is available for this visit, but browser storage could not save it.',
        { id: 'cart-storage' },
      );
    }
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    const count = Math.floor(quantity);
    if (count < 1) return;

    setItems((current) => {
      const existing = current.find(
        (item) => item.type === 'standalone' && item.product?.id === product.id,
      );
      if (!existing) return [...current, productItem(product, count)];

      return current.map((item) =>
        item.id === existing.id
          ? { ...item, quantity: item.quantity + count }
          : item,
      );
    });
  }, []);

  const addRigToCart = useCallback((rig: BundledRig) => {
    const id = makeCartId();
    setItems((current) => [
      ...current,
      {
        id,
        type: 'rig',
        rig,
        quantity: 1,
        unitPrice: rig.totalPrice,
      },
    ]);
  }, []);

  const unbundleRig = useCallback((cartItemId: string) => {
    setItems((current) => {
      const item = current.find(
        (candidate) => candidate.id === cartItemId && candidate.type === 'rig',
      );
      if (!item?.rig) return current;

      let remaining = current.filter(
        (candidate) => candidate.id !== cartItemId,
      );
      for (const product of [item.rig.cpu, item.rig.gpu]) {
        const existing = remaining.find(
          (candidate) =>
            candidate.type === 'standalone' &&
            candidate.product?.id === product.id,
        );
        if (existing) {
          remaining = remaining.map((candidate) =>
            candidate.id === existing.id
              ? { ...candidate, quantity: candidate.quantity + item.quantity }
              : candidate,
          );
        } else {
          remaining.push(productItem(product, item.quantity));
        }
      }
      return remaining;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    const count = Math.floor(quantity);
    if (count < 1) return;
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: count } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      appliedPromo,
      applyPromo,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    };
  }, [
    items,
    appliedPromo,
    applyPromo,
    addToCart,
    addRigToCart,
    unbundleRig,
    removeFromCart,
    updateQuantity,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
