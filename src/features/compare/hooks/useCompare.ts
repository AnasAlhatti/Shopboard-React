import { useContext } from 'react';
import { useHydrated } from '../../../shared/hooks/useHydrated';
import { CompareContext } from '../context/CompareContext';

export function useCompare() {
  const context = useContext(CompareContext);
  const hydrated = useHydrated();
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider.');
  }

  return hydrated
    ? context
    : {
        ...context,
        comparedItems: [],
        category: null,
        isInCompare: () => false,
      };
}
