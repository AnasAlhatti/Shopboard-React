import { isProduct } from '../../../shared/products/types/product';
import { isCourseProduct } from '../../../shared/products/types/courseProduct';
import type { BundledRig, CartItem } from '../types/cart';
const STORAGE_KEY = 'aethel-cart';
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function isRig(value: unknown): value is BundledRig {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isProduct(value.cpu) &&
    isProduct(value.gpu) &&
    typeof value.ramTier === 'string' &&
    typeof value.storageTier === 'string' &&
    (value.memoryStorage === undefined ||
      (isProduct(value.memoryStorage) &&
        value.memoryStorage.category === 'storage')) &&
    typeof value.totalPrice === 'number' &&
    Number.isFinite(value.totalPrice) &&
    value.totalPrice >= 0 &&
    typeof value.totalTdp === 'number' &&
    Number.isFinite(value.totalTdp) &&
    value.totalTdp >= 0
  );
}
function isItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0 &&
    ((value.type === 'standalone' &&
      (isProduct(value.product) || isCourseProduct(value.product))) ||
      (value.type === 'rig' && isRig(value.rig)))
  );
}
export function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? '[]',
    );
    if (!Array.isArray(value) || !value.every(isItem)) return [];
    // Projection migrates older entries by dropping their duplicate unitPrice.
    return value.map((item) =>
      item.type === 'standalone'
        ? {
            id: item.id,
            type: 'standalone',
            quantity: item.quantity,
            product: item.product,
          }
        : { id: item.id, type: 'rig', quantity: item.quantity, rig: item.rig },
    );
  } catch {
    return [];
  }
}
export function writeCart(items: CartItem[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
