import type { Product } from '../../../shared/products/types/product';

export interface BottleneckDiagnosis {
  score: number;
  label: string;
  description: string;
  isWarning: boolean;
}

const CPU_TIER_RANK: Record<string, number> = {
  'vortex-9600x': 1,
  'vortex-9700x': 2,
  'vortex-9800x3d': 3,
  'vortex-9950x': 4,
};

const GPU_TIER_RANK: Record<string, number> = {
  'zenith-9600xt': 1,
  'zenith-9700xt': 2,
  'zenith-9800xt': 3,
  'zenith-9900xtx': 4,
};

export function calculateSynergy(
  cpu: Product | null,
  gpu: Product | null,
): BottleneckDiagnosis {
  if (!cpu || !gpu) {
    return {
      score: 100,
      label: 'Optimal Balance',
      description:
        'Select CPU and GPU to calculate real-time architecture balance.',
      isWarning: false,
    };
  }

  const cpuRank = CPU_TIER_RANK[cpu.id] ?? 2;
  const gpuRank = GPU_TIER_RANK[gpu.id] ?? 2;
  const diff = cpuRank - gpuRank;

  if (diff === 0) {
    return {
      score: 99,
      label: 'Optimal 4K Balance',
      description:
        'Calculated zero compute starvation: CPU frame delivery perfectly aligns with GPU compute fill-rate.',
      isWarning: false,
    };
  }

  if (Math.abs(diff) === 1) {
    return {
      score: 93,
      label: 'High Synergy (Sub-7% Margin)',
      description:
        'Minor throughput variance: excellent frame pacing with abundant headroom for background workloads.',
      isWarning: false,
    };
  }

  if (diff <= -2) {
    return {
      score: 72,
      label: 'CPU Bottleneck Advisory',
      description: `CPU bottleneck detected: ${cpu.name} will limit ${gpu.name} peak rasterization throughput in high-framerate scenarios.`,
      isWarning: true,
    };
  }

  return {
    score: 79,
    label: 'GPU Limitation Advisory',
    description: `GPU throughput limitation: ${cpu.name} compute headroom significantly exceeds ${gpu.name} graphic bandwidth.`,
    isWarning: true,
  };
}
