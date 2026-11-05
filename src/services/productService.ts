import type { Product } from '../types/product';

const PRODUCTS_URL = '/data/products.json';
const RESPONSE_DELAY_MS = 100;

function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) =>
    window.setTimeout(resolve, RESPONSE_DELAY_MS),
  );
}

export async function fetchProducts(): Promise<Product[]> {
  await simulateNetworkDelay();

  const response = await fetch(PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(`Unable to load products (${response.status}).`);
  }

  return (await response.json()) as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((product) => product.id === id) ?? null;
}
