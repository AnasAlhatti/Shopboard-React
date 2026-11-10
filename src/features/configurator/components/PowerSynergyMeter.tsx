import { Card } from '@/components/ui/Card';
import {
  AlertTriangle,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import type { BottleneckDiagnosis } from '../utils/bottleneck';

interface PowerSynergyMeterProps {
  totalTdp: number;
  recommendedPsu: number;
  diagnosis: BottleneckDiagnosis;
  totalPrice: number;
  onAddAssembledRig: () => void;
  onAddIndividualComponents: () => void;
}

export function PowerSynergyMeter({
  totalTdp,
  recommendedPsu,
  diagnosis,
  totalPrice,
  onAddAssembledRig,
  onAddIndividualComponents,
}: PowerSynergyMeterProps) {
  // Power safety zone calculation (max target bar scale 1000W)
  const powerPercentage = Math.min(100, (totalTdp / 900) * 100);

  return (
    <Card
      variant="flat"
      padding="sm"
      className="sm:p-6"
      aria-labelledby="synergy-meter-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-border pb-2">
        <h3
          id="synergy-meter-heading"
          className="flex items-center gap-2 text-lg font-semibold m-0"
        >
          <Zap size={18} className="text-primary" aria-hidden="true" />
          Live Synergy & Power Diagnostics
        </h3>
        <span
          className={cn(
            `text-xs uppercase text-muted font-bold${diagnosis.isWarning ? ' text-primary' : ''}`,
          )}
        >
          {diagnosis.isWarning ? 'Bottleneck Notice' : 'Real-Time Validation'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-3">
        <Card variant="inset" padding="sm" className="flex flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase text-muted">
              Estimated System Power
            </span>
            <strong className="text-lg font-extrabold tabular-nums">
              {totalTdp}W
            </strong>
          </div>
          <div
            className="h-2 bg-surface rounded-xl overflow-hidden mt-1.5 mr-0 mb-1.5 ml-0"
            aria-hidden="true"
          >
            <div
              className="h-full bg-linear-to-r from-primary/70 to-primary rounded-xl "
              style={{ width: `${powerPercentage}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted">
            <span>Idle (80W)</span>
            <span>Target Sustained ({totalTdp}W)</span>
            <span>Limit (900W)</span>
          </div>
        </Card>

        <Card variant="inset" padding="sm" className="flex flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase text-muted">
              Recommended PSU
            </span>
            <strong className="text-lg font-extrabold tabular-nums text-primary">
              {recommendedPsu}W 80+ Gold
            </strong>
          </div>
          <p className="text-sm text-muted m-0 leading-normal">
            Provides ample transient spike headroom for sustained all-core
            rendering and peak gaming clocks.
          </p>
        </Card>

        <Card variant="inset" padding="sm" className="flex flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase text-muted">
              Bottleneck Balance Index
            </span>
            <strong
              className={cn(
                `text-lg font-extrabold tabular-nums ${
                  diagnosis.isWarning
                    ? 'text-primary flex items-center gap-1.5'
                    : 'text-muted flex items-center gap-1.5'
                }`,
              )}
            >
              {diagnosis.isWarning ? (
                <AlertTriangle size={14} aria-hidden="true" />
              ) : (
                <Sparkles size={14} aria-hidden="true" />
              )}
              {diagnosis.score}% {diagnosis.label}
            </strong>
          </div>
          <p className="text-sm text-muted m-0 leading-normal">
            {diagnosis.description}
          </p>
        </Card>
      </div>

      <div className="border-t border-border pt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted">
            Configured Total (Includes Assembly)
          </span>
          <strong className="text-3xl font-extrabold text-foreground tabular-nums">
            ${totalPrice.toLocaleString()}
          </strong>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="primary"
            type="button"
            onClick={onAddAssembledRig}
            size="md"
          >
            <PackagePlus size={16} aria-hidden="true" />
            <span>Add as Assembled Custom Rig</span>
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={onAddIndividualComponents}
            size="md"
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span>Add Components Individually</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
