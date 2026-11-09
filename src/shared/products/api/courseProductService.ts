import { getJson } from '../../../lib/apiClient';
import { isCourseProduct, type CourseProduct } from '../types/courseProduct';
export const COURSE_PRODUCTS_KEY = '/api/course-products';
function isProducts(value: unknown): value is CourseProduct[] {
  return Array.isArray(value) && value.every(isCourseProduct);
}
export function fetchCourseProducts(
  signal?: AbortSignal,
): Promise<CourseProduct[]> {
  return getJson(COURSE_PRODUCTS_KEY, isProducts, 'unique items', signal);
}
