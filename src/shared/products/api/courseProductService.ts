import { queryOptions } from '@tanstack/react-query';
import { ApiError, getJson } from '../../api/apiClient';
import type { CourseProduct } from '../types/courseProduct';

interface ApiProduct {
  id: number;
  title: string;
  category_name: string;
  price_cents: number;
  in_stock: boolean;
}
interface ApiProducts {
  items: ApiProduct[];
  total: number;
}

function isApiProduct(value: unknown): value is ApiProduct {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    'title' in value &&
    typeof value.title === 'string' &&
    'category_name' in value &&
    typeof value.category_name === 'string' &&
    'price_cents' in value &&
    typeof value.price_cents === 'number' &&
    Number.isSafeInteger(value.price_cents) &&
    value.price_cents >= 0 &&
    'in_stock' in value &&
    typeof value.in_stock === 'boolean'
  );
}
function isApiProducts(value: unknown): value is ApiProducts {
  return (
    typeof value === 'object' &&
    value !== null &&
    'items' in value &&
    Array.isArray(value.items) &&
    value.items.every(isApiProduct) &&
    'total' in value &&
    typeof value.total === 'number' &&
    Number.isSafeInteger(value.total) &&
    value.total >= 0
  );
}
export function toCourseProduct(value: ApiProduct): CourseProduct {
  return {
    source: 'course',
    id: String(value.id),
    name: value.title,
    category: value.category_name,
    price: value.price_cents / 100,
    inStock: value.in_stock,
  };
}

const origin = (
  import.meta.env.VITE_COURSE_API_URL ?? 'https://shopboard-api.vercel.app'
).replace(/\/$/, '');
const mode = import.meta.env.VITE_COURSE_API_MODE ?? '';
const supportedModes = ['', 'delay/3000', 'fail/500', 'empty'];
export function courseProductsUrl(apiMode = mode): string {
  if (!supportedModes.includes(apiMode))
    throw new Error(
      'Unsupported course API mode. Use delay/3000, fail/500, empty, or leave it unset.',
    );
  return `${origin}${apiMode ? `/${apiMode}` : ''}/api/products`;
}
export async function fetchCourseProducts(
  signal?: AbortSignal,
): Promise<CourseProduct[]> {
  const response = await getJson(
    courseProductsUrl(),
    isApiProducts,
    'unique items',
    signal,
  );
  return response.items.map(toCourseProduct);
}
export async function fetchCourseProduct(
  id: string,
  signal?: AbortSignal,
): Promise<CourseProduct | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  try {
    return toCourseProduct(
      await getJson(
        `${courseProductsUrl()}/${encodeURIComponent(id)}`,
        isApiProduct,
        'unique item',
        signal,
      ),
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
export const courseProductsQuery = queryOptions({
  queryKey: ['course-products', origin, mode],
  queryFn: ({ signal }) => fetchCourseProducts(signal),
});
export const courseProductQuery = (id: string) =>
  queryOptions({
    queryKey: ['course-product', origin, mode, id],
    queryFn: ({ signal }) => fetchCourseProduct(id, signal),
  });
