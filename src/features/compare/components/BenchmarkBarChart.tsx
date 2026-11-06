import { BarChart3, Trophy } from 'lucide-react';
import type { Product } from '../../../shared/types/product';

interface BenchmarkBarChartProps {
  items: Product[];
}

interface BenchmarkMetricConfig {
  title: string;
  subtitle: string;
  getValue: (product: Product) => number;
  formatValue: (val: number) => string;
  higherIsBetter: boolean;
}

export function BenchmarkBarChart({ items }: BenchmarkBarChartProps) {
  if (items.length === 0) return null;

  const isCpu = items[0].category === 'cpu';

  const metrics: BenchmarkMetricConfig[] = isCpu
    ? [
        {
          title: 'Cinebench R24 Multi-Core',
          subtitle: 'Pure multi-thread 3D rendering throughput (Points)',
          getValue: (p) => p.benchmarks.cinebenchMulti ?? 20000,
          formatValue: (v) => `${v.toLocaleString()} pts`,
          higherIsBetter: true,
        },
        {
          title: 'Blender 3D Render Cycle',
          subtitle: 'Classroom benchmark duration in seconds (Lower is faster)',
          getValue: (p) => p.benchmarks.blenderRenderSec ?? 100,
          formatValue: (v) => `${v}s`,
          higherIsBetter: false,
        },
        {
          title: 'Compute Power Efficiency',
          subtitle: 'Performance per Watt under full load (Scale 1-10)',
          getValue: (p) => p.benchmarks.efficiencyScore,
          formatValue: (v) => `${v.toFixed(1)} / 10`,
          higherIsBetter: true,
        },
      ]
    : [
        {
          title: 'Cyberpunk 2077 (4K Ultra Ray Tracing)',
          subtitle: 'Average framerate with ray tracing enabled (FPS)',
          getValue: (p) => p.benchmarks.cyberpunk4k ?? 60,
          formatValue: (v) => `${v} FPS`,
          higherIsBetter: true,
        },
        {
          title: 'Black Myth: Wukong (1440p Cinematic)',
          subtitle: 'Average framerate under heavy volumetric fog (FPS)',
          getValue: (p) => p.benchmarks.blackMyth1440p ?? 80,
          formatValue: (v) => `${v} FPS`,
          higherIsBetter: true,
        },
        {
          title: 'Compute Throughput (FP32)',
          subtitle: 'Peak theoretical compute capability (TFLOPs)',
          getValue: (p) => p.specs.tflops ?? 30,
          formatValue: (v) => `${v.toFixed(1)} TFLOPs`,
          higherIsBetter: true,
        },
      ];

  return (
    <section
      className="benchmark-chart-section"
      aria-labelledby="benchmark-bars-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">Aethel Performance Lab</p>
        <h2 id="benchmark-bars-heading">Head-to-Head Benchmark Bars</h2>
        <p>
          Comparative architectural benchmarks validated on standardized 3nm
          testbenches.
        </p>
      </div>

      <div className="benchmark-charts-list">
        {metrics.map((metric) => {
          const values = items.map((item) => metric.getValue(item));
          const bestValue = metric.higherIsBetter
            ? Math.max(...values)
            : Math.min(...values);

          return (
            <div key={metric.title} className="benchmark-chart-card">
              <div className="benchmark-chart-card__header">
                <div>
                  <h3 className="benchmark-chart-card__title">
                    <BarChart3 size={16} aria-hidden="true" /> {metric.title}
                  </h3>
                  <p className="benchmark-chart-card__subtitle">
                    {metric.subtitle}
                  </p>
                </div>
              </div>

              <div className="benchmark-bars-group">
                {items.map((item) => {
                  const val = metric.getValue(item);
                  const isLeader = val === bestValue;

                  // Calculate percentage relative to best (or inverse for time)
                  const percentage = metric.higherIsBetter
                    ? Math.max(15, (val / Math.max(...values)) * 100)
                    : Math.max(15, (Math.min(...values) / val) * 100);

                  return (
                    <div key={item.id} className="benchmark-bar-row">
                      <div className="benchmark-bar-row__info">
                        <span className="benchmark-bar-row__name">
                          {item.name}
                        </span>
                        {isLeader ? (
                          <span className="leader-pill">
                            <Trophy size={11} aria-hidden="true" /> Leader
                          </span>
                        ) : items.length > 1 ? (
                          <span className="delta-pill">
                            {metric.higherIsBetter
                              ? `-${Math.round((1 - val / bestValue) * 100)}%`
                              : `+${Math.round(((val - bestValue) / bestValue) * 100)}% time`}
                          </span>
                        ) : null}
                        <strong className="benchmark-bar-row__val">
                          {metric.formatValue(val)}
                        </strong>
                      </div>

                      <div className="bar-track" aria-hidden="true">
                        <div
                          className={`bar-fill${isLeader ? ' bar-fill--leader' : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
