'use client';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useHydrated } from '../../../shared/hooks/useHydrated';
import { notify } from '../../../shared/notifications/notify';
import { readCart, writeCart } from '../storage/cartStorage';
import type {
  BundledRig,
  CartContextValue,
  CartItem,
  CartProduct,
} from '../types/cart';
import {
  addProduct,
  getCartItemPrice,
  promoCode,
  setQuantity,
  unbundle,
} from '../utils/cartOperations';
export interface CartProviderProps {
  children: ReactNode;
}
export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const restored = useHydrated();
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  useEffect(() => {
    if (restored && !writeCart(items))
      notify.error(
        'Your cart is available for this visit, but browser storage could not save it.',
        { id: 'cart-storage' },
      );
  }, [items, restored]);
  const applyPromo = useCallback((code: string) => {
    const resolved = promoCode(code);
    if (!resolved) return false;
    setAppliedPromo(resolved);
    return true;
  }, []);
  const addToCart = useCallback(
    (product: CartProduct, quantity = 1) => {
      if (!restored) return;
      setItems((current) => addProduct(current, product, quantity));
    },
    [restored],
  );
  const addRigToCart = useCallback(
    (rig: BundledRig) => {
      if (!restored) return;
      const id = `rig-${crypto.randomUUID()}`;
      setItems((current) => [
        ...current,
        { id, type: 'rig', rig, quantity: 1 },
      ]);
    },
    [restored],
  );
  const unbundleRig = useCallback(
    (id: string) => setItems((current) => unbundle(current, id)),
    [],
  );
  const removeFromCart = useCallback(
    (id: string) =>
      setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      setItems((current) => setQuantity(current, id, quantity)),
    [],
  );
  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
  }, []);
  const value = useMemo<CartContextValue>(
    () => ({
      items: restored ? items : [],
      restored,
      appliedPromo,
      applyPromo,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal: !restored
        ? 0
        : items.reduce(
            (sum, item) => sum + getCartItemPrice(item) * item.quantity,
            0,
          ),
      itemCount: !restored
        ? 0
        : items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [
      items,
      restored,
      appliedPromo,
      applyPromo,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
