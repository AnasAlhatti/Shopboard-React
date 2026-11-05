import { Plus, X } from 'lucide-react';
import type { Product } from '../../../types/product';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onSelect: (product: Product) => void;
  category: 'cpu' | 'gpu';
}

export function ProductPickerModal({
  isOpen,
  onClose,
  availableProducts,
  onSelect,
  category,
}: ProductPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="picker-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="picker-title">
      <div className="picker-modal">
        <header className="picker-modal__header">
          <div>
            <p className="eyebrow">Silicon Slots (Max 4)</p>
            <h2 id="picker-title">Select {category.toUpperCase()} to Compare</h2>
          </div>
          <button
            type="button"
            className="picker-close-btn"
            onClick={onClose}
            aria-label="Close silicon picker"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="picker-modal__list">
          {availableProducts.length === 0 ? (
            <p className="picker-modal__empty">All available {category.toUpperCase()}s are already in comparison.</p>
          ) : (
            availableProducts.map((product) => (
              <div key={product.id} className="picker-product-row">
                <div className="picker-product-media">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="picker-product-info">
                  <h4>{product.name}</h4>
                  <p>{product.tagline}</p>
                  <span className="picker-product-specs">
                    {category === 'cpu'
                      ? `${product.specs.cores}C / ${product.specs.threads}T · ${product.specs.boostClock} · ${product.specs.tdp}W`
                      : `${product.specs.vram} · ${product.specs.tflops?.toFixed(1)} TFLOPs · ${product.specs.tdp}W`}
                  </span>
                </div>
                <div className="picker-product-action">
                  <span className="picker-product-price">${product.price.toLocaleString()}</span>
                  <button
                    type="button"
                    className="button button--primary button--sm"
                    onClick={() => {
                      onSelect(product);
                      onClose();
                    }}
                  >
                    <Plus size={14} aria-hidden="true" /> Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
