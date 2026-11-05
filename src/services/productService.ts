import type { Product } from '../types/product';

const PRODUCTS_URL = '/data/products.json';

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
      const data = (await response.json()) as Product[];
      productsCache = data;
      return data;
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
