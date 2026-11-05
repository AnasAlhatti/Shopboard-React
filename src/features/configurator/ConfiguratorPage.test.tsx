import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartContext } from '../../context/CartContext';
import { CompareProvider } from '../../context/CompareContext';
import type { CartContextValue } from '../../types/cart';
import type { Product } from '../../types/product';
import { ConfiguratorPage } from './ConfiguratorPage';

const mockCpu: Product = {
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
    efficiencyScore: 8.9,
  },
  description: 'Gaming CPU.',
  features: ['8 cores'],
};

const mockGpu: Product = {
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
  benchmarks: {
    cyberpunk4k: 118,
    efficiencyScore: 8.4,
  },
  description: 'Flagship GPU.',
  features: ['24GB GDDR6'],
};

function renderConfigurator() {
  const addToCart = vi.fn();
  const addRigToCart = vi.fn();
  const unbundleRig = vi.fn();
  const removeFromCart = vi.fn();
  const updateQuantity = vi.fn();
  const clearCart = vi.fn();

  const mockCartValue: CartContextValue = {
    items: [],
    addToCart,
    addRigToCart,
    unbundleRig,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal: 0,
    itemCount: 0,
  };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={['/configurator']}>
        <CartContext.Provider value={mockCartValue}>
          <CompareProvider>{children}</CompareProvider>
        </CartContext.Provider>
      </MemoryRouter>
    );
  }

  return {
    ...render(<ConfiguratorPage />, { wrapper: Wrapper }),
    addToCart,
    addRigToCart,
  };
}

describe('ConfiguratorPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockCpu, mockGpu],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders custom rig visualizer, component slots, and live power meter', async () => {
    renderConfigurator();

    expect(await screen.findByRole('heading', { level: 1, name: /custom rig engine/i })).toBeInTheDocument();
    expect(screen.getAllByText('Aethel Vortex 9800X3D').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Aethel Zenith 9900 XTX').length).toBeGreaterThan(0);

    // Check power synergy meter displays
    expect(screen.getByText(/estimated system power/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended psu/i)).toBeInTheDocument();
  });

  it('adds custom build as a bundled rig item when "Add as Assembled Rig" is clicked', async () => {
    const { addRigToCart } = renderConfigurator();

    await screen.findByRole('heading', { level: 1, name: /custom rig engine/i });
    const bundleBtn = screen.getByRole('button', { name: /add as assembled custom rig/i });
    fireEvent.click(bundleBtn);

    expect(addRigToCart).toHaveBeenCalledTimes(1);
    expect(addRigToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        cpu: expect.objectContaining({ id: 'vortex-9800x3d' }),
        gpu: expect.objectContaining({ id: 'zenith-9900xtx' }),
      }),
    );
  });

  it('adds components individually when "Add Components Individually" is clicked', async () => {
    const { addToCart } = renderConfigurator();

    await screen.findByRole('heading', { level: 1, name: /custom rig engine/i });
    const individualBtn = screen.getByRole('button', { name: /add components individually/i });
    fireEvent.click(individualBtn);

    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'vortex-9800x3d' }), 1);
    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'zenith-9900xtx' }), 1);
  });
});
