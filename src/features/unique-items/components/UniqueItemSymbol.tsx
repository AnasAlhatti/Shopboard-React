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
      className="grid h-12 w-12 shrink-0 place-items-center text-muted bg-background border border-border rounded-lg"
      aria-hidden="true"
    >
      <Icon size={24} strokeWidth={1.5} />
    </div>
  );
}
