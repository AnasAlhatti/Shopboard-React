import { Card } from '@/components/ui/Card';
import { BarChart3, Trophy } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Product } from '../../../shared/products/types/product';

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
    <section className="mt-16" aria-labelledby="benchmark-bars-heading">
      <div className="max-w-96 mb-8">
        <p className="mb-3 text-primary text-xs font-extrabold tracking-widest uppercase last:max-w-96 last:mb-0">
          Aethel Performance Lab
        </p>
        <h2 id="benchmark-bars-heading" className="mb-3 text-3xl lg:text-6xl">
          Head-to-Head Benchmark Bars
        </h2>
        <p className="last:max-w-96 last:mb-0">
          Comparative architectural benchmarks validated on standardized 3nm
          testbenches.
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-8">
        {metrics.map((metric) => {
          const values = items.map((item) => metric.getValue(item));
          const bestValue = metric.higherIsBetter
            ? Math.max(...values)
            : Math.min(...values);

          return (
            <Card variant="flat" padding="md" key={metric.title} className="">
              <div className="benchmark-chart-card__header">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground m-0">
                    <BarChart3 size={16} aria-hidden="true" /> {metric.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 mr-0 mb-0 ml-0">
                    {metric.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                {items.map((item) => {
                  const val = metric.getValue(item);
                  const isLeader = val === bestValue;

                  // Calculate percentage relative to best (or inverse for time)
                  const percentage = metric.higherIsBetter
                    ? Math.max(15, (val / Math.max(...values)) * 100)
                    : Math.max(15, (Math.min(...values) / val) * 100);

                  return (
                    <div key={item.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          {item.name}
                        </span>
                        {isLeader && (
                          <span className="inline-flex items-center gap-1 text-2xs font-bold uppercase bg-surface text-primary border border-border rounded-xl py-0.5 px-1.5">
                            <Trophy size={11} aria-hidden="true" /> Leader
                          </span>
                        )}
                        {!isLeader && items.length > 1 && (
                          <span className="inline-flex items-center text-2xs font-bold text-muted bg-surface border border-border rounded-xl py-0.5 px-1.5">
                            {metric.higherIsBetter
                              ? `-${Math.round((1 - val / bestValue) * 100)}%`
                              : `+${Math.round(((val - bestValue) / bestValue) * 100)}% time`}
                          </span>
                        )}
                        <strong className="font-extrabold text-foreground tabular-nums">
                          {metric.formatValue(val)}
                        </strong>
                      </div>

                      <div
                        className="h-2 bg-background rounded-xl overflow-hidden"
                        aria-hidden="true"
                      >
                        <div
                          className={cn(
                            `h-full bg-border rounded-xl transition-all duration-300 motion-reduce:transition-none${isLeader ? ' bg-primary shadow-card' : ''}`,
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
