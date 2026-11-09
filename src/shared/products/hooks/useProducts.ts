import { useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '../../api/queryClient';
import { productListQuery } from '../api/productService';

export function useProducts() {
  const { data } = useSuspenseQuery(productListQuery, queryClient);
  return { products: data };
}
