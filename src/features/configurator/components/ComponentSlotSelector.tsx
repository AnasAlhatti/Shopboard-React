import { Card } from '@/components/ui/Card';
import { Check, Cpu, HardDrive, Layers } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cva } from 'class-variance-authority';

const componentOption = cva(
  'border rounded-lg min-w-0 p-3 cursor-pointer flex flex-col items-stretch justify-start text-left whitespace-normal transition-colors duration-150 hover:border-primary/50',
  {
    variants: {
      selected: {
        true: 'bg-primary/5 border-primary',
        false: 'bg-background border-border',
      },
    },
  },
);
import type { Product } from '../../../shared/products/types/product';
import { MEMORY_STORAGE_TIERS, type MemoryStorageTier } from '../data/tiers';

export { MEMORY_STORAGE_TIERS, type MemoryStorageTier };

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
    <div className="flex min-w-0 flex-col gap-5">
      {/* Slot 1: CPU Selection */}
      <Card
        as="section"
        variant="flat"
        padding="sm"
        className="sm:p-5"
        aria-labelledby="cpu-slot-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-surface border border-border text-primary text-sm font-extrabold w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
            01
          </span>
          <div>
            <h3
              id="cpu-slot-title"
              className="flex items-center gap-2 text-lg font-semibold mt-0 mr-0 mb-1 ml-0"
            >
              <Cpu size={18} aria-hidden="true" /> Select Desktop Processor
              (CPU)
            </h3>
            <p className="text-sm text-muted m-0">
              Powers multi-thread compilation, physics, and frame delivery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cpus.map((cpu) => {
            const isSelected = selectedCpu?.id === cpu.id;
            return (
              <Button
                variant="ghost"
                static
                key={cpu.id}
                type="button"
                className={componentOption({ selected: isSelected })}
                onClick={() => onSelectCpu(cpu)}
                aria-pressed={isSelected}
              >
                <div className="w-full h-20 bg-surface rounded-sm overflow-hidden mb-2.5">
                  <img
                    src={cpu.image}
                    alt={cpu.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex w-full min-w-0 flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-base font-bold text-foreground m-0">
                      {cpu.name}
                    </h4>
                    {isSelected && (
                      <Check
                        size={16}
                        className="text-primary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="text-sm font-normal text-muted mt-0 mr-0 mb-2 ml-0">
                    {cpu.specs.cores}C / {cpu.specs.threads}T ·{' '}
                    {cpu.specs.boostClock} · {cpu.specs.tdp}W
                  </p>
                  <span className="text-base font-extrabold text-foreground tabular-nums mt-auto">
                    ${cpu.price.toLocaleString()}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Slot 2: GPU Selection */}
      <Card
        as="section"
        variant="flat"
        padding="sm"
        className="sm:p-5"
        aria-labelledby="gpu-slot-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-surface border border-border text-primary text-sm font-extrabold w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
            02
          </span>
          <div>
            <h3
              id="gpu-slot-title"
              className="flex items-center gap-2 text-lg font-semibold mt-0 mr-0 mb-1 ml-0"
            >
              <Layers size={18} aria-hidden="true" /> Select Graphics Engine
              (GPU)
            </h3>
            <p className="text-sm text-muted m-0">
              Drives high-resolution 4K rasterization and real-time ray tracing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gpus.map((gpu) => {
            const isSelected = selectedGpu?.id === gpu.id;
            return (
              <Button
                variant="ghost"
                static
                key={gpu.id}
                type="button"
                className={componentOption({ selected: isSelected })}
                onClick={() => onSelectGpu(gpu)}
                aria-pressed={isSelected}
              >
                <div className="w-full h-20 bg-surface rounded-sm overflow-hidden mb-2.5">
                  <img
                    src={gpu.image}
                    alt={gpu.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex w-full min-w-0 flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-base font-bold text-foreground m-0">
                      {gpu.name}
                    </h4>
                    {isSelected && (
                      <Check
                        size={16}
                        className="text-primary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="text-sm font-normal text-muted mt-0 mr-0 mb-2 ml-0">
                    {gpu.specs.vram} · {gpu.specs.tflops?.toFixed(1)} TFLOPs ·{' '}
                    {gpu.specs.tdp}W
                  </p>
                  <span className="text-base font-extrabold text-foreground tabular-nums mt-auto">
                    ${gpu.price.toLocaleString()}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Slot 3: Memory & Storage Tier */}
      <Card
        as="section"
        variant="flat"
        padding="sm"
        className="sm:p-5"
        aria-labelledby="memory-slot-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-surface border border-border text-primary text-sm font-extrabold w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
            03
          </span>
          <div>
            <h3
              id="memory-slot-title"
              className="flex items-center gap-2 text-lg font-semibold mt-0 mr-0 mb-1 ml-0"
            >
              <HardDrive size={18} aria-hidden="true" /> Select Memory & Storage
              Package
            </h3>
            <p className="text-sm text-muted m-0">
              High-bandwidth DDR5 memory combined with Gen5 NVMe storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEMORY_STORAGE_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <Button
                variant="ghost"
                static
                key={tier.id}
                type="button"
                className={componentOption({ selected: isSelected })}
                onClick={() => onSelectTier(tier)}
                aria-pressed={isSelected}
              >
                <div className="flex w-full min-w-0 flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-base font-bold text-foreground m-0">
                      {tier.name}
                    </h4>
                    {isSelected && (
                      <Check
                        size={16}
                        className="text-primary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="text-sm font-normal text-muted mt-0 mr-0 mb-2 ml-0">
                    {tier.specs}
                  </p>
                  <div className="flex items-baseline justify-between mt-auto">
                    <span className="text-base font-extrabold text-foreground tabular-nums mt-auto">
                      +${tier.price}
                    </span>
                    <span className="text-xs text-primary">
                      {tier.tdp}W TDP
                    </span>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
