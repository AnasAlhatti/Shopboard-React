export interface Product {
  id: string;
  name: string;
  category: 'cpu' | 'gpu' | 'storage';
  series: string;
  tagline: string;
  price: number;
  image: string;
  specs: {
    cores?: string;
    threads?: string;
    boostClock: string;
    cache?: string;
    vram?: string;
    busWidth?: string;
    tflops?: number;
    tdp: number;
  };
  benchmarks: {
    cyberpunk4k?: number;
    blackMyth1440p?: number;
    cinebenchMulti?: number;
    blenderRenderSec?: number;
    efficiencyScore: number;
  };
  description: string;
  features: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isOptionalNumber(value: unknown): boolean {
  return (
    value === undefined || (typeof value === 'number' && Number.isFinite(value))
  );
}

export function isProduct(value: unknown): value is Product {
  if (!isRecord(value) || !isRecord(value.specs) || !isRecord(value.benchmarks))
    return false;
  const { specs, benchmarks } = value;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.category === 'cpu' ||
      value.category === 'gpu' ||
      value.category === 'storage') &&
    typeof value.series === 'string' &&
    typeof value.tagline === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    typeof value.image === 'string' &&
    typeof specs.boostClock === 'string' &&
    typeof specs.tdp === 'number' &&
    Number.isFinite(specs.tdp) &&
    isOptionalString(specs.cores) &&
    isOptionalString(specs.threads) &&
    isOptionalString(specs.cache) &&
    isOptionalString(specs.vram) &&
    isOptionalString(specs.busWidth) &&
    isOptionalNumber(specs.tflops) &&
    isOptionalNumber(benchmarks.cyberpunk4k) &&
    isOptionalNumber(benchmarks.blackMyth1440p) &&
    isOptionalNumber(benchmarks.cinebenchMulti) &&
    isOptionalNumber(benchmarks.blenderRenderSec) &&
    typeof benchmarks.efficiencyScore === 'number' &&
    Number.isFinite(benchmarks.efficiencyScore) &&
    typeof value.description === 'string' &&
    Array.isArray(value.features) &&
    value.features.every((feature) => typeof feature === 'string')
  );
}
