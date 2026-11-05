import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchProductById, fetchProducts } from './productService';

const products = Array.from({ length: 8 }, (_, index) => ({
  id: index === 0 ? 'vortex-9950x' : `product-${index}`,
  name: index === 0 ? 'Aethel Vortex 9950X' : `Product ${index}`,
  category: index < 4 ? 'cpu' : 'gpu',
}));

describe('productService', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => products,
      }),
    );
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
});
