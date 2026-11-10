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
    <section
      className="overflow-hidden rounded-lg border border-border bg-surface"
      aria-label="Your configured desktop"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="m-0 text-lg font-semibold">Your build</h2>
        <span className="text-xs text-muted">Illustrative preview</span>
      </div>
      <img
        src="/assets/pc-hardware-glass-case-a7ed0ff3.jpg"
        alt="Aethel battlestation inside illuminated tempered glass chassis"
        className="h-40 w-full object-cover sm:h-72"
      />
      <dl className="m-0 grid gap-4 border-t border-border p-5 sm:grid-cols-2">
        <div>
          <dt className="mb-1 text-xs text-muted">Processor</dt>
          <dd className="m-0 text-sm font-medium">
            {selectedCpu?.name ?? 'Select CPU'}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs text-muted">Graphics Engine</dt>
          <dd className="m-0 text-sm font-medium">
            {selectedGpu?.name ?? 'Select GPU'}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="mb-1 text-xs text-muted">Memory &amp; Storage</dt>
          <dd className="m-0 text-sm font-medium">{selectedRamTier}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap justify-between gap-4 border-t border-border px-5 py-4">
        <div>
          <span className="block text-xs text-muted">Total Power Draw</span>
          <strong className="text-lg font-semibold tabular-nums">
            {totalTdp}W TDP
          </strong>
        </div>
        <div>
          <span className="block text-xs text-muted">Rig Price</span>
          <strong className="text-lg font-semibold tabular-nums">
            ${totalPrice.toLocaleString()}
          </strong>
        </div>
      </div>
      <p className="m-0 flex items-center gap-2 border-t border-border px-5 py-3 text-xs text-muted">
        <ShieldCheck size={16} aria-hidden="true" />
        3-Year Assembly Warranty
      </p>
    </section>
  );
}
