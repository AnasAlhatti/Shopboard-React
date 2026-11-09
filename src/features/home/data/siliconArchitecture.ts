import type { Product } from '../../../shared/products/types/product';

export type SiliconKind = 'cpu' | 'gpu';

export interface SiliconMetric {
  readonly label: string;
  readonly value: string;
}

export function getSiliconDashboard(
  product: Product | undefined,
  kind: SiliconKind,
): readonly SiliconMetric[] {
  const specs = product?.specs;
  if (kind === 'cpu')
    return [
      {
        label: 'Cores / threads',
        value:
          specs?.cores && specs.threads
            ? `${specs.cores} / ${specs.threads}`
            : 'Not specified',
      },
      { label: 'Boost clock', value: specs?.boostClock ?? 'Not specified' },
      { label: 'Cache', value: specs?.cache ?? 'Not specified' },
      {
        label: 'Thermal design',
        value: specs?.tdp === undefined ? 'Not specified' : `${specs.tdp} W`,
      },
    ];
  return [
    {
      label: 'Compute',
      value:
        specs?.tflops === undefined
          ? 'Not specified'
          : `${specs.tflops} TFLOPs`,
    },
    { label: 'Memory', value: specs?.vram ?? 'Not specified' },
    { label: 'Memory bus', value: specs?.busWidth ?? 'Not specified' },
    {
      label: 'Board power',
      value: specs?.tdp === undefined ? 'Not specified' : `${specs.tdp} W`,
    },
  ];
}
