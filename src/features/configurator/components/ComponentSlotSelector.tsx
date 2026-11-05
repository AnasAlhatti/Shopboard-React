import { Check, Cpu, HardDrive, Layers } from 'lucide-react';
import type { Product } from '../../../types/product';

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

interface ComponentSlotSelectorProps {
  cpus: Product[];
  gpus: Product[];
  selectedCpu: Product | null;
  onSelectCpu: (cpu: Product) => void;
  selectedGpu: Product | null;
  onSelectGpu: (gpu: Product) => void;
  selectedTier: MemoryStorageTier;
  onSelectTier: (tier: MemoryStorageTier) => void;
}

export function ComponentSlotSelector({
  cpus,
  gpus,
  selectedCpu,
  onSelectCpu,
  selectedGpu,
  onSelectGpu,
  selectedTier,
  onSelectTier,
}: ComponentSlotSelectorProps) {
  return (
    <div className="component-slot-selector">
      {/* Slot 1: CPU Selection */}
      <section className="slot-section" aria-labelledby="cpu-slot-title">
        <div className="slot-section__header">
          <span className="slot-step-badge">01</span>
          <div>
            <h3 id="cpu-slot-title" className="slot-section__title">
              <Cpu size={18} aria-hidden="true" /> Select Desktop Processor (CPU)
            </h3>
            <p className="slot-section__subtitle">Powers multi-thread compilation, physics, and frame delivery.</p>
          </div>
        </div>

        <div className="slot-cards-grid">
          {cpus.map((cpu) => {
            const isSelected = selectedCpu?.id === cpu.id;
            return (
              <button
                key={cpu.id}
                type="button"
                className={`slot-option-card${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelectCpu(cpu)}
                aria-pressed={isSelected}
              >
                <div className="slot-option-media">
                  <img src={cpu.image} alt={cpu.name} />
                </div>
                <div className="slot-option-info">
                  <div className="slot-option-name-row">
                    <h4>{cpu.name}</h4>
                    {isSelected && <Check size={16} className="slot-check-icon" aria-hidden="true" />}
                  </div>
                  <p className="slot-option-specs">
                    {cpu.specs.cores}C / {cpu.specs.threads}T · {cpu.specs.boostClock} · {cpu.specs.tdp}W
                  </p>
                  <span className="slot-option-price">${cpu.price.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Slot 2: GPU Selection */}
      <section className="slot-section" aria-labelledby="gpu-slot-title">
        <div className="slot-section__header">
          <span className="slot-step-badge">02</span>
          <div>
            <h3 id="gpu-slot-title" className="slot-section__title">
              <Layers size={18} aria-hidden="true" /> Select Graphics Engine (GPU)
            </h3>
            <p className="slot-section__subtitle">Drives high-resolution 4K rasterization and real-time ray tracing.</p>
          </div>
        </div>

        <div className="slot-cards-grid">
          {gpus.map((gpu) => {
            const isSelected = selectedGpu?.id === gpu.id;
            return (
              <button
                key={gpu.id}
                type="button"
                className={`slot-option-card${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelectGpu(gpu)}
                aria-pressed={isSelected}
              >
                <div className="slot-option-media">
                  <img src={gpu.image} alt={gpu.name} />
                </div>
                <div className="slot-option-info">
                  <div className="slot-option-name-row">
                    <h4>{gpu.name}</h4>
                    {isSelected && <Check size={16} className="slot-check-icon" aria-hidden="true" />}
                  </div>
                  <p className="slot-option-specs">
                    {gpu.specs.vram} · {gpu.specs.tflops?.toFixed(1)} TFLOPs · {gpu.specs.tdp}W
                  </p>
                  <span className="slot-option-price">${gpu.price.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Slot 3: Memory & Storage Tier */}
      <section className="slot-section" aria-labelledby="memory-slot-title">
        <div className="slot-section__header">
          <span className="slot-step-badge">03</span>
          <div>
            <h3 id="memory-slot-title" className="slot-section__title">
              <HardDrive size={18} aria-hidden="true" /> Select Memory & Storage Package
            </h3>
            <p className="slot-section__subtitle">High-bandwidth DDR5 memory combined with Gen5 NVMe storage.</p>
          </div>
        </div>

        <div className="slot-cards-grid slot-cards-grid--tiers">
          {MEMORY_STORAGE_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                className={`slot-option-card${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelectTier(tier)}
                aria-pressed={isSelected}
              >
                <div className="slot-option-info">
                  <div className="slot-option-name-row">
                    <h4>{tier.name}</h4>
                    {isSelected && <Check size={16} className="slot-check-icon" aria-hidden="true" />}
                  </div>
                  <p className="slot-option-specs">{tier.specs}</p>
                  <div className="slot-option-tier-footer">
                    <span className="slot-option-price">+${tier.price}</span>
                    <span className="slot-option-tdp">{tier.tdp}W TDP</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
