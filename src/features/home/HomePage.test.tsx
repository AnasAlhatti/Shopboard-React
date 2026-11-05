import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '../../types/product';
import { HomePage } from './HomePage';

const products: Product[] = [
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
    description: 'A flagship processor.',
    features: ['16 cores'],
  },
  {
    id: 'zenith-9900xtx',
    name: 'Aethel Zenith 9900 XTX',
    category: 'gpu',
    series: 'Zenith',
    tagline: 'Flagship 4K Ultra & AI',
    price: 999,
    image: '/assets/Sleek_minimalist_GPU_design_with…_f3b58b35.jpg',
    specs: {
      boostClock: '2.8 GHz',
      vram: '24GB GDDR6',
      tflops: 88.4,
      tdp: 355,
    },
    benchmarks: { cyberpunk4k: 118, efficiencyScore: 8.4 },
    description: 'A flagship graphics processor.',
    features: ['24GB GDDR6'],
  },
];

function Wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => products }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('shows flagship metrics and three interactive teardown hotspots', async () => {
    render(<HomePage />, { wrapper: Wrapper });

    expect(
      screen.getByRole('heading', { name: 'Forged for extreme compute.' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('5.9 GHz')).toBeInTheDocument();
    expect(await screen.findByText('88.4 TFLOPs')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Explore silicon' }),
    ).toHaveAttribute('href', '/catalog');
    expect(
      screen.getByRole('link', { name: 'Build a custom rig' }),
    ).toHaveAttribute('href', '/configurator');

    const cachePin = screen.getByRole('button', {
      name: '3D V-Stack Cache Layer',
    });
    expect(
      screen.getByRole('button', { name: '3nm Compute Cluster' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Graphene Vapor Base' }),
    ).toBeInTheDocument();
    fireEvent.click(cachePin);

    expect(
      screen.getByText(/stacked cache keeps critical game data/i),
    ).toBeInTheDocument();
  });
});
