'use client';
import useSWR from 'swr';
import {
  COURSE_PRODUCTS_KEY,
  fetchCourseProducts,
} from '../api/courseProductService';
export function useCourseProducts() {
  const result = useSWR(COURSE_PRODUCTS_KEY, () => fetchCourseProducts(), {
    suspense: true,
  });
  return {
    products: result.data,
    error: result.error,
    refresh: () => result.mutate(),
  };
}
