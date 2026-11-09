import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  BundledRig,
  CartContextValue,
  CartItem,
  CartProduct,
} from '../types/cart';
import { readCart, writeCart } from '../storage/cartStorage';
import {
  addProduct,
  getCartItemPrice,
  promoCode,
  setQuantity,
  unbundle,
} from '../utils/cartOperations';
import { notify } from '../../../shared/notifications/notify';
export interface CartProviderProps {
  children: ReactNode;
}
export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  useEffect(() => {
    if (!writeCart(items))
      notify.error(
        'Your cart is available for this visit, but browser storage could not save it.',
        { id: 'cart-storage' },
      );
  }, [items]);
  const applyPromo = useCallback((code: string) => {
    const resolved = promoCode(code);
    if (!resolved) return false;
    setAppliedPromo(resolved);
    return true;
  }, []);
  const addToCart = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => addProduct(current, product, quantity));
  }, []);
  const addRigToCart = useCallback((rig: BundledRig) => {
    const id = `rig-${crypto.randomUUID()}`;
    setItems((current) => [...current, { id, type: 'rig', rig, quantity: 1 }]);
  }, []);
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
      items,
      appliedPromo,
      applyPromo,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal: items.reduce(
        (sum, item) => sum + getCartItemPrice(item) * item.quantity,
        0,
      ),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [
      items,
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
