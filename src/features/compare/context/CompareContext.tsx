'use client';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHydrated } from '../../../shared/hooks/useHydrated';
import { notify } from '../../../shared/notifications/notify';
import {
  isProduct,
  type Product,
} from '../../../shared/products/types/product';
import type { CompareContextValue } from '../types/compare';

const STORAGE_KEY = 'aethel-compare';

function readStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isProduct)) return [];
    const category = parsed[0]?.category;
    return parsed.length <= 4 &&
      new Set(parsed.map((product) => product.id)).size === parsed.length &&
      parsed.every((product) => product.category === category)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export interface CompareProviderProps {
  children: ReactNode;
}
export function CompareProvider({ children }: CompareProviderProps) {
  const [comparedItems, setComparedItems] =
    useState<Product[]>(readStoredProducts);
  const restored = useHydrated();
  const category = comparedItems[0]?.category ?? null;

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedItems));
    } catch {
      notify.error(
        'Comparisons are available for this visit, but browser storage could not save them.',
        { id: 'compare-storage' },
      );
    }
  }, [comparedItems, restored]);

  const toggleCompare = useCallback(
    (product: Product) => {
      if (!restored) return;
      const isSelected = comparedItems.some((item) => item.id === product.id);
      if (!isSelected && category && category !== product.category) {
        notify.error(
          `Compare mode is locked to ${category.toUpperCase()} products. Clear the bench to switch categories.`,
          { id: 'compare-rejection' },
        );
        return;
      }
      if (!isSelected && comparedItems.length >= 4) {
        notify.error(
          'The comparison bench holds four products. Remove one before adding another.',
          { id: 'compare-rejection' },
        );
        return;
      }

      setComparedItems((current) => {
        if (current.some((item) => item.id === product.id)) {
          return current.filter((item) => item.id !== product.id);
        }
        if (
          current.length >= 4 ||
          (current.length > 0 && current[0].category !== product.category)
        ) {
          return current;
        }
        return [...current, product];
      });
    },
    [category, comparedItems, restored],
  );

  const removeFromCompare = useCallback(
    (id: string) =>
      setComparedItems((current) =>
        current.filter((product) => product.id !== id),
      ),
    [],
  );
  const clearCompare = useCallback(() => setComparedItems([]), []);
  const isInCompare = useCallback(
    (id: string) => comparedItems.some((product) => product.id === id),
    [comparedItems],
  );

  const value = useMemo<CompareContextValue>(
    () => ({
      comparedItems: restored ? comparedItems : [],
      category: restored ? category : null,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    }),
    [
      comparedItems,
      restored,
      category,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    ],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}
