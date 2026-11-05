import { CheckCircle, PackagePlus, ShoppingBag, Sparkles, Zap } from 'lucide-react';

interface PowerSynergyMeterProps {
  totalTdp: number;
  recommendedPsu: number;
  synergyScore: number;
  totalPrice: number;
  onAddAssembledRig: () => void;
  onAddIndividualComponents: () => void;
  justAddedBundle: boolean;
  justAddedIndividual: boolean;
}

export function PowerSynergyMeter({
  totalTdp,
  recommendedPsu,
  synergyScore,
  totalPrice,
  onAddAssembledRig,
  onAddIndividualComponents,
  justAddedBundle,
  justAddedIndividual,
}: PowerSynergyMeterProps) {
  // Power safety zone calculation (max target bar scale 1000W)
  const powerPercentage = Math.min(100, (totalTdp / 900) * 100);

  return (
    <div className="power-synergy-meter" aria-labelledby="synergy-meter-heading">
      <div className="synergy-header">
        <h3 id="synergy-meter-heading" className="synergy-title">
          <Zap size={18} className="synergy-icon" aria-hidden="true" />
          Live Synergy & Power Diagnostics
        </h3>
        <span className="synergy-tag">Real-Time Validation</span>
      </div>

      <div className="synergy-diagnostics-grid">
        <div className="diagnostic-block">
          <div className="diagnostic-header">
            <span className="diagnostic-label">Estimated System Power</span>
            <strong className="diagnostic-value">{totalTdp}W</strong>
          </div>
          <div className="power-gauge-track" aria-hidden="true">
            <div
              className="power-gauge-fill"
              style={{ width: `${powerPercentage}%` }}
            />
          </div>
          <div className="power-gauge-legend">
            <span>Idle (80W)</span>
            <span>Target Sustained ({totalTdp}W)</span>
            <span>Limit (900W)</span>
          </div>
        </div>

        <div className="diagnostic-block">
          <div className="diagnostic-header">
            <span className="diagnostic-label">Recommended PSU</span>
            <strong className="diagnostic-value diagnostic-value--accent">
              {recommendedPsu}W 80+ Gold
            </strong>
          </div>
          <p className="diagnostic-desc">
            Provides ample transient spike headroom for sustained all-core rendering and peak gaming clocks.
          </p>
        </div>

        <div className="diagnostic-block">
          <div className="diagnostic-header">
            <span className="diagnostic-label">Bottleneck Balance Index</span>
            <strong className="diagnostic-value diagnostic-value--emerald">
              <Sparkles size={14} aria-hidden="true" /> {synergyScore}% Optimal 4K Balance
            </strong>
          </div>
          <p className="diagnostic-desc">
            Calculated zero compute starvation: CPU delivers frame pacing aligned with GPU compute fill-rate.
          </p>
        </div>
      </div>

      <div className="configurator-price-dock">
        <div className="configurator-price-info">
          <span className="configurator-price-label">Configured Total (Includes Assembly)</span>
          <strong className="configurator-price-val">${totalPrice.toLocaleString()}</strong>
        </div>

        <div className="configurator-actions-group">
          <button
            type="button"
            className="button button--primary"
            onClick={onAddAssembledRig}
          >
            <PackagePlus size={16} aria-hidden="true" />
            <span>Add as Assembled Custom Rig</span>
          </button>

          <button
            type="button"
            className="button button--quiet"
            onClick={onAddIndividualComponents}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span>Add Components Individually</span>
          </button>
        </div>

        {justAddedBundle && (
          <div className="cart-feedback-pill" role="status">
            <CheckCircle size={15} aria-hidden="true" />
            <span>Custom Rig added to cart as bundled build!</span>
          </div>
        )}

        {justAddedIndividual && (
          <div className="cart-feedback-pill" role="status">
            <CheckCircle size={15} aria-hidden="true" />
            <span>Individual CPU and GPU components added to cart!</span>
          </div>
        )}
      </div>
    </div>
  );
}
