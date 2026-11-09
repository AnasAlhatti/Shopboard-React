import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cache } from 'react';
import 'server-only';
import { isProduct, type Product } from '../../shared/products/types/product';
import { ApiError, getJson } from '../apiClient';

function isProducts(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

export const getHardwareProducts = cache(async (): Promise<Product[]> => {
  const base = process.env.HARDWARE_API_BASE_URL;
  if (base)
    return getJson(
      `${base.replace(/\/$/, '')}/products`,
      isProducts,
      'products',
    );
  const data: unknown = JSON.parse(
    await readFile(join(process.cwd(), 'public/data/products.json'), 'utf8'),
  );
  if (!isProducts(data)) throw new Error('Invalid hardware product data.');
  return data;
});

export const getHardwareProduct = cache(
  async (id: string): Promise<Product | null> => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return null;
    const base = process.env.HARDWARE_API_BASE_URL;
    if (!base)
      return (
        (await getHardwareProducts()).find((product) => product.id === id) ??
        null
      );
    try {
      return await getJson(
        `${base.replace(/\/$/, '')}/products/${encodeURIComponent(id)}`,
        isProduct,
        'product',
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
);
