import { readFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { isProduct } from '../src/shared/products/types/product.js';

// Used by Vite development and preview; a deployed host can provide the same API contract.
export async function productApi(
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
) {
  const url = new URL(request.url ?? '/', 'http://localhost');
  if (!url.pathname.startsWith('/api/')) {
    next();
    return;
  }
  response.setHeader('Content-Type', 'application/json');
  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET');
    response.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }
  try {
    const data: unknown = JSON.parse(
      await readFile(
        new URL('../public/data/products.json', import.meta.url),
        'utf8',
      ),
    );
    if (!Array.isArray(data) || !data.every(isProduct))
      throw new Error('Invalid product data');
    if (url.pathname === '/api/products') {
      response.end(JSON.stringify(data));
      return;
    }
    const match = /^\/api\/products\/([^/]+)$/.exec(url.pathname);
    const product = match
      ? data.find((item) => item.id === decodeURIComponent(match[1]))
      : undefined;
    if (!product) {
      response.statusCode = 404;
      response.end(JSON.stringify({ message: 'Product not found' }));
      return;
    }
    response.end(JSON.stringify(product));
  } catch {
    response.statusCode = 500;
    response.end(JSON.stringify({ message: 'Unable to load products' }));
  }
}
