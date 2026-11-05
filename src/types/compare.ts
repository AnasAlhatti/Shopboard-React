import type { Product } from './product';

export interface CompareContextValue {
  comparedItems: Product[];
  category: Product['category'] | null;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}
