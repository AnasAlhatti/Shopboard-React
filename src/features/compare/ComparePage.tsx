import { useState } from 'react';
import {
  ArrowLeft,
  Cpu,
  Gauge,
  Plus,
  Scale,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from './hooks/useCompare';
import { BenchmarkBarChart } from './components/BenchmarkBarChart';
import { CompareTable } from './components/CompareTable';
import { CompareProductPicker } from './components/CompareProductPicker';
import { AsyncBoundary } from '../../shared/components/AsyncBoundary';
import './compare.css';

export function ComparePage() {
  const { comparedItems, category, removeFromCompare, clearCompare } =
    useCompare();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [highlightWinners, setHighlightWinners] = useState(true);

  if (comparedItems.length === 0) {
    return (
      <main className="compare-page page-width">
        <div className="compare-empty" role="status">
          <Scale size={42} className="compare-empty__icon" aria-hidden="true" />
          <p className="eyebrow">Benchmark Arena</p>
          <h1>Comparison Bench Empty</h1>
          <p>
            Pin 2 to 4 processors or graphics cards from the silicon storefront
            to run head-to-head architectural benchmarks and performance
            breakdowns.
          </p>
          <Link to="/catalog" className="button button--primary">
            <ArrowLeft size={16} aria-hidden="true" /> Explore Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="compare-page page-width">
      <header className="compare-page__header">
        <div>
          <div className="compare-category-badge">
            {category === 'cpu' ? (
              <>
                <Cpu size={14} aria-hidden="true" /> CPU Benchmarking Mode
              </>
            ) : (
              <>
                <Gauge size={14} aria-hidden="true" /> GPU Benchmarking Mode
              </>
            )}
          </div>
          <h1>Benchmark Comparison Bench</h1>
          <p>
            Side-by-side silicon metrics, thermal TDP dissipation, and
            standardized testbench performance bars.
          </p>
        </div>

        <div className="compare-header-actions">
          <button
            type="button"
            className={`button button--quiet button--sm${highlightWinners ? ' is-active' : ''}`}
            onClick={() => setHighlightWinners((prev) => !prev)}
            aria-pressed={highlightWinners}
            title="Toggle difference and winner highlights"
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>{highlightWinners ? 'Highlights On' : 'Highlights Off'}</span>
          </button>

          {comparedItems.length < 4 && (
            <button
              type="button"
              className="button button--primary button--sm"
              onClick={() => setPickerOpen(true)}
            >
              <Plus size={15} aria-hidden="true" /> Add Silicon
            </button>
          )}

          <button
            type="button"
            className="button button--quiet button--sm"
            onClick={clearCompare}
          >
            <Trash2 size={14} aria-hidden="true" /> Clear Bench
          </button>
        </div>
      </header>

      <CompareTable
        items={comparedItems}
        onRemove={removeFromCompare}
        onOpenPicker={() => setPickerOpen(true)}
        highlightWinners={highlightWinners}
      />

      <BenchmarkBarChart items={comparedItems} />

      {pickerOpen && (
        <AsyncBoundary>
          <CompareProductPicker onClose={() => setPickerOpen(false)} />
        </AsyncBoundary>
      )}
    </main>
  );
}
