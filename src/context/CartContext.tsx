import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { BundledRig, CartContextValue, CartItem } from '../types/cart';
import type { Product } from '../types/product';

const STORAGE_KEY = 'aethel-cart';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value) || !isRecord(value.specs) || !isRecord(value.benchmarks))
    return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.category === 'cpu' || value.category === 'gpu') &&
    typeof value.price === 'number' &&
    typeof value.image === 'string' &&
    typeof value.specs.boostClock === 'string' &&
    typeof value.specs.tdp === 'number' &&
    typeof value.benchmarks.efficiencyScore === 'number' &&
    Array.isArray(value.features)
  );
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
    typeof value.totalTdp === 'number'
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || typeof value.id !== 'string') return false;
  if (typeof value.quantity !== 'number' || value.quantity < 1) return false;
  if (typeof value.unitPrice !== 'number' || value.unitPrice < 0) return false;

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

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be disabled or full; the in-memory cart remains usable.
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
    setItems((current) => [
      ...current,
      {
        id: makeCartId(),
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

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
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
    addToCart,
    addRigToCart,
    unbundleRig,
    removeFromCart,
    updateQuantity,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
