import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../../context/CartContext';
import { CompareContext } from '../../context/CompareContext';
import type { Product } from '../../types/product';
import { ComparePage } from './ComparePage';

const mockCpu1: Product = {
  id: 'vortex-9950x',
  name: 'Aethel Vortex 9950X',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Flagship Multi-Thread',
  price: 649,
  image: '/assets/CPU_heat_spreader_glowing_traces_eb58e993.jpg',
  specs: {
    cores: '16',
    threads: '32',
    boostClock: '5.9 GHz',
    cache: '80MB',
    tdp: 170,
  },
  benchmarks: {
    cinebenchMulti: 42000,
    blenderRenderSec: 84,
    efficiencyScore: 7.8,
  },
  description: 'Flagship processor.',
  features: ['16 cores'],
};

const mockCpu2: Product = {
  id: 'vortex-9800x3d',
  name: 'Aethel Vortex 9800X3D',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Ultimate Gaming',
  price: 479,
  image: '/assets/Sleek_minimal_CPU_processor_0f31f51b.jpg',
  specs: {
    cores: '8',
    threads: '16',
    boostClock: '5.4 GHz',
    cache: '104MB 3D',
    tdp: 120,
  },
  benchmarks: {
    cinebenchMulti: 26000,
    blenderRenderSec: 124,
    efficiencyScore: 8.9,
  },
  description: 'Gaming silicon.',
  features: ['8 cores'],
};

function renderComparePage(comparedItems: Product[] = [mockCpu1, mockCpu2]) {
  const toggleCompare = vi.fn();
  const removeFromCompare = vi.fn();
  const clearCompare = vi.fn();
  const isInCompare = (id: string) => comparedItems.some((i) => i.id === id);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={['/compare']}>
        <CartProvider>
          <CompareContext.Provider
            value={{
              comparedItems,
              category: comparedItems[0]?.category ?? null,
              toggleCompare,
              removeFromCompare,
              clearCompare,
              isInCompare,
            }}
          >
            {children}
          </CompareContext.Provider>
        </CartProvider>
      </MemoryRouter>
    );
  }

  return {
    ...render(<ComparePage />, { wrapper: Wrapper }),
    removeFromCompare,
    clearCompare,
  };
}

describe('ComparePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockCpu1, mockCpu2],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders head-to-head comparison specifications and benchmark charts', async () => {
    renderComparePage([mockCpu1, mockCpu2]);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /benchmark comparison bench/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Aethel Vortex 9950X').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Aethel Vortex 9800X3D').length).toBeGreaterThan(0);

    // Check spec labels
    expect(screen.getByText(/physical cores/i)).toBeInTheDocument();
    expect(screen.getByText(/boost clock/i)).toBeInTheDocument();

    // Check benchmark section
    expect(screen.getByText(/head-to-head benchmark bars/i)).toBeInTheDocument();
    expect(screen.getByText(/cinebench r24 multi-core/i)).toBeInTheDocument();
  });

  it('allows removing an item from comparison', () => {
    const { removeFromCompare } = renderComparePage([mockCpu1, mockCpu2]);

    const removeButtons = screen.getAllByRole('button', {
      name: /remove .* from compare/i,
    });
    expect(removeButtons.length).toBe(2);

    fireEvent.click(removeButtons[0]);
    expect(removeFromCompare).toHaveBeenCalledWith('vortex-9950x');
  });

  it('shows empty comparison state when no products are selected', () => {
    renderComparePage([]);

    expect(screen.getByRole('heading', { name: /comparison bench empty/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore catalog/i })).toHaveAttribute('href', '/catalog');
  });
});
