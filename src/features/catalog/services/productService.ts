import { queryOptions } from '@tanstack/react-query';
import { ApiError, getJson } from '../../../shared/api/apiClient';
import { isProduct, type Product } from '../../../shared/types/product';

const PRODUCTS_URL = `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/products`;

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

export const productListQuery = queryOptions({
  queryKey: ['products'],
  queryFn: ({ signal }) => fetchProducts({ signal }),
});
export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: ({ signal }) => fetchProductById(id, { signal }),
  });
