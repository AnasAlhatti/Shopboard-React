import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../api/queryClient';
import { courseProductQuery } from '../api/courseProductService';

export function useCourseProduct(id: string) {
  return useSuspenseQuery(courseProductQuery(id), queryClient).data;
}
