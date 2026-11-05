import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '../types/product';
import { useCompare } from '../hooks/useCompare';
import { CompareProvider } from './CompareContext';

const product = (id: string, category: Product['category']): Product => ({
  id,
  name: id,
  category,
  series: 'Test Series',
  tagline: 'Test product',
  price: 100,
  image: '/assets/product.jpg',
  specs: { boostClock: '5GHz', tdp: 100 },
  benchmarks: { efficiencyScore: 5 },
  description: 'A test product.',
  features: [],
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <CompareProvider>{children}</CompareProvider>
);

describe('CompareContext', () => {
  beforeEach(() => window.localStorage.clear());

  it('locks the comparison to one category and persists selected products', () => {
    const cpu = product('vortex-9950x', 'cpu');
    const gpu = product('zenith-9900xtx', 'gpu');
    const { result, unmount } = renderHook(() => useCompare(), { wrapper });
    const warning = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    act(() => result.current.toggleCompare(cpu));
    expect(result.current.category).toBe('cpu');
    act(() => result.current.toggleCompare(gpu));
    expect(result.current.comparedItems).toEqual([cpu]);
    expect(warning).toHaveBeenCalled();
    unmount();

    const restored = renderHook(() => useCompare(), { wrapper });
    expect(restored.result.current.comparedItems).toEqual([cpu]);
    restored.unmount();

    window.localStorage.setItem('aethel-compare', '{broken');
    const corrupted = renderHook(() => useCompare(), { wrapper });
    expect(corrupted.result.current.comparedItems).toEqual([]);
  });
});
