import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import type { Product } from '../types/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;

    fetchProducts()
      .then((products) => {
        if (isCurrent) setState({ products, loading: false, error: null });
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
  }, []);

  return state;
}
