import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../../shared/api/queryClient';
import { productQuery } from '../../catalog/services/productService';

export function useProduct(id: string) {
  return useSuspenseQuery(productQuery(id), queryClient).data;
}
