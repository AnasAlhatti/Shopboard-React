import { Footprints, Glasses, ShoppingBag } from 'lucide-react';

export interface UniqueItemSymbolProps {
  category: string;
}
export function UniqueItemSymbol({ category }: UniqueItemSymbolProps) {
  const Icon =
    category === 'Shoes'
      ? Footprints
      : category === 'Accessories'
        ? Glasses
        : ShoppingBag;
  return (
    <div className="unique-item-symbol" aria-hidden="true">
      <Icon size={56} strokeWidth={1.2} />
    </div>
  );
}
