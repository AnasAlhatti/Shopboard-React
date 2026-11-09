'use client';
import {
  ArrowLeft,
  Cpu,
  Gauge,
  Plus,
  Scale,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { AsyncBoundary } from '../../shared/async/AsyncBoundary';
import { BenchmarkBarChart } from './components/BenchmarkBarChart';
import { CompareProductPicker } from './components/CompareProductPicker';
import { CompareTable } from './components/CompareTable';
import { useCompare } from './hooks/useCompare';
export function ComparePage() {
  const { comparedItems, category, removeFromCompare, clearCompare } =
    useCompare();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [highlightWinners, setHighlightWinners] = useState(true);

  if (comparedItems.length === 0) {
    return (
      <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
        <div
          className="text-center py-16 px-6 bg-surface border border-border rounded-lg my-12"
          role="status"
        >
          <Scale size={42} className="compare-empty__icon" aria-hidden="true" />
          <p className="text-xs font-extrabold tracking-widest uppercase text-muted max-w-prose mt-0 mr-auto mb-6 ml-auto">
            Benchmark Arena
          </p>
          <h1 className="text-3xl mt-1 mr-0 mb-2 ml-0">
            Comparison Bench Empty
          </h1>
          <p className="text-muted max-w-prose mt-0 mr-auto mb-6 ml-auto">
            Pin 2 to 4 processors or graphics cards from the silicon storefront
            to run head-to-head architectural benchmarks and performance
            breakdowns.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/products">
              <ArrowLeft size={16} aria-hidden="true" /> Explore Catalog
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-8 pb-16 w-shell max-w-page mx-auto">
      <header className="flex flex-col gap-4 mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-surface border border-border py-1.5 px-3 rounded-sm text-xs text-primary font-bold tracking-wide w-fit">
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
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mt-1 mr-0 mb-0 ml-0">
            Benchmark Comparison Bench
          </h1>
          <p className="text-muted">
            Side-by-side silicon metrics, thermal TDP dissipation, and
            standardized testbench performance bars.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            type="button"
            className={cn(
              `text-xs${highlightWinners ? ' border-primary bg-primary/15 text-primary' : ''}`,
            )}
            onClick={() => setHighlightWinners((prev) => !prev)}
            aria-pressed={highlightWinners}
            title="Toggle difference and winner highlights"
            size="sm"
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>{highlightWinners ? 'Highlights On' : 'Highlights Off'}</span>
          </Button>

          {comparedItems.length < 4 && (
            <Button
              variant="primary"
              type="button"
              onClick={() => setPickerOpen(true)}
              size="sm"
            >
              <Plus size={15} aria-hidden="true" /> Add Silicon
            </Button>
          )}

          <Button
            variant="secondary"
            type="button"
            onClick={clearCompare}
            size="sm"
          >
            <Trash2 size={14} aria-hidden="true" /> Clear Bench
          </Button>
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
