import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../../context/CartContext';
import { CompareProvider } from '../../context/CompareContext';
import type { Product } from '../../types/product';
import { ProductDetailPage } from './ProductDetailPage';

const mockProduct: Product = {
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
  description: 'Forged for high-concurrency 3D rendering and compilation.',
  features: [
    '16 cores / 32 threads on 3nm lithography',
    '80MB unified high-speed cache architecture',
    'Native PCIe 5.0 high-bandwidth interconnects',
  ],
};

function renderWithRoute(initialPath: string) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>
        <CartProvider>
          <CompareProvider>
            <Routes>
              <Route path="/product/:id" element={children} />
              <Route path="*" element={<div>Not found page</div>} />
            </Routes>
          </CompareProvider>
        </CartProvider>
      </MemoryRouter>
    );
  }

  return render(<ProductDetailPage />, { wrapper: Wrapper });
}

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [mockProduct] }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders product specifications, features, and benchmarks', async () => {
    renderWithRoute('/product/vortex-9950x');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Aethel Vortex 9950X',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Flagship Multi-Thread')).toBeInTheDocument();
    expect(screen.getByText('$649')).toBeInTheDocument();
    expect(screen.getByText('5.9 GHz')).toBeInTheDocument();
    expect(screen.getByText('80MB')).toBeInTheDocument();
    expect(screen.getByText(/16 cores \/ 32 threads/i)).toBeInTheDocument();
  });

  it('allows adjusting quantity and adding to cart', async () => {
    renderWithRoute('/product/vortex-9950x');

    await screen.findByRole('heading', {
      level: 1,
      name: 'Aethel Vortex 9950X',
    });
    const qtyInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(qtyInput, { target: { value: '2' } });

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/added 2 unit\(s\) of aethel vortex 9950x to cart/i)).toBeInTheDocument();
  });

  it('shows graceful missing state for unknown product id', async () => {
    renderWithRoute('/product/unknown-chip');

    expect(await screen.findByText(/silicon not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /return to catalog/i }),
    ).toHaveAttribute('href', '/catalog');
  });
});
