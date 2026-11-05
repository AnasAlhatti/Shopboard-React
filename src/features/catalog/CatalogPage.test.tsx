import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../../context/CartContext';
import { CompareProvider } from '../../context/CompareContext';
import type { Product } from '../../types/product';
import { CatalogPage } from './CatalogPage';

const mockProducts: Product[] = [
  {
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
    benchmarks: { cinebenchMulti: 42000, efficiencyScore: 7.8 },
    description: 'A flagship processor for intense rendering workloads.',
    features: ['16 cores', '32 threads'],
  },
  {
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
    benchmarks: { cinebenchMulti: 26000, efficiencyScore: 8.9 },
    description: 'The gaming silicon benchmark.',
    features: ['8 cores', '3D V-Cache'],
  },
  {
    id: 'zenith-9900xtx',
    name: 'Aethel Zenith 9900 XTX',
    category: 'gpu',
    series: 'Zenith',
    tagline: 'Flagship 4K Ultra & AI',
    price: 999,
    image: '/assets/Sleek_minimalist_GPU_design_with._f3b58b35.jpg',
    specs: {
      boostClock: '2.8 GHz',
      vram: '24GB GDDR6',
      tflops: 88.4,
      tdp: 355,
    },
    benchmarks: { cyberpunk4k: 118, efficiencyScore: 8.4 },
    description: 'Flagship 4K gaming and compute GPU.',
    features: ['24GB GDDR6', '384-Bit bus'],
  },
];

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/catalog']}>
      <CartProvider>
        <CompareProvider>{children}</CompareProvider>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CatalogPage', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/catalog');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockProducts }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders all products and filters by category', async () => {
    render(<CatalogPage />, { wrapper: Wrapper });

    expect(await screen.findByText('Aethel Vortex 9950X')).toBeInTheDocument();
    expect(screen.getByText('Aethel Zenith 9900 XTX')).toBeInTheDocument();

    // Click GPU category filter button
    const gpuFilterButton = screen.getByRole('button', { name: /GPUs/i });
    fireEvent.click(gpuFilterButton);

    // Only GPU should remain
    expect(screen.getByText('Aethel Zenith 9900 XTX')).toBeInTheDocument();
    expect(
      screen.queryByText('Aethel Vortex 9950X'),
    ).not.toBeInTheDocument();
  });

  it('filters products by text search', async () => {
    render(<CatalogPage />, { wrapper: Wrapper });

    await screen.findByText('Aethel Vortex 9950X');
    const searchInput = screen.getByLabelText(/search silicon/i);
    fireEvent.change(searchInput, { target: { value: '9800X3D' } });

    expect(screen.getByText('Aethel Vortex 9800X3D')).toBeInTheDocument();
    expect(
      screen.queryByText('Aethel Vortex 9950X'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Aethel Zenith 9900 XTX'),
    ).not.toBeInTheDocument();
  });

  it('sorts products by price ascending and descending', async () => {
    render(<CatalogPage />, { wrapper: Wrapper });

    await screen.findByText('Aethel Vortex 9950X');
    const sortSelect = screen.getByLabelText(/sort by/i);

    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    const cardsAsc = screen.getAllByRole('heading', { level: 3 });
    expect(cardsAsc[0]).toHaveTextContent('Aethel Vortex 9800X3D'); // $479

    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    const cardsDesc = screen.getAllByRole('heading', { level: 3 });
    expect(cardsDesc[0]).toHaveTextContent('Aethel Zenith 9900 XTX'); // $999
  });
});
