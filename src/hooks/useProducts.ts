import { useCallback, useEffect, useState } from 'react';
import { fetchProducts, getCachedProducts } from '../services/productService';
import type { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(
    () => getCachedProducts() ?? [],
  );
  const [loading, setLoading] = useState<boolean>(
    () => getCachedProducts() === null,
  );
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    if (products.length > 0 && !loading && refreshIndex === 0) {
      return;
    }

    fetchProducts({ forceRefresh: refreshIndex > 0 })
      .then((data) => {
        if (isCurrent) {
          setProducts(data);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCurrent) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load silicon products.';
        setProducts([]);
        setLoading(false);
        setError(message);
      });

    return () => {
      isCurrent = false;
    };
  }, [refreshIndex, products.length, loading]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  return {
    products,
    loading,
    error,
    retry,
  };
}
