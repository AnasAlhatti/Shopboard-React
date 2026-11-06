import { getJson } from '../../../shared/api/apiClient';
import { isProduct, type Product } from '../../../shared/types/product';

const PRODUCTS_URL = '/data/products.json';

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
  if (productsCache && !options?.forceRefresh) return productsCache;
  if (inFlightRequest && !options?.forceRefresh) return inFlightRequest;

  inFlightRequest = getJson(PRODUCTS_URL, isProductList, 'products')
    .then((products) => {
      productsCache = products;
      return products;
    })
    .finally(() => {
      inFlightRequest = null;
    });
  return inFlightRequest;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((product) => product.id === id) ?? null;
}
