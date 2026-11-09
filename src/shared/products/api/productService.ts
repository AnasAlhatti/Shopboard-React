import { ApiError, getJson } from '../../../lib/apiClient';
import { isProduct, type Product } from '../types/product';

export const PRODUCTS_KEY = '/api/products';
const PRODUCTS_URL = PRODUCTS_KEY;

function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

export function fetchProducts(options?: {
  signal?: AbortSignal;
}): Promise<Product[]> {
  return getJson(PRODUCTS_URL, isProductList, 'products', options?.signal);
}

export async function fetchProductById(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<Product | null> {
  try {
    return await getJson(
      `${PRODUCTS_URL}/${encodeURIComponent(id)}`,
      isProduct,
      'product',
      options?.signal,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
