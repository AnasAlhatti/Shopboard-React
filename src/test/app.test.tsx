import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as hardwareDetailApi } from '../app/api/products/[id]/route';
import { GET as hardwareApi } from '../app/api/products/route';
import ProductServerPage from '../app/products/[id]/page';
import ProductError from '../app/products/error';
import ProductsServerPage from '../app/products/page';
import { ProductCache } from '../components/providers/ProductCache';
import { Modal } from '../components/ui/Modal';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getCartItemPrice } from '../features/cart/utils/cartOperations';
import { NextTestRouter } from './NextTestRouter';
import { ProductProbe } from './ProductProbe';

// Contexts & Hooks
import {
  CartContext,
  CartProvider,
} from '../features/cart/context/CartContext';
import { useCart } from '../features/cart/hooks/useCart';
import {
  CompareContext,
  CompareProvider,
} from '../features/compare/context/CompareContext';
import { useCompare } from '../features/compare/hooks/useCompare';

// Services & Types
import type { CartContextValue, CartItem } from '../features/cart/types/cart';
import {
  fetchProductById,
  fetchProducts,
} from '../shared/products/api/productService';
import type { CourseProduct } from '../shared/products/types/courseProduct';
import type { Product } from '../shared/products/types/product';

// Pages & Components
import { Header } from '../components/layout/Header';
import { CartPage } from '../features/cart/CartPage';
import { CatalogPage } from '../features/catalog/CatalogPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { CheckoutForm } from '../features/checkout/components/CheckoutForm';
import { ComparePage } from '../features/compare/ComparePage';
import { ProductPickerModal } from '../features/compare/components/ProductPickerModal';
import { ConfiguratorPage } from '../features/configurator/ConfiguratorPage';
import { HomePage } from '../features/home/HomePage';
import { SiliconSpotlight } from '../features/home/components/SiliconSpotlight';
import { getSiliconDashboard } from '../features/home/data/siliconArchitecture';
import { UniqueItemsPage } from '../features/unique-items/UniqueItemsPage';
import {
  courseProductsUrl,
  fetchCourseProduct as fetchUpstreamCourseProduct,
  fetchCourseProducts as fetchUpstreamCourseProducts,
} from '../lib/products/courseProducts';
import { notify } from '../shared/notifications/notify';
import {} from '../shared/products/api/courseProductService';
import { TestApplication as App } from './TestApplication';
import { TestProductDetails as ProductDetailPage } from './TestProductDetails';

