import { useState } from 'react';
import { ArrowLeft, Layers, Plus, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart';
import { useCompare } from '../../compare/hooks/useCompare';
import { useProduct } from '../../../shared/products/hooks/useProduct';
import { notify } from '../../../shared/notifications/notify';
import { ArchitectureSpecTable } from './ArchitectureSpecTable';
import { MiniBenchmarkCard } from './MiniBenchmarkCard';
import { ProductGallery } from './ProductGallery';

export function ProductDetails({ id }: { id: string }) {
  const product = useProduct(id);
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare, category } = useCompare();

  const [quantity, setQuantity] = useState(1);

  const isCompared = product ? isInCompare(product.id) : false;
  const compareDisabled =
    product &&
    category !== null &&
    category !== product.category &&
    !isCompared;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    notify.success(`Added ${quantity} unit(s) of ${product.name} to cart.`);
  };

  if (!product) {
    return (
      <main className="product-detail-page page-width">
        <div className="product-not-found" role="alert">
          <p className="eyebrow">404 Architecture Error</p>
          <h1>Silicon Not Found</h1>
          <p>
            The processor or graphics chip you requested does not exist in our
            silicon matrix.
          </p>
          <Link to="/catalog" className="button button--primary">
            <ArrowLeft size={16} aria-hidden="true" /> Return to Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-detail-page page-width">
      <nav className="product-detail-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/catalog">Silicon Catalog</Link>
        <span className="separator" aria-hidden="true">
          /
        </span>
        <span className="separator" aria-hidden="true">
          {product.series}
        </span>
        <span className="separator" aria-hidden="true">
          /
        </span>
        <span className="current" aria-current="page">
          {product.name}
        </span>
      </nav>

      <section
        className="product-detail-hero"
        aria-labelledby="product-name-heading"
      >
        <ProductGallery product={product} />

        <div className="product-info-panel">
          <header className="product-info-header">
            <p className="eyebrow">
              {product.series} Series // {product.category.toUpperCase()}
            </p>
            <h1 id="product-name-heading">{product.name}</h1>
            <p className="product-info-tagline">{product.tagline}</p>
          </header>

          <div className="product-price-bar">
            <span className="product-price-bar__label">MSRP Starting at</span>
            <span className="product-price-bar__val">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <p className="product-info-desc">{product.description}</p>

          <div className="product-features-card">
            <h3>Architectural Highlights</h3>
            <ul className="product-features-list">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="product-purchasing-controls">
            <div className="qty-control-wrap">
              <label htmlFor="product-qty" className="qty-control-label">
                Quantity
              </label>
              <input
                id="product-qty"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      10,
                      Math.max(1, Math.floor(Number(e.target.value) || 1)),
                    ),
                  )
                }
                className="qty-input"
              />
            </div>

            <div className="product-cta-buttons">
              <button
                type="button"
                className="button button--primary"
                onClick={handleAddToCart}
              >
                <Plus size={16} aria-hidden="true" /> Add to Cart ($
                {(product.price * quantity).toLocaleString()})
              </button>

              <button
                type="button"
                className={`button button--quiet${isCompared ? ' is-active' : ''}`}
                disabled={Boolean(compareDisabled)}
                onClick={() => toggleCompare(product)}
                title={
                  compareDisabled
                    ? `Compare locked to ${category?.toUpperCase()}s`
                    : ''
                }
              >
                <Scale size={16} aria-hidden="true" />
                <span>
                  {isCompared ? 'In Compare Bench' : 'Compare Silicon'}
                </span>
              </button>

              <Link to="/configurator" className="button button--quiet">
                <Layers size={16} aria-hidden="true" />
                <span>Custom Rig Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="product-detail-deepdive">
        <ArchitectureSpecTable product={product} />
        <MiniBenchmarkCard product={product} />
      </div>
    </main>
  );
}
