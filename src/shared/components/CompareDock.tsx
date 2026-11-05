import { ArrowUpRight, Scale, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../hooks/useCompare';

export function CompareDock() {
  const { comparedItems, category, clearCompare } = useCompare();

  if (comparedItems.length === 0) return null;

  return (
    <aside
      className="compare-dock"
      aria-label="Selected products for comparison"
    >
      <span className="compare-dock__icon" aria-hidden="true">
        <Scale size={18} />
      </span>
      <span className="compare-dock__copy">
        <strong>{comparedItems.length} selected</strong>
        <span>{category?.toUpperCase()} bench</span>
      </span>
      <Link className="compare-dock__action" to="/compare">
        Compare <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
      <button
        className="icon-button compare-dock__clear"
        type="button"
        aria-label="Clear comparison"
        onClick={clearCompare}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  );
}
