import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../api/queryClient';
import { productQuery } from '../api/productService';

export function useProduct(id: string) {
  return useSuspenseQuery(productQuery(id), queryClient).data;
}