// Shared Mock Fixtures
const sampleCpu: Product = {
  id: 'vortex-9950x',
  name: 'Aethel Vortex 9950X',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Flagship Multi-Thread',
  price: 649,
  image: '/assets/cpu-heat-spreader-glowing-traces-eb58e993.jpg',
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

const sampleCpu2: Product = {
  id: 'vortex-9800x3d',
  name: 'Aethel Vortex 9800X3D',
  category: 'cpu',
  series: 'Vortex',
  tagline: 'Ultimate Gaming',
  price: 479,
  image: '/assets/minimal-cpu-processor-0f31f51b.jpg',
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
  description: 'The gaming silicon benchmark.',
  features: ['8 cores', '3D V-Cache'],
};

const sampleGpu: Product = {
  id: 'zenith-9900xtx',
  name: 'Aethel Zenith 9900 XTX',
  category: 'gpu',
  series: 'Zenith',
  tagline: 'Flagship 4K Ultra & AI',
  price: 999,
  image: '/assets/minimalist-gpu-design-f3b58b35.jpg',
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
  description: 'Flagship 4K gaming and compute graphics engine.',
  features: ['24GB GDDR6', '384-Bit bus'],
};

const mockCatalogProducts: Product[] = [sampleCpu, sampleCpu2, sampleGpu];

const sampleMemory: Product = {
  ...sampleCpu,
  id: 'tier-memory',
  category: 'storage',
  name: 'Memory and storage package',
  tagline: '32GB DDR5 + 1TB NVMe',
  price: 180,
  specs: { boostClock: '6000 MT/s', tdp: 35 },
};

describe('course API and shared cart', () => {
  const apiProduct = {
    id: 1,
    title: 'Leather Tote Bag',
    category_name: 'Bags',
    price_cents: 8900,
    in_stock: true,
  };
  const courseProduct: CourseProduct = {
    source: 'course',
    id: '1',
    name: 'Leather Tote Bag',
    category: 'Bags',
    price: 89,
    inStock: true,
  };
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [courseProduct],
      }),
    );
  });
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    notify.dismiss();
  });
  it('maps the real API contract without hardware specifications or duplicated prices', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [apiProduct], total: 1 })),
    );
    expect(await fetchUpstreamCourseProducts()).toEqual([courseProduct]);
    expect(fetch).toHaveBeenCalledWith(
      'https://shopboard-api.vercel.app/api/products',
      { signal: undefined, cache: 'no-store' },
    );
  });
  it('builds the exact documented self-check endpoints and rejects unknown modes', () => {
    expect(courseProductsUrl('delay/3000')).toBe(
      'https://shopboard-api.vercel.app/delay/3000/api/products',
    );
    expect(courseProductsUrl('fail/500')).toBe(
      'https://shopboard-api.vercel.app/fail/500/api/products',
    );
    expect(courseProductsUrl('empty')).toBe(
      'https://shopboard-api.vercel.app/empty/api/products',
    );
    expect(() => courseProductsUrl('anything')).toThrow(
      'Unsupported course API mode',
    );
  });
  it('loads one course item by ID and handles malformed IDs and 404 responses', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(apiProduct)),
    );
    expect(await fetchUpstreamCourseProduct('1')).toEqual(courseProduct);
    expect(fetch).toHaveBeenCalledWith(
      'https://shopboard-api.vercel.app/api/products/1',
      { signal: undefined, cache: 'no-store' },
    );
    expect(await fetchUpstreamCourseProduct('../not-an-id')).toBeNull();
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect(await fetchUpstreamCourseProduct('999')).toBeNull();
  });
  it('rejects invalid API cents rather than allowing an incorrect price into the cart', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [{ ...apiProduct, price_cents: '8900' }],
          total: 1,
        }),
      }),
    );
    await expect(fetchUpstreamCourseProducts()).rejects.toThrow(
      'Invalid unique items data format.',
    );
  });
  it('keeps hardware and course items in the same persistent cart with one price source', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const cart = renderHook(() => useCart(), { wrapper });
    act(() => {
      cart.result.current.addToCart(sampleCpu);
      cart.result.current.addToCart(courseProduct, 2);
    });
    expect(cart.result.current.subtotal).toBe(827);
    expect(cart.result.current.itemCount).toBe(3);
    expect(window.localStorage.getItem('aethel-cart')).not.toContain(
      'unitPrice',
    );
    cart.unmount();
    const restored = renderHook(() => useCart(), { wrapper });
    expect(restored.result.current.items).toHaveLength(2);
    expect(restored.result.current.subtotal).toBe(827);
    act(() =>
      restored.result.current.addToCart({ ...courseProduct, inStock: false }),
    );
    expect(restored.result.current.itemCount).toBe(3);
  });
  it('migrates older cart entries by dropping their redundant unitPrice', () => {
    window.localStorage.setItem(
      'aethel-cart',
      JSON.stringify([
        {
          id: `product-${sampleCpu.id}`,
          type: 'standalone',
          product: sampleCpu,
          quantity: 1,
          unitPrice: 123,
        },
      ]),
    );
    const cart = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });
    expect(cart.result.current.subtotal).toBe(sampleCpu.price);
    expect(window.localStorage.getItem('aethel-cart')).not.toContain(
      'unitPrice',
    );
  });
  it('supports course search, out-of-stock products, and no-match feedback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          courseProduct,
          { ...courseProduct, id: '2', name: 'Sold-out bag', inStock: false },
        ],
      }),
    );
    await act(async () =>
      render(
        <NextTestRouter>
          <CartProvider>
            <UniqueItemsPage />
          </CartProvider>
        </NextTestRouter>,
      ),
    );
    await screen.findByRole('heading', { name: 'Leather Tote Bag' });
    expect(
      screen.getByRole('button', { name: 'Add Sold-out bag to cart' }),
    ).toBeDisabled();
    await act(async () =>
      fireEvent.change(screen.getByLabelText('Search unique items'), {
        target: { value: 'no matches' },
      }),
    );
    expect(
      screen.getByRole('heading', { name: 'No matching unique items' }),
    ).toBeInTheDocument();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Reset filters' })),
    );
    expect(
      screen.getByRole('heading', { name: 'Leather Tote Bag' }),
    ).toBeInTheDocument();
  });
  it('shows a retryable failure once, without an extra error toast', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const toast = vi.spyOn(notify, 'error');
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('Course API unavailable'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [courseProduct],
        }),
    );
    await act(async () =>
      render(
        <NextTestRouter>
          <CartProvider>
            <UniqueItemsPage />
          </CartProvider>
        </NextTestRouter>,
      ),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Course API unavailable',
    );
    expect(
      screen.getByRole('heading', { name: 'Unique Items' }),
    ).toBeInTheDocument();
    expect(toast).not.toHaveBeenCalled();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Try again' })),
    );
    expect(
      await screen.findByRole('heading', { name: 'Leather Tote Bag' }),
    ).toBeInTheDocument();
  });
  it('renders the API empty state without losing the page header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );
    await act(async () =>
      render(
        <NextTestRouter>
          <CartProvider>
            <UniqueItemsPage />
          </CartProvider>
        </NextTestRouter>,
      ),
    );
    expect(
      await screen.findByRole('heading', { name: 'No unique items available' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Unique Items' }),
    ).toBeInTheDocument();
  });
});

describe('silicon architecture data', () => {
  it('does not provide invented figures when product data is unavailable', () => {
    expect(getSiliconDashboard(undefined, 'gpu')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Compute', value: 'Not specified' }),
        expect.objectContaining({ label: 'Memory', value: 'Not specified' }),
        expect.objectContaining({
          label: 'Board power',
          value: 'Not specified',
        }),
      ]),
    );
  });

  it('uses available product specifications for dashboard metrics', () => {
    expect(getSiliconDashboard(sampleGpu, 'gpu')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Compute', value: '88.4 TFLOPs' }),
        expect.objectContaining({ label: 'Memory', value: '24GB GDDR6' }),
        expect.objectContaining({ label: 'Board power', value: '355 W' }),
      ]),
    );
  });

  it('does not invent missing specifications for a catalogue product', () => {
    const incompleteGpu: Product = {
      ...sampleGpu,
      specs: { boostClock: '2.8 GHz', tdp: 355 },
    };
    expect(getSiliconDashboard(incompleteGpu, 'gpu')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Compute', value: 'Not specified' }),
        expect.objectContaining({ label: 'Memory', value: 'Not specified' }),
      ]),
    );
    const incompleteCpu: Product = {
      ...sampleCpu,
      specs: { boostClock: '5.9 GHz', tdp: 170 },
    };
    expect(getSiliconDashboard(incompleteCpu, 'cpu')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Cores / threads',
          value: 'Not specified',
        }),
      ]),
    );
  });
});

