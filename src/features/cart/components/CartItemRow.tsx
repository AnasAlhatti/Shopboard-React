import { Minus, Plus, Split, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { isCourseProduct } from '../../../shared/products/types/courseProduct';
import type { CartItem } from '../types/cart';
import { getCartItemPrice } from '../utils/cartOperations';
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
      <Card
        as="article"
        className="border rounded-lg p-4 flex flex-col gap-4 transition duration-200 motion-reduce:transition-none sm:flex-row sm:items-center sm:p-6 hover:border-border bg-surface border-border"
        aria-labelledby={`rig-title-${item.id}`}
      >
        <div className="w-24 h-16 bg-surface rounded-md overflow-hidden shrink-0">
          <img
            src="/assets/pc-hardware-glass-case-a7ed0ff3.jpg"
            alt={rig.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <span className="text-2xs font-bold text-primary uppercase tracking-wide">
            Custom Assembled Build
          </span>
          <h3
            id={`rig-title-${item.id}`}
            className="text-base font-extrabold mt-0.5 mr-0 mb-1 ml-0"
          >
            {rig.name}
          </h3>

          <div className="mt-1.5 mr-0 mb-2 ml-0 flex flex-col gap-1 text-xs">
            <div className="flex items-baseline gap-1.5">
              <span className="text-muted font-semibold">CPU:</span>
              <span className="text-foreground">
                {rig.cpu.name} ({rig.cpu.specs.cores}C/{rig.cpu.specs.threads}T)
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-muted font-semibold">GPU:</span>
              <span className="text-foreground">
                {rig.gpu.name} ({rig.gpu.specs.vram})
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-muted font-semibold">
                Memory & Storage:
              </span>
              <span className="text-foreground">{rig.storageTier}</span>
            </div>
          </div>

          <div className="cart-item-actions-row">
            <Button
              variant="secondary"
              type="button"
              className="mt-1 py-1 px-2.5"
              onClick={() => onUnbundle(item.id)}
              disabled={!rig.memoryStorage}
              aria-label="Unbundle rig into individual components"
              size="sm"
            >
              <Split size={14} aria-hidden="true" />
              <span>Unbundle Rig</span>
            </Button>
            {!rig.memoryStorage && (
              <p>
                This saved rig needs to be rebuilt in the configurator before
                its memory/storage can be unbundled.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
          <div className="flex items-center border border-border rounded-sm overflow-hidden bg-background">
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${rig.name}`}
            >
              <Minus size={14} aria-hidden="true" />
            </Button>
            <span className="text-sm font-bold py-0 px-1.5 min-w-5 text-center tabular-nums">
              <span className="sr-only">Quantity: </span>
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${rig.name}`}
            >
              <Plus size={14} aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold text-foreground tabular-nums">
              ${(getCartItemPrice(item) * item.quantity).toLocaleString()}
            </span>
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted cursor-pointer p-1 transition duration-200 motion-reduce:transition-none hover:text-primary"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${rig.name} from cart`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isStandalone && item.product && !isCourseProduct(item.product)) {
    const { product } = item;
    let specifications = product.tagline;
    if (product.category === 'cpu') {
      specifications = `${product.specs.cores}C / ${product.specs.threads}T · ${product.specs.boostClock} · ${product.specs.tdp}W`;
    } else if (product.category === 'gpu') {
      specifications = `${product.specs.vram} · ${product.specs.boostClock} · ${product.specs.tdp}W`;
    }
    return (
      <Card
        as="article"
        className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-4 transition duration-200 motion-reduce:transition-none sm:flex-row sm:items-center sm:p-6 hover:border-border"
        aria-labelledby={`item-title-${item.id}`}
      >
        <div className="w-24 h-16 bg-surface rounded-md overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <span className="text-2xs font-bold text-primary uppercase tracking-wide">
            {product.series} Series // {product.category.toUpperCase()}
          </span>
          <h3
            id={`item-title-${item.id}`}
            className="text-base font-extrabold mt-0.5 mr-0 mb-1 ml-0"
          >
            {product.category === 'storage' ? (
              product.name
            ) : (
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            )}
          </h3>
          <p className="text-xs text-muted m-0">{specifications}</p>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
          <div className="flex items-center border border-border rounded-sm overflow-hidden bg-background">
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus size={14} aria-hidden="true" />
            </Button>
            <span className="text-sm font-bold py-0 px-1.5 min-w-5 text-center tabular-nums">
              <span className="sr-only">Quantity: </span>
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center hover:text-primary"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus size={14} aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold text-foreground tabular-nums">
              ${(getCartItemPrice(item) * item.quantity).toLocaleString()}
            </span>
            <Button
              variant="ghost"
              type="button"
              className="bg-transparent border-0 text-muted cursor-pointer p-1 transition duration-200 motion-reduce:transition-none hover:text-primary"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${product.name} from cart`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
