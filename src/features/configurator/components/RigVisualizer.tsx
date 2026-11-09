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
    <div className="rig-visualizer">
      <div className="rig-visualizer__frame">
        <img
          src="/assets/pc-hardware-glass-case-a7ed0ff3.jpg"
          alt="Aethel battlestation inside illuminated tempered glass chassis"
          className="rig-visualizer__image"
        />
        <div className="rig-visualizer__overlay" aria-hidden="true" />

        <div className="rig-overlay-badge rig-overlay-badge--cpu">
          <span className="badge-dot" />
          <div className="badge-text">
            <span className="badge-label">Processor</span>
            <strong>{selectedCpu ? selectedCpu.name : 'Select CPU'}</strong>
          </div>
        </div>

        <div className="rig-overlay-badge rig-overlay-badge--gpu">
          <span className="badge-dot" />
          <div className="badge-text">
            <span className="badge-label">Graphics Engine</span>
            <strong>{selectedGpu ? selectedGpu.name : 'Select GPU'}</strong>
          </div>
        </div>
      </div>

      <div className="rig-visualizer__footer">
        <div className="rig-footer-item">
          <span className="rig-footer-label">Memory & Storage</span>
          <strong className="rig-footer-value">{selectedRamTier}</strong>
        </div>

        <div className="rig-footer-item">
          <span className="rig-footer-label">Total Power Draw</span>
          <strong className="rig-footer-value rig-footer-value--accent">
            {totalTdp}W TDP
          </strong>
        </div>

        <div className="rig-footer-item">
          <span className="rig-footer-label">Rig Price</span>
          <strong className="rig-footer-value">
            ${totalPrice.toLocaleString()}
          </strong>
        </div>

        <div className="rig-warranty-badge">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>3-Year Assembly Warranty</span>
        </div>
      </div>
    </div>
  );
}
