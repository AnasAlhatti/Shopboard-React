import { useProducts } from '../../../shared/products/hooks/useProducts';
import { useCompare } from '../hooks/useCompare';
import { ProductPickerModal } from './ProductPickerModal';

export function CompareProductPicker({ onClose }: { onClose: () => void }) {
  const { products } = useProducts();
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
    />
  );
}
