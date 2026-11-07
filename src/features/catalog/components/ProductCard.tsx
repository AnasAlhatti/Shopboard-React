import { Cpu, Gauge, Plus, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart';
import { useCompare } from '../../compare/hooks/useCompare';
import type { Product } from '../../../shared/types/product';
import { notify } from '../../../shared/notifications';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare, category } = useCompare();

  const isCompared = isInCompare(product.id);
  const compareDisabled =
    category !== null && category !== product.category && !isCompared;

  return (
    <article className="product-card" aria-labelledby={`title-${product.id}`}>
      <div className="product-card__media">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <span className="product-card__category-tag">
          {product.category === 'cpu' ? (
            <>
              <Cpu size={12} aria-hidden="true" /> Processor
            </>
          ) : (
            <>
              <Gauge size={12} aria-hidden="true" /> Graphics
            </>
          )}
        </span>
      </div>

      <div className="product-card__body">
        <p className="product-card__series">{product.series} Series</p>
        <h3 id={`title-${product.id}`} className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__tagline">{product.tagline}</p>

        <dl className="product-card__specs">
          {product.category === 'cpu' ? (
            <>
              <div className="spec-badge">
                <dt>Cores</dt>
                <dd>
                  {product.specs.cores}C / {product.specs.threads}T
                </dd>
              </div>
              <div className="spec-badge">
                <dt>Boost</dt>
                <dd>{product.specs.boostClock}</dd>
              </div>
              <div className="spec-badge">
                <dt>Cache</dt>
                <dd>{product.specs.cache}</dd>
              </div>
              <div className="spec-badge">
                <dt>TDP</dt>
                <dd>{product.specs.tdp}W</dd>
              </div>
            </>
          ) : (
            <>
              <div className="spec-badge">
                <dt>VRAM</dt>
                <dd>{product.specs.vram}</dd>
              </div>
              <div className="spec-badge">
                <dt>Boost</dt>
                <dd>{product.specs.boostClock}</dd>
              </div>
              <div className="spec-badge">
                <dt>Compute</dt>
                <dd>{product.specs.tflops?.toFixed(1)} TFLOPs</dd>
              </div>
              <div className="spec-badge">
                <dt>TDP</dt>
                <dd>{product.specs.tdp}W</dd>
              </div>
            </>
          )}
        </dl>
      </div>

      <footer className="product-card__footer">
        <div className="product-card__price-wrap">
          <span className="product-card__price-label">MSRP</span>
          <span className="product-card__price">
            ${product.price.toLocaleString()}
          </span>
        </div>

        <div className="product-card__actions">
          <label
            htmlFor={`compare-${product.id}`}
            className={`compare-checkbox-label${compareDisabled ? ' is-disabled' : ''}${isCompared ? ' is-active' : ''}`}
            title={
              compareDisabled
                ? `Compare tray is locked to ${category?.toUpperCase()}s`
                : 'Toggle comparison'
            }
          >
            <input
              id={`compare-${product.id}`}
              type="checkbox"
              checked={isCompared}
              disabled={compareDisabled}
              onChange={() => toggleCompare(product)}
              className="sr-only"
            />
            <Scale size={14} aria-hidden="true" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </label>

          <button
            type="button"
            className="button button--primary button--sm"
            onClick={() => {
              addToCart(product, 1);
              notify.success(`Added ${product.name} to cart.`);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={15} aria-hidden="true" />
            <span>Add</span>
          </button>
        </div>
      </footer>
    </article>
  );
}
