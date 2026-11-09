import { isCourseProduct } from '../../../shared/products/types/courseProduct';
import type { CartItem, CartProduct } from '../types/cart';
export function getCartItemPrice(item: CartItem): number {
  return item.type === 'standalone' ? item.product.price : item.rig.totalPrice;
}
export function addProduct(
  items: CartItem[],
  product: CartProduct,
  quantity: number,
): CartItem[] {
  if (isCourseProduct(product) && !product.inStock) return items;
  const count = Math.floor(quantity);
  if (!Number.isSafeInteger(count) || count < 1) return items;
  const productId =
    'source' in product ? `${product.source}-${product.id}` : product.id;
  const id = `product-${productId}`;
  const existing = items.find((item) => item.id === id);
  if (!existing)
    return [...items, { id, type: 'standalone', product, quantity: count }];
  if (!Number.isSafeInteger(existing.quantity + count)) return items;
  return items.map((item) =>
    item.id === id ? { ...item, quantity: item.quantity + count } : item,
  );
}
export function setQuantity(
  items: CartItem[],
  id: string,
  quantity: number,
): CartItem[] {
  if (!Number.isFinite(quantity)) return items;
  if (quantity <= 0) return items.filter((item) => item.id !== id);
  const count = Math.floor(quantity);
  if (!Number.isSafeInteger(count) || count < 1) return items;
  return items.map((item) =>
    item.id === id ? { ...item, quantity: count } : item,
  );
}
export function unbundle(items: CartItem[], id: string): CartItem[] {
  const item = items.find((line) => line.id === id);
  if (item?.type !== 'rig' || !item.rig.memoryStorage) return items;
  return [item.rig.cpu, item.rig.gpu, item.rig.memoryStorage].reduce(
    (remaining, product) => addProduct(remaining, product, item.quantity),
    items.filter((line) => line.id !== id),
  );
}
export function promoCode(code: string): string | null {
  return code.trim().toUpperCase() === 'SILICON10' ? 'SILICON10' : null;
}
