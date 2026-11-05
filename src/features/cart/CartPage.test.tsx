import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartContext } from '../../context/CartContext';
import { CompareProvider } from '../../context/CompareContext';
import type { CartContextValue, CartItem } from '../../types/cart';
import type { Product } from '../../types/product';
import { CartPage } from './CartPage';

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
    efficiencyScore: 7.8,
  },
  description: 'Flagship CPU.',
  features: ['16 cores'],
};

const mockRigItem: CartItem = {
  id: 'rig-item-1',
  type: 'rig',
  quantity: 1,
  unitPrice: 1648,
  rig: {
    id: 'rig-1',
    name: 'Aethel Custom Battlestation',
    cpu: mockProduct,
    gpu: {
      ...mockProduct,
      id: 'zenith-9900xtx',
      name: 'Aethel Zenith 9900 XTX',
      category: 'gpu',
      price: 999,
    },
    ramTier: 'Extreme Compute Tier',
    storageTier: '64GB DDR5 + 2TB Gen5 SSD',
    totalPrice: 1648,
    totalTdp: 570,
  },
};

const mockStandaloneItem: CartItem = {
  id: 'product-vortex-9950x',
  type: 'standalone',
  product: mockProduct,
  quantity: 2,
  unitPrice: 649,
};

function renderCartPage(initialItems: CartItem[] = [mockStandaloneItem, mockRigItem]) {
  const addToCart = vi.fn();
  const addRigToCart = vi.fn();
  const unbundleRig = vi.fn();
  const removeFromCart = vi.fn();
  const updateQuantity = vi.fn();
  const clearCart = vi.fn();

  const subtotal = initialItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const itemCount = initialItems.reduce((acc, item) => acc + item.quantity, 0);

  const mockCartValue: CartContextValue = {
    items: initialItems,
    addToCart,
    addRigToCart,
    unbundleRig,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={['/cart']}>
        <CartContext.Provider value={mockCartValue}>
          <CompareProvider>{children}</CompareProvider>
        </CartContext.Provider>
      </MemoryRouter>
    );
  }

  return {
    ...render(<CartPage />, { wrapper: Wrapper }),
    updateQuantity,
    removeFromCart,
    unbundleRig,
    clearCart,
  };
}

describe('CartPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders cart line items, pricing summary, and bundled rig breakdown', () => {
    renderCartPage();

    expect(screen.getByRole('heading', { level: 1, name: /silicon shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText('Aethel Vortex 9950X')).toBeInTheDocument();
    expect(screen.getByText('Aethel Custom Battlestation')).toBeInTheDocument();
    expect(screen.getByText(/64GB DDR5 \+ 2TB Gen5 SSD/i)).toBeInTheDocument();
  });

  it('allows adjusting quantity and removing standalone items', () => {
    const { updateQuantity, removeFromCart } = renderCartPage([mockStandaloneItem]);

    const incrementBtn = screen.getByRole('button', { name: /increase quantity of aethel vortex 9950x/i });
    fireEvent.click(incrementBtn);
    expect(updateQuantity).toHaveBeenCalledWith('product-vortex-9950x', 3);

    const removeBtn = screen.getByRole('button', { name: /remove aethel vortex 9950x from cart/i });
    fireEvent.click(removeBtn);
    expect(removeFromCart).toHaveBeenCalledWith('product-vortex-9950x');
  });

  it('allows unbundling a custom rig into individual components', () => {
    const { unbundleRig } = renderCartPage([mockRigItem]);

    const unbundleBtn = screen.getByRole('button', { name: /unbundle rig into individual components/i });
    fireEvent.click(unbundleBtn);
    expect(unbundleRig).toHaveBeenCalledWith('rig-item-1');
  });

  it('applies promo code SILICON10 and enables checkout', () => {
    const { clearCart } = renderCartPage([mockStandaloneItem]);

    const promoInput = screen.getByLabelText(/promo code/i);
    fireEvent.change(promoInput, { target: { value: 'SILICON10' } });

    const applyBtn = screen.getByRole('button', { name: /apply promo/i });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/10% promo applied/i)).toBeInTheDocument();

    const checkoutBtn = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutBtn);

    expect(screen.getByRole('heading', { level: 2, name: /order confirmed/i })).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /complete & clear cart/i });
    fireEvent.click(closeBtn);
    expect(clearCart).toHaveBeenCalledTimes(1);
  });
});