// =============================================================================
// 1. PRODUCT SERVICE TESTS
// =============================================================================
describe('checkout and route integration', () => {
  const values = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    address: '12 Computing Lane',
    city: 'Istanbul',
    postalCode: '34000',
  };
  function fillCheckout() {
    for (const [label, value] of [
      ['Full name', values.name],
      ['Email address', values.email],
      ['Street address', values.address],
      ['City', values.city],
      ['Postal code', values.postalCode],
    ]) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
  }
  function seedCart() {
    window.localStorage.setItem(
      'aethel-cart',
      JSON.stringify([
        {
          id: `product-${sampleCpu.id}`,
          type: 'standalone',
          product: sampleCpu,

          quantity: 2,
        },
      ]),
    );
  }
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('validates on submit, associates field errors, and focuses the first error', async () => {
    const onSubmit = vi.fn();
    await act(async () =>
      render(<CheckoutForm onSubmit={onSubmit} disabled={false} />),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await act(async () =>
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'A' },
      }),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Place order' })),
    );
    expect(
      await screen.findByText('Enter your full name.'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText('Full name')).toHaveFocus(),
    );
    expect(screen.getByLabelText('Email address')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables submission while pending and preserves values after failure', async () => {
    let rejectOrder: (error: Error) => void = () => {};
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectOrder = reject;
        }),
    );
    await act(async () =>
      render(<CheckoutForm onSubmit={onSubmit} disabled={false} />),
    );
    fillCheckout();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Place order' })),
    );
    expect(
      await screen.findByRole('button', { name: /placing order/i }),
    ).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () =>
      rejectOrder(new Error('Order service unavailable. Try again.')),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Order service unavailable. Try again.',
    );
    expect(screen.getByLabelText('Email address')).toHaveValue(values.email);
    expect(screen.getByRole('button', { name: 'Place order' })).toBeEnabled();
  });

  it('blocks empty-cart checkout', () => {
    render(
      <NextTestRouter>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </NextTestRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Your cart is empty' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Place order' }),
    ).not.toBeInTheDocument();
  });

  it('keeps the same cart and promo across routes and clears it after validated checkout', async () => {
    seedCart();
    window.history.replaceState(null, '', '/cart');
    await act(async () => render(<App />));
    await screen.findByRole('heading', { name: /silicon shopping cart/i });
    await act(async () =>
      fireEvent.change(screen.getByLabelText('Promo Code'), {
        target: { value: 'silicon10' },
      }),
    );
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: /apply promo/i })),
    );
    expect(screen.getByText(/10% promo applied/i)).toBeInTheDocument();
    await act(async () =>
      fireEvent.click(
        screen.getByRole('link', { name: /proceed to checkout/i }),
      ),
    );
    await screen.findByRole('heading', {
      name: 'Contact and delivery details',
    });
    expect(screen.getByText('Promo discount')).toBeInTheDocument();
    fillCheckout();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Place order' })),
    );
    expect(
      await screen.findByRole('heading', { name: 'Order confirmed' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Thank you, Ada Lovelace/)).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem('aethel-cart') ?? 'null'),
    ).toEqual([]);
  });

  it('renders a real 404 inside the shared layout without fetching products', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    window.history.replaceState(null, '', '/missing-route');
    await act(async () => render(<App />));
    expect(
      await screen.findByRole('heading', {
        name: /page not found/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('retries the failed Next route through its supplied recovery action', () => {
    const retry = vi.fn();
    render(<ProductError error={new Error('Chunk failed')} retry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('preserves HTTP failures and forwards the cancellation signal', async () => {
    const signal = new AbortController().signal;
    const fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    vi.stubGlobal('fetch', fetch);
    await expect(fetchProducts({ signal })).rejects.toMatchObject({
      status: 503,
    });
    expect(fetch).toHaveBeenCalledWith('/api/products', {
      signal,
      cache: 'no-store',
    });
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchProductById('missing')).resolves.toBeNull();
  });
});

describe('productService', () => {
  const serviceProducts: Product[] = Array.from({ length: 8 }, (_, index) => {
    const isCpu = index < 4;
    const base = isCpu ? sampleCpu : sampleGpu;
    return {
      ...base,
      id: index === 0 ? 'vortex-9950x' : `product-${index}`,
      name: index === 0 ? 'Aethel Vortex 9950X' : `Product ${index}`,
      category: isCpu ? 'cpu' : 'gpu',
    };
  });

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (url: string) => ({
        ok: true,
        json: async () =>
          url.endsWith('/products') ? serviceProducts : serviceProducts[0],
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns four CPUs and four GPUs', async () => {
    const products = await fetchProducts();

    expect(products).toHaveLength(8);
    expect(
      products.filter((product) => product.category === 'cpu'),
    ).toHaveLength(4);
    expect(
      products.filter((product) => product.category === 'gpu'),
    ).toHaveLength(4);
  });

  it('returns a product by ID', async () => {
    await expect(fetchProductById('vortex-9950x')).resolves.toMatchObject({
      id: 'vortex-9950x',
      name: 'Aethel Vortex 9950X',
      category: 'cpu',
    });
  });

  it('rejects malformed API data before components can consume it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 'missing-required-fields' }],
      }),
    );
    await expect(fetchProducts()).rejects.toThrow(
      'Invalid products data format.',
    );
  });
});

