import { getCartItemPrice } from '../utils/cartOperations';
import { Minus, Plus, Split, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../types/cart';
import { isCourseProduct } from '../../../shared/products/types/courseProduct';
import { CourseCartItemRow } from './CourseCartItemRow';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onUnbundle: (id: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  onUnbundle,
}: CartItemRowProps) {
  if (item.type === 'standalone' && isCourseProduct(item.product)) {
    return (
      <CourseCartItemRow
        id={item.id}
        product={item.product}
        quantity={item.quantity}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    );
  }
  const isRig = item.type === 'rig' && item.rig;
  const isStandalone = item.type === 'standalone' && item.product;

  if (isRig && item.rig) {
    const { rig } = item;
    return (
      <article
        className="cart-item-card cart-item-card--rig"
        aria-labelledby={`rig-title-${item.id}`}
      >
        <div className="cart-item-media">
          <img
            src="/assets/pc-hardware-glass-case-a7ed0ff3.jpg"
            alt={rig.name}
            className="cart-item-image"
          />
        </div>

        <div className="cart-item-info">
          <span className="cart-item-tag">Custom Assembled Build</span>
          <h3 id={`rig-title-${item.id}`} className="cart-item-name">
            {rig.name}
          </h3>

          <div className="rig-nested-breakdown">
            <div className="rig-nested-part">
              <span className="nested-label">CPU:</span>
              <span className="nested-val">
                {rig.cpu.name} ({rig.cpu.specs.cores}C/{rig.cpu.specs.threads}T)
              </span>
            </div>
            <div className="rig-nested-part">
              <span className="nested-label">GPU:</span>
              <span className="nested-val">
                {rig.gpu.name} ({rig.gpu.specs.vram})
              </span>
            </div>
            <div className="rig-nested-part">
              <span className="nested-label">Memory & Storage:</span>
              <span className="nested-val">{rig.storageTier}</span>
            </div>
          </div>

          <div className="cart-item-actions-row">
            <button
              type="button"
              className="button button--quiet button--sm unbundle-btn"
              onClick={() => onUnbundle(item.id)}
              disabled={!rig.memoryStorage}
              aria-label="Unbundle rig into individual components"
            >
              <Split size={14} aria-hidden="true" />
              <span>Unbundle Rig</span>
            </button>
            {!rig.memoryStorage && (
              <p>
                This saved rig needs to be rebuilt in the configurator before
                its memory/storage can be unbundled.
              </p>
            )}
          </div>
        </div>

        <div className="cart-item-pricing-column">
          <div className="cart-qty-controls">
            <button
              type="button"
              className="qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${rig.name}`}
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="qty-val">
              <span className="sr-only">Quantity: </span>
              {item.quantity}
            </span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${rig.name}`}
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="cart-item-totals">
            <span className="cart-item-price">
              ${(getCartItemPrice(item) * item.quantity).toLocaleString()}
            </span>
            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${rig.name} from cart`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (isStandalone && item.product && !isCourseProduct(item.product)) {
    const { product } = item;
    return (
      <article
        className="cart-item-card"
        aria-labelledby={`item-title-${item.id}`}
      >
        <div className="cart-item-media">
          <img
            src={product.image}
            alt={product.name}
            className="cart-item-image"
          />
        </div>

        <div className="cart-item-info">
          <span className="cart-item-tag">
            {product.series} Series // {product.category.toUpperCase()}
          </span>
          <h3 id={`item-title-${item.id}`} className="cart-item-name">
            {product.category === 'storage' ? (
              product.name
            ) : (
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            )}
          </h3>
          <p className="cart-item-specs">
            {product.category === 'cpu'
              ? `${product.specs.cores}C / ${product.specs.threads}T · ${product.specs.boostClock} · ${product.specs.tdp}W`
              : product.category === 'gpu'
                ? `${product.specs.vram} · ${product.specs.boostClock} · ${product.specs.tdp}W`
                : product.tagline}
          </p>
        </div>

        <div className="cart-item-pricing-column">
          <div className="cart-qty-controls">
            <button
              type="button"
              className="qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="qty-val">
              <span className="sr-only">Quantity: </span>
              {item.quantity}
            </span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="cart-item-totals">
            <span className="cart-item-price">
              ${(getCartItemPrice(item) * item.quantity).toLocaleString()}
            </span>
            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${product.name} from cart`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return null;
}
