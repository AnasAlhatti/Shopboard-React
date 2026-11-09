import type { Product } from '../../../shared/products/types/product';
import type { CourseProduct } from '../../../shared/products/types/courseProduct';
export type CartProduct = Product | CourseProduct;
export interface BundledRig {
  id: string;
  name: string;
  cpu: Product;
  gpu: Product;
  ramTier: string;
  storageTier: string;
  memoryStorage?: Product;
  totalPrice: number;
  totalTdp: number;
}
interface CartLine {
  id: string;
  quantity: number;
}
export type CartItem = CartLine &
  (
    | { type: 'standalone'; product: CartProduct; rig?: never }
    | { type: 'rig'; rig: BundledRig; product?: never }
  );
export interface CartContextValue {
  items: CartItem[];
  appliedPromo: string | null;
  applyPromo: (code: string) => boolean;
  addToCart: (product: CartProduct, quantity?: number) => void;
  addRigToCart: (rig: BundledRig) => void;
  unbundleRig: (cartItemId: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}
