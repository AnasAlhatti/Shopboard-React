'use client';
import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import type { Product } from '../../../shared/products/types/product';
export interface ProductPickerModalProps {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onSelect: (product: Product) => void;
  category: 'cpu' | 'gpu';
}
export function ProductPickerModal({
  children,
  isOpen,
  onClose,
  availableProducts,
  onSelect,
  category,
}: ProductPickerModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Select ${category.toUpperCase()} to Compare`}
      size="lg"
      closeLabel="Close silicon picker"
    >
      {children}
      <div className="p-6 overflow-y-auto overscroll-contain flex flex-col gap-4">
        {availableProducts.length === 0 ? (
          <p className="text-center text-muted p-8">
            All available {category.toUpperCase()}s are already in comparison.
          </p>
        ) : (
          availableProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 items-center gap-4 bg-background border border-border rounded-md py-3 px-4 sm:grid-cols-actions"
            >
              <div className="w-18 h-12 rounded-xl overflow-hidden bg-surface shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-base mt-0 mr-0 mb-0.5 ml-0">
                  {product.name}
                </h4>
                <p className="text-xs text-muted m-0">{product.tagline}</p>
                <span className="text-xs text-primary">
                  {category === 'cpu'
                    ? `${product.specs.cores}C / ${product.specs.threads}T · ${product.specs.boostClock} · ${product.specs.tdp}W`
                    : `${product.specs.vram} · ${product.specs.tflops?.toFixed(1)} TFLOPs · ${product.specs.tdp}W`}
                </span>
              </div>
              <div className="col-start-2 flex items-center justify-between gap-1 sm:col-auto sm:flex-col sm:items-end">
                <span className="text-base font-extrabold">
                  ${product.price.toLocaleString()}
                </span>
                <Button
                  type="button"
                  onClick={() => {
                    onSelect(product);
                    onClose();
                  }}
                  size="sm"
                  variant="primary"
                >
                  <Plus size={14} aria-hidden="true" /> Add
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
