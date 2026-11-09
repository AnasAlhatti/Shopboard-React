'use client';
import { RefreshNotice } from '../../../components/ui/RefreshNotice';
import { useProducts } from '../../../shared/products/hooks/useProducts';
import { useCompare } from '../hooks/useCompare';
import { ProductPickerModal } from './ProductPickerModal';

export interface CompareProductPickerProps {
  onClose: () => void;
}
export function CompareProductPicker({ onClose }: CompareProductPickerProps) {
  const { products, error, refresh } = useProducts();
  const { category, comparedItems, toggleCompare } = useCompare();
  if (!category || category === 'storage') return null;
  const available = products.filter(
    (product) =>
      product.category === category &&
      !comparedItems.some((selected) => selected.id === product.id),
  );
  return (
    <ProductPickerModal
      isOpen
      onClose={onClose}
      availableProducts={available}
      onSelect={toggleCompare}
      category={category}
    >
      {Boolean(error) && <RefreshNotice error={error} onRefresh={refresh} />}
    </ProductPickerModal>
  );
}
