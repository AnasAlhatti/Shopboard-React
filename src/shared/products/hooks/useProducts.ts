'use client';
import useSWR from 'swr';
import { PRODUCTS_KEY, fetchProducts } from '../api/productService';
export function useProducts() {
  const result = useSWR(PRODUCTS_KEY, () => fetchProducts(), {
    suspense: true,
  });
  return {
    products: result.data,
    error: result.error,
    refresh: () => result.mutate(),
  };
}
