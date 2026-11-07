import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../shared/types/product';

export function HeroShowcase({
  cpu,
  gpu,
  loading,
}: {
  cpu?: Product;
  gpu?: Product;
  loading: boolean;
}) {
  let coreSummary: string | undefined;
  if (cpu?.specs.cores && cpu.specs.threads) {
    coreSummary = `${cpu.specs.cores} cores / ${cpu.specs.threads} threads`;
  }

  const specifications = [
    { label: 'Vortex 9950X', value: coreSummary },
    { label: 'Maximum boost clock', value: cpu?.specs.boostClock },
    { label: 'Zenith 9900 XTX memory', value: gpu?.specs.vram },
  ];
  const statusText = loading
    ? 'Loading specifications'
    : 'Specifications unavailable';

  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__intro page-width">
        <div>
          <p className="home-label">Aethel Silicon / Desktop hardware</p>
          <h1 id="home-title">
            Vortex processors.
            <br />
            <span>Zenith graphics.</span>
          </h1>
        </div>
        <div className="home-hero__aside">
          <p>
            For the games you play.
            <br />
            And the work you put into them.
          </p>
          <div className="home-hero__links">
            <Link className="home-text-link" to="/catalog">
              Explore products <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <a className="home-quiet-link" href="#home-products">
              Meet the range <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <figure className="home-hero__photograph page-width">
        <img
          src="/assets/aethel-silicon-studio.jpg"
          alt="Silver Vortex processor beside a graphite triple-fan Zenith graphics card"
          width="1376"
          height="768"
          fetchPriority="high"
        />
        <figcaption>
          <span>Vortex 9950X & Zenith 9900 XTX</span>
          <span>Processors & graphics</span>
        </figcaption>
      </figure>
      <dl
        className="home-hero__specs page-width"
        aria-label="Flagship specifications"
        aria-busy={loading}
      >
        {specifications.map((specification) => (
          <div key={specification.label}>
            <dt>{specification.label}</dt>
            <dd>
              {loading ? statusText : (specification.value ?? statusText)}
            </dd>
          </div>
        ))}
        <div>
          <dt>The full range</dt>
          <dd>
            <Link className="home-quiet-link" to="/compare">
              Compare hardware <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </dd>
        </div>
      </dl>
    </section>
  );
}
