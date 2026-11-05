export interface MemoryStorageTier {
  id: string;
  name: string;
  specs: string;
  price: number;
  tdp: number;
}

export const MEMORY_STORAGE_TIERS: MemoryStorageTier[] = [
  {
    id: 'tier-32gb-1tb',
    name: 'Standard Pro Tier',
    specs: '32GB Dual-Channel DDR5-6000 + 1TB Gen5 NVMe SSD',
    price: 180,
    tdp: 35,
  },
  {
    id: 'tier-64gb-2tb',
    name: 'Extreme Compute Tier',
    specs: '64GB Dual-Channel DDR5-6400 + 2TB Gen5 NVMe SSD',
    price: 320,
    tdp: 45,
  },
  {
    id: 'tier-128gb-4tb',
    name: 'Workstation Apex Tier',
    specs: '128GB Quad-Channel DDR5-6400 + 4TB Gen5 NVMe SSD',
    price: 580,
    tdp: 60,
  },
];
