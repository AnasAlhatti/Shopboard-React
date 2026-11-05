import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CompareContextValue } from '../types/compare';
import type { Product } from '../types/product';

const STORAGE_KEY = 'aethel-compare';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value) || !isRecord(value.specs) || !isRecord(value.benchmarks))
    return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.category === 'cpu' || value.category === 'gpu') &&
    typeof value.price === 'number' &&
    typeof value.image === 'string' &&
    typeof value.specs.boostClock === 'string' &&
    typeof value.specs.tdp === 'number' &&
    typeof value.benchmarks.efficiencyScore === 'number' &&
    Array.isArray(value.features)
  );
}

function readStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isProduct)) return [];
    const category = parsed[0]?.category;
    return parsed.every((product) => product.category === category)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparedItems, setComparedItems] =
    useState<Product[]>(readStoredProducts);
  const category = comparedItems[0]?.category ?? null;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedItems));
    } catch {
      // Keep comparisons available in memory if browser storage is unavailable.
    }
  }, [comparedItems]);

  const toggleCompare = useCallback(
    (product: Product) => {
      const isSelected = comparedItems.some((item) => item.id === product.id);
      if (!isSelected && category && category !== product.category) {
        console.warn(
          `Compare mode is locked to ${category.toUpperCase()} products. Clear it to switch.`,
        );
        return;
      }

      setComparedItems((current) =>
        current.some((item) => item.id === product.id)
          ? current.filter((item) => item.id !== product.id)
          : [...current, product],
      );
    },
    [category, comparedItems],
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
      comparedItems,
      category,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    }),
    [
      comparedItems,
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