// =============================================================================
// 2. CART CONTEXT TESTS
// =============================================================================
describe('CartContext', () => {
  const cartWrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('adds products and rigs, adjusts quantities, and unbundles rigs', () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    act(() => result.current.addToCart(sampleCpu, 2));
    expect(result.current.items[0]).toMatchObject({
      quantity: 2,
    });

    act(() => result.current.updateQuantity(result.current.items[0].id, 3));
    expect(result.current.items[0].quantity).toBe(3);

    act(() =>
      result.current.addRigToCart({
        id: 'rig-1',
        name: 'Compute Rig',
        cpu: sampleCpu,
        gpu: sampleGpu,
        ramTier: '32GB DDR5',
        storageTier: '2TB NVMe',
        memoryStorage: sampleMemory,
        totalPrice: 1648,
        totalTdp: 525,
      }),
    );
    const rigItem = result.current.items.find((item) => item.type === 'rig');

    expect(rigItem).toBeDefined();
    if (rigItem) {
      act(() => result.current.unbundleRig(rigItem.id));
    }
    expect(
      result.current.items.filter((item) => item.type === 'rig'),
    ).toHaveLength(0);
    const standaloneItems = result.current.items.filter(
      (item) => item.type === 'standalone',
    );
    expect(standaloneItems).toHaveLength(3);
    expect(
      standaloneItems.find((item) => item.product?.category === 'storage'),
    ).toMatchObject({ product: sampleMemory, quantity: 1 });
    expect(
      standaloneItems.find((item) => item.product?.id === sampleCpu.id)
        ?.quantity,
    ).toBe(4);
    expect(
      standaloneItems.find((item) => item.product?.category === 'gpu')
        ?.quantity,
    ).toBe(1);
  });

  it('restores persisted items and ignores corrupted localStorage data', () => {
    const first = renderHook(() => useCart(), { wrapper: cartWrapper });
    act(() => first.result.current.addToCart(sampleCpu));
    first.unmount();

    const restored = renderHook(() => useCart(), { wrapper: cartWrapper });
    expect(restored.result.current.items).toHaveLength(1);
    restored.unmount();

    window.localStorage.setItem('aethel-cart', '{broken');
    const corrupted = renderHook(() => useCart(), { wrapper: cartWrapper });
    expect(corrupted.result.current.items).toEqual([]);
  });

  it('preserves older saved rigs instead of silently dropping package contents', () => {
    const saved: CartItem = {
      id: 'old-rig',
      type: 'rig',
      quantity: 1,

      rig: {
        id: 'old-rig',
        name: 'Older saved rig',
        cpu: sampleCpu,
        gpu: sampleGpu,
        ramTier: 'Standard',
        storageTier: '32GB + 1TB',
        totalPrice: 2008,
        totalTdp: 610,
      },
    };
    window.localStorage.setItem('aethel-cart', JSON.stringify([saved]));
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });
    act(() => result.current.unbundleRig('old-rig'));
    expect(result.current.items).toEqual([saved]);
  });

  it('restores the full rig package and merges every component when unbundling multiple rigs', () => {
    const first = renderHook(() => useCart(), { wrapper: cartWrapper });
    act(() =>
      first.result.current.addRigToCart({
        id: 'complete-rig',
        name: 'Complete rig',
        cpu: sampleCpu,
        gpu: sampleGpu,
        memoryStorage: sampleMemory,
        ramTier: 'Standard Pro',
        storageTier: sampleMemory.tagline,
        totalPrice: 2008,
        totalTdp: 610,
      }),
    );
    act(() =>
      first.result.current.updateQuantity(first.result.current.items[0].id, 2),
    );
    first.unmount();
    const restored = renderHook(() => useCart(), { wrapper: cartWrapper });
    act(() => restored.result.current.addToCart(sampleMemory));
    const rig = restored.result.current.items.find(
      (item) => item.type === 'rig',
    );
    expect(rig?.rig?.memoryStorage).toEqual(sampleMemory);
    if (!rig) throw new Error('Expected the saved rig');
    act(() => restored.result.current.unbundleRig(rig.id));
    expect(restored.result.current.items).toHaveLength(3);
    expect(
      restored.result.current.items.find(
        (item) => item.product?.id === sampleMemory.id,
      )?.quantity,
    ).toBe(3);
    expect(
      restored.result.current.items.find(
        (item) => item.product?.id === sampleCpu.id,
      )?.quantity,
    ).toBe(2);
    expect(
      restored.result.current.items.find(
        (item) => item.product?.id === sampleGpu.id,
      )?.quantity,
    ).toBe(2);
  });
});

// =============================================================================
// 3. COMPARE CONTEXT TESTS
// =============================================================================
describe('CompareContext', () => {
  const compareWrapper = ({ children }: { children: ReactNode }) => (
    <CompareProvider>{children}</CompareProvider>
  );

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('locks the comparison to one category and persists selected products', () => {
    const { result, unmount } = renderHook(() => useCompare(), {
      wrapper: compareWrapper,
    });
    const warning = vi.spyOn(notify, 'error');

    act(() => result.current.toggleCompare(sampleCpu));
    expect(result.current.category).toBe('cpu');
    act(() => result.current.toggleCompare(sampleGpu));
    expect(result.current.comparedItems).toEqual([sampleCpu]);
    expect(warning).toHaveBeenCalled();
    unmount();

    const restored = renderHook(() => useCompare(), {
      wrapper: compareWrapper,
    });
    expect(restored.result.current.comparedItems).toEqual([sampleCpu]);
    restored.unmount();

    window.localStorage.setItem('aethel-compare', '{broken');
    const corrupted = renderHook(() => useCompare(), {
      wrapper: compareWrapper,
    });
    expect(corrupted.result.current.comparedItems).toEqual([]);
  });

  it('keeps category locking correct when additions are batched', () => {
    const { result } = renderHook(() => useCompare(), {
      wrapper: compareWrapper,
    });
    act(() => {
      result.current.toggleCompare(sampleCpu);
      result.current.toggleCompare(sampleGpu);
    });
    expect(result.current.comparedItems).toEqual([sampleCpu]);
  });
});

// =============================================================================
// 4. HEADER TESTS
// =============================================================================
describe('Header', () => {
  function HeaderFixture() {
    const { addToCart } = useCart();
    const { toggleCompare } = useCompare();

    return (
      <>
        <Header onOpenCart={() => undefined} />
        <button onClick={() => addToCart(sampleCpu)}>Add cart item</button>
        <button onClick={() => toggleCompare(sampleCpu)}>
          Add compare item
        </button>
      </>
    );
  }

  function HeaderWrapper({ children }: { children: ReactNode }) {
    return (
      <NextTestRouter>
        <CartProvider>
          <CompareProvider>{children}</CompareProvider>
        </CartProvider>
      </NextTestRouter>
    );
  }

  it('renders the storefront routes and live cart and compare counts', () => {
    render(<HeaderFixture />, { wrapper: HeaderWrapper });

    expect(
      screen.getByRole('link', { name: 'AETHEL SILICON' }),
    ).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Ecosystem' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/products',
    );
    expect(
      screen.getByRole('link', { name: 'Benchmark Compare' }),
    ).toHaveAttribute('href', '/compare');
    expect(
      screen.getByRole('link', { name: 'Rig Configurator' }),
    ).toHaveAttribute('href', '/configurator');
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute(
      'href',
      '/cart',
    );

    act(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Add cart item' })),
    );
    act(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Add compare item' })),
    );

    expect(screen.getByLabelText('Cart item count')).toHaveTextContent('1');
    expect(screen.getByLabelText('Compare item count')).toHaveTextContent('1');
  });
});

