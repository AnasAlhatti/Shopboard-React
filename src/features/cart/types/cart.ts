import type { Product } from '../../../shared/types/product';

export interface BundledRig {
  id: string;
  name: string;
  cpu: Product;
  gpu: Product;
  ramTier: string;
  storageTier: string;
  totalPrice: number;
  totalTdp: number;
}

export interface CartItem {
  id: string;
  type: 'standalone' | 'rig';
  product?: Product;
  rig?: BundledRig;
  quantity: number;
  unitPrice: number;
}

export interface CartContextValue {
  items: CartItem[];
  appliedPromo: string | null;
  applyPromo: (code: string) => boolean;
  addToCart: (product: Product, quantity?: number) => void;
  addRigToCart: (rig: BundledRig) => void;
  unbundleRig: (cartItemId: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}
