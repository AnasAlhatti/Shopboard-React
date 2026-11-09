import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../api/queryClient';
import { courseProductsQuery } from '../api/courseProductService';

export function useCourseProducts() {
  return useSuspenseQuery(courseProductsQuery, queryClient).data;
}