// =============================================================================
// 5. HOME PAGE TESTS
// =============================================================================
describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [sampleCpu, sampleGpu],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows editorial photography, flagship data, and working product destinations', async () => {
    await act(async () =>
      render(
        <NextTestRouter>
          <HomePage />
        </NextTestRouter>,
      ),
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Vortex processors.*Zenith graphics/,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('16 cores / 32 threads'),
    ).toBeInTheDocument();
    expect(await screen.findByText('88.4 TFLOPs')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Explore products' }),
    ).toHaveAttribute('href', '/products');
    expect(
      screen.getByRole('link', { name: 'Build a custom rig' }),
    ).toHaveAttribute('href', '/configurator');
    expect(screen.getByRole('link', { name: 'View product' })).toHaveAttribute(
      'href',
      '/products/zenith-9900xtx',
    );
    expect(
      screen.getByAltText(
        'Silver Vortex processor beside a graphite triple-fan Zenith graphics card',
      ),
    ).toHaveAttribute('src', '/assets/aethel-silicon-studio.jpg');
  });

  it('switches specs and keyboard focus together using arrow and boundary keys', () => {
    render(
      <NextTestRouter>
        <SiliconSpotlight cpu={sampleCpu} gpu={sampleGpu} />
      </NextTestRouter>,
    );
    const cpu = screen.getByRole('tab', { name: 'Vortex processors' });
    const gpu = screen.getByRole('tab', { name: 'Zenith graphics' });
    expect(screen.getByText('24GB GDDR6')).toBeInTheDocument();
    fireEvent.keyDown(gpu, { key: 'ArrowLeft' });
    expect(cpu).toHaveFocus();
    expect(cpu).toHaveAttribute('aria-selected', 'true');
    expect(gpu).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('16 / 32')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View product' })).toHaveAttribute(
      'href',
      '/products/vortex-9950x',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      cpu.id,
    );
    fireEvent.keyDown(gpu, { key: 'Home' });
    expect(cpu).toHaveFocus();
    expect(screen.getByText('16 / 32')).toBeInTheDocument();
    fireEvent.keyDown(cpu, { key: 'End' });
    expect(gpu).toHaveFocus();
  });

  it('keeps the product family navigation available when specs are unavailable', () => {
    render(
      <NextTestRouter>
        <SiliconSpotlight />
      </NextTestRouter>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('24 GB GDDR7')).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'All graphics cards' }),
    ).toHaveAttribute('href', '/products?category=gpu');
  });

  it('shows a loading status while the initial product request is pending', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    render(
      <NextTestRouter>
        <HomePage />
      </NextTestRouter>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading product specifications.',
    );
    expect(
      screen.queryByText('Product specifications are currently unavailable.'),
    ).not.toBeInTheDocument();
  });

  it('changes the product status from loading to unavailable after a request completes without data', () => {
    const { rerender } = render(
      <NextTestRouter>
        <SiliconSpotlight loading />
      </NextTestRouter>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading product specifications.',
    );
    rerender(
      <NextTestRouter>
        <SiliconSpotlight loading={false} />
      </NextTestRouter>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Product specifications are currently unavailable.',
    );
  });

  it('retries product loading after a failed request', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValue({
          ok: true,
          json: async () => [sampleCpu, sampleGpu],
        }),
    );
    await act(async () =>
      render(
        <NextTestRouter>
          <HomePage />
        </NextTestRouter>,
      ),
    );
    await act(async () =>
      fireEvent.click(await screen.findByRole('button', { name: 'Try again' })),
    );
    expect(
      await screen.findByText('16 cores / 32 threads'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Try again' }),
    ).not.toBeInTheDocument();
  });
});

