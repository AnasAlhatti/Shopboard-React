import { useState } from 'react';
import { ArrowLeft, Check, Plus, Scale } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';
import { useProducts } from '../../hooks/useProducts';
import { ArchitectureSpecTable } from './components/ArchitectureSpecTable';
import { MiniBenchmarkCard } from './components/MiniBenchmarkCard';
import { ProductGallery } from './components/ProductGallery';
import './product-detail.css';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare, category } = useCompare();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  const isCompared = product ? isInCompare(product.id) : false;
  const compareDisabled =
    product && category !== null && category !== product.category && !isCompared;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  if (loading) {
    return (
      <main className="product-detail-page page-width">
        <div className="catalog-empty" role="status">
          <p className="eyebrow">Aethel Architecture</p>
          <h3>Loading Silicon Blueprint...</h3>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-page page-width">
        <div className="product-not-found" role="alert">
          <p className="eyebrow">404 Architecture Error</p>
          <h1>Silicon Not Found</h1>
          <p>The processor or graphics chip you requested does not exist in our silicon matrix.</p>
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
        <span className="separator" aria-hidden="true">/</span>
        <span className="separator" aria-hidden="true">{product.series}</span>
        <span className="separator" aria-hidden="true">/</span>
        <span className="current" aria-current="page">{product.name}</span>
      </nav>

      <section className="product-detail-hero" aria-labelledby="product-name-heading">
        <ProductGallery product={product} />

        <div className="product-info-panel">
          <header className="product-info-header">
            <p className="eyebrow">{product.series} Series // {product.category.toUpperCase()}</p>
            <h1 id="product-name-heading">{product.name}</h1>
            <p className="product-info-tagline">{product.tagline}</p>
          </header>

          <div className="product-price-bar">
            <span className="product-price-bar__label">MSRP Starting at</span>
            <span className="product-price-bar__val">${product.price.toLocaleString()}</span>
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
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="qty-input"
              />
            </div>

            <div className="product-cta-buttons">
              <button
                type="button"
                className="button button--primary"
                onClick={handleAddToCart}
              >
                <Plus size={16} aria-hidden="true" /> Add to Cart (${(product.price * quantity).toLocaleString()})
              </button>

              <button
                type="button"
                className={`button button--quiet${isCompared ? ' is-active' : ''}`}
                disabled={Boolean(compareDisabled)}
                onClick={() => toggleCompare(product)}
                title={compareDisabled ? `Compare locked to ${category?.toUpperCase()}s` : ''}
              >
                <Scale size={16} aria-hidden="true" />
                <span>{isCompared ? 'In Compare Bench' : 'Compare Silicon'}</span>
              </button>
            </div>

            {justAdded && (
              <div className="added-confirmation" role="status">
                <Check size={16} aria-hidden="true" />
                <span>Added {quantity} unit(s) of {product.name} to cart.</span>
              </div>
            )}
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
