import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../../shared/api/queryClient';
import { productListQuery } from '../services/productService';

export function useProducts() {
  const { data } = useSuspenseQuery(productListQuery, queryClient);
  return { products: data };
}
