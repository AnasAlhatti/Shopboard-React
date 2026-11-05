import type { Product } from '../types/product';

const PRODUCTS_URL = '/data/products.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.category === 'cpu' || value.category === 'gpu')
  );
}

function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

let productsCache: Product[] | null = null;
let inFlightRequest: Promise<Product[]> | null = null;

export function getCachedProducts(): Product[] | null {
  return productsCache;
}

export function clearProductCache(): void {
  productsCache = null;
  inFlightRequest = null;
}

export async function fetchProducts(options?: {
  forceRefresh?: boolean;
}): Promise<Product[]> {
  if (productsCache && !options?.forceRefresh) {
    return productsCache;
  }

  if (inFlightRequest && !options?.forceRefresh) {
    return inFlightRequest;
  }

  inFlightRequest = (async () => {
    try {
      const response = await fetch(PRODUCTS_URL);
      if (!response.ok) {
        throw new Error(`Unable to load products (${response.status}).`);
      }
      const raw: unknown = await response.json();
      if (!isProductList(raw)) {
        throw new Error('Invalid product data format.');
      }
      productsCache = raw;
      return raw;
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((product) => product.id === id) ?? null;
}
