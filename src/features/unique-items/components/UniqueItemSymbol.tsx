import { Footprints, Glasses, ShoppingBag } from 'lucide-react';

export interface UniqueItemSymbolProps {
  category: string;
}
export function UniqueItemSymbol({ category }: UniqueItemSymbolProps) {
  let Icon = ShoppingBag;
  if (category === 'Shoes') Icon = Footprints;
  else if (category === 'Accessories') Icon = Glasses;
  return (
    <div
      className="grid min-h-32 place-items-center text-muted bg-carbon rounded-md mb-6"
      aria-hidden="true"
    >
      <Icon size={56} strokeWidth={1.2} />
    </div>
  );
}
