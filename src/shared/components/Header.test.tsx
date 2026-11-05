import type { ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CartProvider } from '../../context/CartContext';
import { CompareProvider } from '../../context/CompareContext';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';
import type { Product } from '../../types/product';
import { Header } from './Header';

const product: Product = {
  id: 'vortex-9950x',
  name: 'Aethel Vortex 9950X',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Flagship Multi-Thread',
  price: 649,
  image: '/assets/CPU_heat_spreader_glowing_traces_eb58e993.jpg',
  specs: { cores: '16', threads: '32', boostClock: '5.9 GHz', cache: '80MB', tdp: 170 },
  benchmarks: { cinebenchMulti: 42000, efficiencyScore: 7.8 },
  description: 'A flagship processor.',
  features: ['16 cores'],
};

function Fixture() {
  const { addToCart } = useCart();
  const { toggleCompare } = useCompare();

  return (
    <>
      <Header onOpenCart={() => undefined} />
      <button onClick={() => addToCart(product)}>Add cart item</button>
      <button onClick={() => toggleCompare(product)}>Add compare item</button>
    </>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <CartProvider>
        <CompareProvider>{children}</CompareProvider>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders the storefront routes and live cart and compare counts', () => {
    render(<Fixture />, { wrapper: Wrapper });

    expect(screen.getByRole('link', { name: 'AETHEL SILICON' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Ecosystem' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/catalog');
    expect(screen.getByRole('link', { name: 'Benchmark Compare' })).toHaveAttribute('href', '/compare');
    expect(screen.getByRole('link', { name: 'Rig Configurator' })).toHaveAttribute('href', '/configurator');
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');

    act(() => fireEvent.click(screen.getByRole('button', { name: 'Add cart item' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Add compare item' })));

    expect(screen.getByLabelText('Cart item count')).toHaveTextContent('1');
    expect(screen.getByLabelText('Compare item count')).toHaveTextContent('1');
  });
});