// =============================================================================
// 6. CATALOG PAGE TESTS
// =============================================================================
describe('CatalogPage', () => {
  function CatalogWrapper({ children }: { children: ReactNode }) {
    return (
      <NextTestRouter initialEntries={['/products']}>
        <CartProvider>
          <CompareProvider>{children}</CompareProvider>
        </CartProvider>
      </NextTestRouter>
    );
  }

  beforeEach(() => {
    window.history.replaceState(null, '', '/products');
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockCatalogProducts }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders all products and filters by category', async () => {
    await act(async () => render(<CatalogPage />, { wrapper: CatalogWrapper }));

    expect(await screen.findByText('Aethel Vortex 9950X')).toBeInTheDocument();
    expect(screen.getByText('Aethel Zenith 9900 XTX')).toBeInTheDocument();

    const gpuFilterButton = screen.getByRole('button', { name: /GPUs/i });
    await act(async () => fireEvent.click(gpuFilterButton));

    expect(screen.getByText('Aethel Zenith 9900 XTX')).toBeInTheDocument();
    expect(screen.queryByText('Aethel Vortex 9950X')).not.toBeInTheDocument();
  });

  it('filters products by text search', async () => {
    await act(async () => render(<CatalogPage />, { wrapper: CatalogWrapper }));

    await screen.findByText('Aethel Vortex 9950X');
    const searchInput = screen.getByLabelText(/search silicon/i);
    await act(async () =>
      fireEvent.change(searchInput, { target: { value: '9800X3D' } }),
    );

    expect(screen.getByText('Aethel Vortex 9800X3D')).toBeInTheDocument();
    expect(screen.queryByText('Aethel Vortex 9950X')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Aethel Zenith 9900 XTX'),
    ).not.toBeInTheDocument();
  });

  it('sorts products by price ascending and descending', async () => {
    await act(async () => render(<CatalogPage />, { wrapper: CatalogWrapper }));

    await screen.findByText('Aethel Vortex 9950X');
    const sortSelect = screen.getByLabelText(/sort by/i);

    await act(async () =>
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } }),
    );
    const cardsAsc = screen.getAllByRole('heading', { level: 3 });
    expect(cardsAsc[0]).toHaveTextContent('Aethel Vortex 9800X3D');

    await act(async () =>
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } }),
    );
    const cardsDesc = screen.getAllByRole('heading', { level: 3 });
    expect(cardsDesc[0]).toHaveTextContent('Aethel Zenith 9900 XTX');
  });

  it('restores filters from history without overwriting them with component state', async () => {
    function HistoryControls() {
      const router = useRouter();
      return <button onClick={() => router.back()}>Previous filters</button>;
    }
    await act(async () =>
      render(
        <NextTestRouter
          initialEntries={['/products?category=cpu', '/products?category=gpu']}
        >
          <CartProvider>
            <CompareProvider>
              <HistoryControls />
              <CatalogPage />
            </CompareProvider>
          </CartProvider>
        </NextTestRouter>,
      ),
    );
    await screen.findByText('Aethel Zenith 9900 XTX');
    expect(screen.queryByText('Aethel Vortex 9950X')).not.toBeInTheDocument();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Previous filters' })),
    );
    expect(await screen.findByText('Aethel Vortex 9950X')).toBeInTheDocument();
    expect(
      screen.queryByText('Aethel Zenith 9900 XTX'),
    ).not.toBeInTheDocument();
  });

  it('shows a no-match message for filters that exclude all products', async () => {
    const view = await act(async () =>
      render(<CatalogPage />, { wrapper: CatalogWrapper }),
    );
    await screen.findByText('Aethel Vortex 9950X');
    await act(async () =>
      fireEvent.change(screen.getByLabelText(/search silicon/i), {
        target: { value: 'not-a-real-chip' },
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: 'No matching processors or graphics cards',
      }),
    ).toBeInTheDocument();
    view.unmount();
  });

  it('shows an inventory-empty message when the API returns no products', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
    );
    await act(async () => render(<CatalogPage />, { wrapper: CatalogWrapper }));
    expect(
      await screen.findByRole('heading', {
        name: 'No silicon products available',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No matching processors or graphics cards'),
    ).not.toBeInTheDocument();
  });
});

// =============================================================================
// 7. PRODUCT DETAIL PAGE TESTS
// =============================================================================
describe('ProductPickerModal keyboard access', () => {
  it('opens as a modal and handles the browser cancel event', () => {
    const onClose = vi.fn();
    render(
      <ProductPickerModal
        isOpen
        onClose={onClose}
        availableProducts={[sampleCpu]}
        onSelect={vi.fn()}
        category="cpu"
      />,
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Select CPU to Compare',
    });
    expect(dialog).toHaveAttribute('open');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ProductDetailPage', () => {
  function renderDetailWithRoute(initialPath: string) {
    function DetailWrapper({ children }: { children: ReactNode }) {
      return (
        <NextTestRouter initialEntries={[initialPath]}>
          <CartProvider>
            <CompareProvider>
              <Suspense fallback={<p>Loading detail…</p>}>{children}</Suspense>
            </CompareProvider>
          </CartProvider>
        </NextTestRouter>
      );
    }

    return render(<ProductDetailPage />, { wrapper: DetailWrapper });
  }

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (url: string) => ({
        ok: !url.endsWith('/unknown-chip'),
        status: url.endsWith('/unknown-chip') ? 404 : 200,
        json: async () => sampleCpu,
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders product specifications, features, and benchmarks', async () => {
    await act(async () => renderDetailWithRoute('/products/vortex-9950x'));

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
    await act(async () => renderDetailWithRoute('/products/vortex-9950x'));

    await screen.findByRole('heading', {
      level: 1,
      name: 'Aethel Vortex 9950X',
    });
    const qtyInput = screen.getByLabelText(/quantity/i);
    await act(async () =>
      fireEvent.change(qtyInput, { target: { value: '2' } }),
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await act(async () => fireEvent.click(addButton));

    expect(
      JSON.parse(window.localStorage.getItem('aethel-cart') ?? '[]'),
    ).toEqual([
      expect.objectContaining({
        quantity: 2,
        product: expect.objectContaining({ id: sampleCpu.id }),
      }),
    ]);
  });

  it('shows graceful missing state for unknown product id', async () => {
    await act(async () => renderDetailWithRoute('/products/unknown-chip'));

    expect(await screen.findByText(/silicon not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /return to catalog/i }),
    ).toHaveAttribute('href', '/products');
  });
});

// =============================================================================
// 8. COMPARE PAGE TESTS
// =============================================================================
describe('ComparePage', () => {
  function renderComparePage(
    comparedItems: Product[] = [sampleCpu, sampleCpu2],
  ) {
    const toggleCompare = vi.fn();
    const removeFromCompare = vi.fn();
    const clearCompare = vi.fn();
    const isInCompare = (id: string) => comparedItems.some((i) => i.id === id);

    function ComparePageWrapper({ children }: { children: ReactNode }) {
      return (
        <NextTestRouter initialEntries={['/compare']}>
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
        </NextTestRouter>
      );
    }

    return {
      ...render(<ComparePage />, { wrapper: ComparePageWrapper }),
      removeFromCompare,
      clearCompare,
    };
  }

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [sampleCpu, sampleCpu2],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders head-to-head comparison specifications and benchmark charts', async () => {
    await act(async () => renderComparePage([sampleCpu, sampleCpu2]));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /benchmark comparison bench/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Aethel Vortex 9950X').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('Aethel Vortex 9800X3D').length).toBeGreaterThan(
      0,
    );

    expect(screen.getByText(/physical cores/i)).toBeInTheDocument();
    expect(screen.getByText(/boost clock/i)).toBeInTheDocument();
    expect(
      screen.getByText(/head-to-head benchmark bars/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/cinebench r24 multi-core/i)).toBeInTheDocument();
  });

  it('allows removing an item from comparison', () => {
    const { removeFromCompare } = renderComparePage([sampleCpu, sampleCpu2]);

    const removeButtons = screen.getAllByRole('button', {
      name: /remove .* from compare/i,
    });
    expect(removeButtons.length).toBe(2);

    fireEvent.click(removeButtons[0]);
    expect(removeFromCompare).toHaveBeenCalledWith('vortex-9950x');
  });

  it('shows empty comparison state when no products are selected', () => {
    renderComparePage([]);

    expect(
      screen.getByRole('heading', { name: /comparison bench empty/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore catalog/i }),
    ).toHaveAttribute('href', '/products');
  });
});

