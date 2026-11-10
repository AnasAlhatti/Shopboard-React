import { Card } from '@/components/ui/Card';
import { Activity, Flame, Zap } from 'lucide-react';
import type { Product } from '../../../shared/products/types/product';

interface MiniBenchmarkCardProps {
  product: Product;
}

export function MiniBenchmarkCard({ product }: MiniBenchmarkCardProps) {
  const isCpu = product.category === 'cpu';

  return (
    <Card
      as="section"
      variant="flat"
      padding="md"
      className="h-fit"
      aria-labelledby="benchmark-preview-heading"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} className="text-primary" aria-hidden="true" />
        <h3 id="benchmark-preview-heading" className="text-lg font-bold m-0">
          Performance Validation
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {isCpu ? (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">
                Cinebench R24 Multi-Core
              </span>
              <strong className="text-base font-extrabold text-foreground tabular-nums">
                {product.benchmarks.cinebenchMulti?.toLocaleString() ??
                  '28,400'}{' '}
                pts
              </strong>
              <div
                className="h-1.5 bg-background rounded-xl overflow-hidden mt-1"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-surface rounded-xl"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.cinebenchMulti ?? 25000) / 45000) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Blender 3D Render Time</span>
              <strong className="text-base font-extrabold text-foreground tabular-nums">
                {product.benchmarks.blenderRenderSec ?? '92'}s (Lower is faster)
              </strong>
              <div
                className="h-1.5 bg-background rounded-xl overflow-hidden mt-1"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-xl bg-surface"
                  style={{
                    width: `${Math.min(100, (120 / (product.benchmarks.blenderRenderSec ?? 92)) * 60)}%`,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">
                Cyberpunk 2077 (4K Ultra Ray Tracing)
              </span>
              <strong className="text-base font-extrabold text-foreground tabular-nums">
                {product.benchmarks.cyberpunk4k ?? '85'} FPS
              </strong>
              <div
                className="h-1.5 bg-background rounded-xl overflow-hidden mt-1"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-surface rounded-xl"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.cyberpunk4k ?? 75) / 120) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">
                Black Myth: Wukong (1440p Ultra)
              </span>
              <strong className="text-base font-extrabold text-foreground tabular-nums">
                {product.benchmarks.blackMyth1440p ?? '112'} FPS
              </strong>
              <div
                className="h-1.5 bg-background rounded-xl overflow-hidden mt-1"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-xl bg-surface"
                  style={{
                    width: `${Math.min(100, ((product.benchmarks.blackMyth1440p ?? 90) / 140) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">
            Efficiency Index (Perf / Watt)
          </span>
          <div className="flex items-center gap-2 bg-background border border-border rounded-sm py-1.5 px-2.5 text-sm text-primary">
            <Zap size={14} aria-hidden="true" />
            <strong>
              {product.benchmarks.efficiencyScore.toFixed(1)} / 10.0
            </strong>
            <span className="ml-auto text-xs text-muted flex items-center gap-1">
              <Flame size={12} aria-hidden="true" /> Sustained Cool Operation
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
