import { useEffect, useState } from 'react';
import { fetchProducts, getCachedProducts } from '../services/productService';
import type { Product } from '../types/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>(() => {
    const cached = getCachedProducts();
    return {
      products: cached ?? [],
      loading: cached === null,
      error: null,
    };
  });

  useEffect(() => {
    let isCurrent = true;

    if (state.products.length > 0 && !state.loading) {
      return;
    }

    fetchProducts()
      .then((products) => {
        if (isCurrent) {
          setState({ products, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load silicon products.';
        setState({ products: [], loading: false, error: message });
      });

    return () => {
      isCurrent = false;
    };
  }, [state.products.length, state.loading]);

  return state;
}
