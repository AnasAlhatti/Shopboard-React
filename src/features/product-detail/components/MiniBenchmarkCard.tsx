import { Activity, Flame, Zap } from 'lucide-react';
import type { Product } from '../../../shared/types/product';

interface MiniBenchmarkCardProps {
  product: Product;
}

export function MiniBenchmarkCard({ product }: MiniBenchmarkCardProps) {
  const isCpu = product.category === 'cpu';

  return (
    <section
      className="mini-benchmark-card"
      aria-labelledby="benchmark-preview-heading"
    >
      <div className="mini-benchmark-card__header">
        <Activity size={18} className="benchmark-icon" aria-hidden="true" />
        <h3 id="benchmark-preview-heading">Performance Validation</h3>
      </div>

      <div className="benchmark-metrics-grid">
        {isCpu ? (
          <>
            <div className="benchmark-metric">
              <span className="benchmark-metric__label">
                Cinebench R24 Multi-Core
              </span>
              <strong className="benchmark-metric__value">
                {product.benchmarks.cinebenchMulti?.toLocaleString() ??
                  '28,400'}{' '}
                pts
              </strong>
              <div className="metric-bar" aria-hidden="true">
                <div
                  className="metric-bar__fill"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.cinebenchMulti ?? 25000) / 45000) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="benchmark-metric">
              <span className="benchmark-metric__label">
                Blender 3D Render Time
              </span>
              <strong className="benchmark-metric__value">
                {product.benchmarks.blenderRenderSec ?? '92'}s (Lower is faster)
              </strong>
              <div className="metric-bar" aria-hidden="true">
                <div
                  className="metric-bar__fill metric-bar__fill--amber"
                  style={{
                    width: `${Math.min(100, (120 / (product.benchmarks.blenderRenderSec ?? 92)) * 60)}%`,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="benchmark-metric">
              <span className="benchmark-metric__label">
                Cyberpunk 2077 (4K Ultra Ray Tracing)
              </span>
              <strong className="benchmark-metric__value">
                {product.benchmarks.cyberpunk4k ?? '85'} FPS
              </strong>
              <div className="metric-bar" aria-hidden="true">
                <div
                  className="metric-bar__fill"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.cyberpunk4k ?? 75) / 120) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="benchmark-metric">
              <span className="benchmark-metric__label">
                Black Myth: Wukong (1440p Ultra)
              </span>
              <strong className="benchmark-metric__value">
                {product.benchmarks.blackMyth1440p ?? '112'} FPS
              </strong>
              <div className="metric-bar" aria-hidden="true">
                <div
                  className="metric-bar__fill metric-bar__fill--amber"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.blackMyth1440p ?? 90) / 140) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}

        <div className="benchmark-metric">
          <span className="benchmark-metric__label">
            Efficiency Index (Perf / Watt)
          </span>
          <div className="efficiency-badge">
            <Zap size={14} aria-hidden="true" />
            <strong>
              {product.benchmarks.efficiencyScore.toFixed(1)} / 10.0
            </strong>
            <span className="efficiency-note">
              <Flame size={12} aria-hidden="true" /> Sustained Cool Operation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
