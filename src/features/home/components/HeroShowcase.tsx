import { ArrowDownRight, ArrowUpRight, Cpu, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroShowcaseProps {
  boostClock: string;
  tflops: number;
  loading: boolean;
}

export function HeroShowcase({
  boostClock,
  tflops,
  loading,
}: HeroShowcaseProps) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__image-wrap" aria-hidden="true">
        <img
          className="home-hero__image"
          src="/assets/GPU_and_CPU_processors_displayed_1f861609.jpg"
          alt=""
        />
      </div>
      <div className="home-hero__content page-width">
        <p className="home-hero__kicker">
          <span /> Next-gen 3nm architecture
        </p>
        <h1 id="home-title">Forged for extreme compute.</h1>
        <p className="home-hero__description">
          Silicon engineered to turn ambitious ideas into real-time performance.
        </p>
        <div className="home-hero__actions">
          <Link className="button button--primary" to="/catalog">
            Explore silicon <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link className="button button--quiet" to="/configurator">
            Build a custom rig <ArrowDownRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <dl className="home-hero__stats" aria-label="Flagship performance">
          <div className="performance-stat">
            <dt>
              <Cpu size={15} aria-hidden="true" /> Max boost clock
            </dt>
            <dd>{loading ? 'Loading' : boostClock}</dd>
          </div>
          <div className="performance-stat">
            <dt>
              <Gauge size={15} aria-hidden="true" /> Peak graphics compute
            </dt>
            <dd>{loading ? 'Loading' : `${tflops.toFixed(1)} TFLOPs`}</dd>
          </div>
          <div className="performance-stat performance-stat--status">
            <dt>Architecture</dt>
            <dd>
              3 nm <span>FinFET</span>
            </dd>
          </div>
        </dl>
      </div>
      <span className="home-hero__index" aria-hidden="true">
        01 / AETHEL SYSTEMS
      </span>
    </section>
  );
}
