import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../shared/products/types/product';
import {
  getSiliconDashboard,
  type SiliconKind,
} from '../data/siliconArchitecture';

const siliconKinds: readonly SiliconKind[] = ['cpu', 'gpu'];
const spotlightContent = {
  cpu: {
    tab: 'Vortex processors',
    name: 'Vortex 9950X',
    label: 'Desktop processors',
    description:
      'More cores for the work that needs them. Vortex brings high-frequency compute to rendering, compiling, and the desktop tasks in between.',
    image: '/assets/vortex-heat-spreader-detail.jpg',
    alt: 'Vortex processor package and surrounding circuit traces',
    width: 1200,
    height: 896,
  },
  gpu: {
    tab: 'Zenith graphics',
    name: 'Zenith 9900 XTX',
    label: 'Graphics cards',
    description:
      'A triple-fan design and high-capacity graphics memory for detailed scenes, demanding games, and creative projects.',
    image: '/assets/zenith-gpu-studio.jpg',
    alt: 'Full front view of the graphite triple-fan Zenith graphics card',
    width: 896,
    height: 1200,
  },
};

export function SiliconSpotlight({
  cpu,
  gpu,
  loading = false,
}: {
  cpu?: Product;
  gpu?: Product;
  loading?: boolean;
}) {
  const [active, setActive] = useState<SiliconKind>('gpu');
  const product = active === 'cpu' ? cpu : gpu;
  const content = spotlightContent[active];
  const metrics = getSiliconDashboard(product, active);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let next: SiliconKind;
    switch (event.key) {
      case 'Home':
        next = 'cpu';
        break;
      case 'End':
        next = 'gpu';
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        next = active === 'cpu' ? 'gpu' : 'cpu';
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    document.getElementById(`spotlight-tab-${next}`)?.focus();
  }

  return (
    <section
      id="home-products"
      className="home-products page-width"
      aria-labelledby="spotlight-title"
    >
      <div className="home-products__heading">
        <div>
          <p className="home-label">The range</p>
          <h2 id="spotlight-title">Choose your hardware.</h2>
        </div>
        <div
          className="home-product-tabs"
          role="tablist"
          aria-label="Product family"
        >
          {siliconKinds.map((kind) => (
            <button
              key={kind}
              id={`spotlight-tab-${kind}`}
              type="button"
              role="tab"
              aria-controls="spotlight-panel"
              aria-selected={active === kind}
              tabIndex={active === kind ? 0 : -1}
              onClick={() => setActive(kind)}
              onKeyDown={handleTabKeyDown}
            >
              {spotlightContent[kind].tab}
            </button>
          ))}
        </div>
      </div>
      <article
        id="spotlight-panel"
        className="home-product-panel"
        role="tabpanel"
        aria-labelledby={`spotlight-tab-${active}`}
      >
        <div
          className={`home-product-panel__photo home-product-panel__photo--${active}`}
        >
          <img
            key={active}
            src={content.image}
            alt={content.alt}
            width={content.width}
            height={content.height}
            loading="lazy"
          />
        </div>
        <div className="home-product-panel__copy">
          <p className="home-label">{content.label}</p>
          <h3>
            {product ? product.name.replace(/^Aethel\s+/, '') : content.name}
          </h3>
          <p>{content.description}</p>
          {product ? (
            <>
              <dl className="home-product-specs">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="home-product-panel__purchase">
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </span>
                <Link className="home-text-link" to={`/product/${product.id}`}>
                  View product <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <p className="home-product-panel__unavailable" role="status">
              {loading
                ? 'Loading product specifications.'
                : 'Product specifications are currently unavailable.'}
            </p>
          )}
          <Link className="home-quiet-link" to={`/catalog?category=${active}`}>
            All {active === 'cpu' ? 'processors' : 'graphics cards'}{' '}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </section>
  );
}