// =============================================================================
// 9. CONFIGURATOR PAGE TESTS
// =============================================================================
describe('ConfiguratorPage', () => {
  function renderConfigurator() {
    const addToCart = vi.fn();
    const addRigToCart = vi.fn();
    const unbundleRig = vi.fn();
    const removeFromCart = vi.fn();
    const updateQuantity = vi.fn();
    const clearCart = vi.fn();

    const mockCartValue: CartContextValue = {
      restored: true,
      items: [],
      appliedPromo: null,
      applyPromo: () => false,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal: 0,
      itemCount: 0,
    };

    function ConfiguratorWrapper({ children }: { children: ReactNode }) {
      return (
        <NextTestRouter initialEntries={['/configurator']}>
          <CartContext.Provider value={mockCartValue}>
            <CompareProvider>{children}</CompareProvider>
          </CartContext.Provider>
        </NextTestRouter>
      );
    }

    return {
      ...render(<ConfiguratorPage />, { wrapper: ConfiguratorWrapper }),
      addToCart,
      addRigToCart,
    };
  }

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [sampleCpu2, sampleGpu],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('renders custom rig visualizer, component slots, and live power meter', async () => {
    await act(async () => renderConfigurator());

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /custom rig engine/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Aethel Vortex 9800X3D').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText('Aethel Zenith 9900 XTX').length,
    ).toBeGreaterThan(0);

    expect(screen.getByText(/estimated system power/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended psu/i)).toBeInTheDocument();
  });

  it('adds custom build as a bundled rig item when "Add as Assembled Rig" is clicked', async () => {
    const { addRigToCart } = await act(async () => renderConfigurator());

    await screen.findByRole('heading', {
      level: 1,
      name: /custom rig engine/i,
    });
    const bundleBtn = screen.getByRole('button', {
      name: /add as assembled custom rig/i,
    });
    await act(async () => fireEvent.click(bundleBtn));

    expect(addRigToCart).toHaveBeenCalledTimes(1);
    expect(addRigToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        cpu: expect.objectContaining({ id: 'vortex-9800x3d' }),
        gpu: expect.objectContaining({ id: 'zenith-9900xtx' }),
      }),
    );
  });

  it('adds components individually when "Add Components Individually" is clicked', async () => {
    const { addToCart } = await act(async () => renderConfigurator());

    await screen.findByRole('heading', {
      level: 1,
      name: /custom rig engine/i,
    });
    const individualBtn = screen.getByRole('button', {
      name: /add components individually/i,
    });
    await act(async () => fireEvent.click(individualBtn));

    expect(addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'vortex-9800x3d' }),
      1,
    );
    expect(addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'zenith-9900xtx' }),
      1,
    );
  });
});

