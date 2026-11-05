import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import { CartProvider } from './CartContext';
import { useCart } from '../hooks/useCart';

const product: Product = {
  id: 'vortex-9950x',
  name: 'Aethel Vortex 9950X',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Flagship Multi-Thread',
  price: 649,
  image: '/assets/cpu.jpg',
  specs: {
    cores: '16',
    threads: '32',
    boostClock: '5.9 GHz',
    cache: '80MB',
    tdp: 170,
  },
  benchmarks: { cinebenchMulti: 42000, efficiencyScore: 8.2 },
  description: 'A flagship processor.',
  features: ['3nm architecture'],
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => window.localStorage.clear());

  it('adds products and rigs, adjusts quantities, and unbundles rigs', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product, 2));
    expect(result.current.items[0]).toMatchObject({
      quantity: 2,
      unitPrice: 649,
    });

    act(() => result.current.updateQuantity(result.current.items[0].id, 3));
    expect(result.current.items[0].quantity).toBe(3);

    act(() =>
      result.current.addRigToCart({
        id: 'rig-1',
        name: 'Compute Rig',
        cpu: product,
        gpu: {
          ...product,
          id: 'zenith-9900xtx',
          name: 'Aethel Zenith 9900 XTX',
          category: 'gpu',
          price: 999,
        },
        ramTier: '32GB DDR5',
        storageTier: '2TB NVMe',
        totalPrice: 1648,
        totalTdp: 525,
      }),
    );
    const rigItem = result.current.items.find((item) => item.type === 'rig');

    expect(rigItem).toBeDefined();
    act(() => result.current.unbundleRig(rigItem!.id));
    expect(
      result.current.items.filter((item) => item.type === 'rig'),
    ).toHaveLength(0);
    const standaloneItems = result.current.items.filter(
      (item) => item.type === 'standalone',
    );
    expect(standaloneItems).toHaveLength(2);
    expect(
      standaloneItems.find((item) => item.product?.id === product.id)?.quantity,
    ).toBe(4);
    expect(
      standaloneItems.find((item) => item.product?.category === 'gpu')
        ?.quantity,
    ).toBe(1);
  });

  it('restores persisted items and ignores corrupted localStorage data', () => {
    const first = renderHook(() => useCart(), { wrapper });
    act(() => first.result.current.addToCart(product));
    first.unmount();

    const restored = renderHook(() => useCart(), { wrapper });
    expect(restored.result.current.items).toHaveLength(1);
    restored.unmount();

    window.localStorage.setItem('aethel-cart', '{broken');
    const corrupted = renderHook(() => useCart(), { wrapper });
    expect(corrupted.result.current.items).toEqual([]);
  });
});
