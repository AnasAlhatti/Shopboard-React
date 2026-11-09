import { ShieldCheck } from 'lucide-react';
import type { Product } from '../../../shared/products/types/product';

interface RigVisualizerProps {
  selectedCpu: Product | null;
  selectedGpu: Product | null;
  selectedRamTier: string;
  totalTdp: number;
  totalPrice: number;
}

export function RigVisualizer({
  selectedCpu,
  selectedGpu,
  selectedRamTier,
  totalTdp,
  totalPrice,
}: RigVisualizerProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-card">
      <div className="relative aspect-square sm:aspect-video bg-surface overflow-hidden">
        <img
          src="/assets/pc-hardware-glass-case-a7ed0ff3.jpg"
          alt="Aethel battlestation inside illuminated tempered glass chassis"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute bg-surface backdrop-blur-md border border-border rounded-md py-2 px-3 flex items-center gap-2.5 shadow-card top-4 left-4">
          <span className="w-2 h-2 rounded-full bg-primary shadow-card" />
          <div className="flex flex-col">
            <span className="text-2xs uppercase text-muted">Processor</span>
            <strong className="text-sm text-foreground break-words">
              {selectedCpu ? selectedCpu.name : 'Select CPU'}
            </strong>
          </div>
        </div>

        <div className="absolute bg-surface backdrop-blur-md border border-border rounded-md py-2 px-3 flex items-center gap-2.5 shadow-card bottom-4 right-4">
          <span className="w-2 h-2 rounded-full bg-primary shadow-card" />
          <div className="flex flex-col">
            <span className="text-2xs uppercase text-muted">
              Graphics Engine
            </span>
            <strong className="text-sm text-foreground break-words">
              {selectedGpu ? selectedGpu.name : 'Select GPU'}
            </strong>
          </div>
        </div>
      </div>

      <div className="py-4 px-8 border-t border-border flex flex-wrap items-center justify-between gap-4 bg-surface">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted">Memory & Storage</span>
          <strong className="text-base font-bold text-foreground tabular-nums">
            {selectedRamTier}
          </strong>
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted">Total Power Draw</span>
          <strong className="text-base font-bold tabular-nums text-primary">
            {totalTdp}W TDP
          </strong>
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted">Rig Price</span>
          <strong className="text-base font-bold text-foreground tabular-nums">
            ${totalPrice.toLocaleString()}
          </strong>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>3-Year Assembly Warranty</span>
        </div>
      </div>
    </div>
  );
}
