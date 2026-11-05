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