// =============================================================================
// 10. CART PAGE TESTS
// =============================================================================
describe('CartPage', () => {
  const mockRigItem: CartItem = {
    id: 'rig-item-1',
    type: 'rig',
    quantity: 1,

    rig: {
      id: 'rig-1',
      name: 'Aethel Custom Battlestation',
      cpu: sampleCpu,
      gpu: sampleGpu,
      ramTier: 'Extreme Compute Tier',
      storageTier: '64GB DDR5 + 2TB Gen5 SSD',
      memoryStorage: sampleMemory,
      totalPrice: 1648,
      totalTdp: 570,
    },
  };

  const mockStandaloneItem: CartItem = {
    id: 'product-vortex-9950x',
    type: 'standalone',
    product: sampleCpu,
    quantity: 2,
  };

  function renderCartPage(
    initialItems: CartItem[] = [mockStandaloneItem, mockRigItem],
  ) {
    const addToCart = vi.fn();
    const addRigToCart = vi.fn();
    const unbundleRig = vi.fn();
    const removeFromCart = vi.fn();
    const updateQuantity = vi.fn();
    const clearCart = vi.fn();

    const subtotal = initialItems.reduce(
      (acc, item) => acc + getCartItemPrice(item) * item.quantity,
      0,
    );
    const itemCount = initialItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    const mockCartValue: CartContextValue = {
      restored: true,
      items: initialItems,
      appliedPromo: null,
      applyPromo: () => true,
      addToCart,
      addRigToCart,
      unbundleRig,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
    };

    function CartWrapper({ children }: { children: ReactNode }) {
      return (
        <NextTestRouter initialEntries={['/cart']}>
          <CartContext.Provider value={mockCartValue}>
            <CompareProvider>{children}</CompareProvider>
          </CartContext.Provider>
        </NextTestRouter>
      );
    }

    return {
      ...render(<CartPage />, { wrapper: CartWrapper }),
      updateQuantity,
      removeFromCart,
      unbundleRig,
      clearCart,
    };
  }

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders cart line items, pricing summary, and bundled rig breakdown', () => {
    renderCartPage();

    expect(
      screen.getByRole('heading', { level: 1, name: /silicon shopping cart/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Aethel Vortex 9950X')).toBeInTheDocument();
    expect(screen.getByText('Aethel Custom Battlestation')).toBeInTheDocument();
    expect(screen.getByText(/64GB DDR5 \+ 2TB Gen5 SSD/i)).toBeInTheDocument();
  });

  it('allows adjusting quantity and removing standalone items', () => {
    const { updateQuantity, removeFromCart } = renderCartPage([
      mockStandaloneItem,
    ]);

    const incrementBtn = screen.getByRole('button', {
      name: /increase quantity of aethel vortex 9950x/i,
    });
    fireEvent.click(incrementBtn);
    expect(updateQuantity).toHaveBeenCalledWith('product-vortex-9950x', 3);

    const removeBtn = screen.getByRole('button', {
      name: /remove aethel vortex 9950x from cart/i,
    });
    fireEvent.click(removeBtn);
    expect(removeFromCart).toHaveBeenCalledWith('product-vortex-9950x');
  });

  it('allows unbundling a custom rig into individual components', () => {
    const { unbundleRig } = renderCartPage([mockRigItem]);

    const unbundleBtn = screen.getByRole('button', {
      name: /unbundle rig into individual components/i,
    });
    fireEvent.click(unbundleBtn);
    expect(unbundleRig).toHaveBeenCalledWith('rig-item-1');
  });

  it('links to the checkout route without clearing the cart', () => {
    const { clearCart } = renderCartPage([mockStandaloneItem]);
    expect(
      screen.getByRole('link', { name: /proceed to checkout/i }),
    ).toHaveAttribute('href', '/checkout');
    expect(clearCart).not.toHaveBeenCalled();
  });

  it('shows memory specifications without an unavailable product-detail link', () => {
    renderCartPage([
      {
        id: 'product-memory',
        type: 'standalone',
        product: sampleMemory,
        quantity: 1,
      },
    ]);
    expect(
      screen.getByRole('heading', { name: sampleMemory.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(sampleMemory.tagline)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: sampleMemory.name }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
});

describe('Next.js migration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/products');
    document.documentElement.classList.add('dark');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });
  it('recovers the Next error boundary when changing collections', async () => {
    const retry = vi.fn();
    await act(async () =>
      render(
        <NextTestRouter initialEntries={['/products?collection=unique']}>
          <ProductError error={new Error('Course unavailable')} retry={retry} />
        </NextTestRouter>,
      ),
    );
    expect(retry).not.toHaveBeenCalled();
    await act(async () => window.history.replaceState(null, '', '/products'));
    expect(retry).toHaveBeenCalledTimes(1);
  });
  it('uses the server-loaded hardware collection without an immediate browser request', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const page = await ProductsServerPage({
      searchParams: Promise.resolve({}),
    });
    await act(async () =>
      render(
        <NextTestRouter>
          <CartProvider>
            <CompareProvider>{page}</CompareProvider>
          </CartProvider>
        </NextTestRouter>,
      ),
    );
    expect(
      screen.getByRole('heading', { name: sampleCpu.name }),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('deduplicates simultaneous SWR consumers', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([sampleCpu])));
    vi.stubGlobal('fetch', fetch);
    await act(async () =>
      render(
        <NextTestRouter>
          <Suspense fallback={<p>Loading probes</p>}>
            <ProductProbe />
            <ProductProbe />
          </Suspense>
        </NextTestRouter>,
      ),
    );
    expect(screen.getAllByText(sampleCpu.name)).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('retains rendered products on background failure and recovers on retry', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify([sampleCpu2])));
    vi.stubGlobal('fetch', fetch);
    await act(async () =>
      render(
        <NextTestRouter>
          <ProductCache fallback={{ '/api/products': [sampleCpu] }}>
            <ProductProbe />
          </ProductCache>
        </NextTestRouter>,
      ),
    );
    expect(fetch).not.toHaveBeenCalled();
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Refresh probe' })),
    );
    expect(screen.getByText(sampleCpu.name)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Refresh failed');
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Refresh probe' })),
    );
    expect(screen.getByText(sampleCpu2.name)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('keeps the shared hardware route-handler contract and returns 404 for missing IDs', async () => {
    const list = await hardwareApi();
    expect(list.status).toBe(200);
    expect(await list.json()).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: sampleCpu.id })]),
    );
    const missing = await hardwareDetailApi(
      new Request('http://localhost/api/products/missing'),
      { params: Promise.resolve({ id: 'missing' }) },
    );
    expect(missing.status).toBe(404);
  });
  it('routes missing hardware and course IDs through Next notFound', async () => {
    await expect(
      ProductServerPage({ params: Promise.resolve({ id: 'abc' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );
    await expect(
      ProductServerPage({ params: Promise.resolve({ id: '99999' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
  it('hydrates a saved cart without mismatch or an empty storage write', async () => {
    const saved = JSON.stringify([
      {
        id: 'product-' + sampleCpu.id,
        type: 'standalone',
        product: sampleCpu,
        quantity: 2,
      },
    ]);
    localStorage.setItem('aethel-cart', saved);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const element = (
      <NextTestRouter>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </NextTestRouter>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.append(container);
    expect(container).toHaveTextContent('Restoring your cart');
    expect(write).not.toHaveBeenCalled();
    const root = await act(async () => hydrateRoot(container, element));
    expect(container).toHaveTextContent(sampleCpu.name);
    expect(JSON.parse(localStorage.getItem('aethel-cart') ?? 'null')).toEqual(
      JSON.parse(saved),
    );
    for (const [key, value] of write.mock.calls) {
      if (key === 'aethel-cart')
        expect(JSON.parse(value)).toEqual(JSON.parse(saved));
    }
    expect(error).not.toHaveBeenCalled();
    await act(async () => root.unmount());
    container.remove();
  });
  it('uses accessible native-dialog cancellation and restores focus', async () => {
    const close = vi.fn();
    await act(async () =>
      render(
        <>
          <button>Opener</button>
          <Modal open={false} onClose={close} title="Review modal">
            <p>Modal content</p>
          </Modal>
        </>,
      ),
    );
    screen.getByRole('button', { name: 'Opener' }).focus();
    const view = render(
      <Modal open onClose={close} title="Review modal">
        <p>Inside</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Review modal' });
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(close).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
  });
  it('switches and remembers the selected theme', async () => {
    await act(async () => render(<ThemeToggle />));
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: 'Switch to light theme' }),
      ),
    );
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('aethel-theme')).toBe('light');
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      ),
    );
    expect(document.documentElement).toHaveClass('dark');
  });
});
