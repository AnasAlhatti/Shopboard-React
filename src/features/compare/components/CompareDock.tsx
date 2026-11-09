'use client';
import { ArrowUpRight, Scale, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { useCompare } from '../hooks/useCompare';

export function CompareDock() {
  const { comparedItems, category, clearCompare } = useCompare();

  if (comparedItems.length === 0) return null;

  return (
    <aside
      className="fixed z-20 right-4 bottom-4 left-4 flex max-w-96 items-center gap-3 mx-auto p-3 border border-primary/35 rounded-xl bg-surface shadow-card backdrop-blur-md md:right-6 md:bottom-6 md:left-auto md:m-0"
      aria-label="Selected products for comparison"
    >
      <span
        className="grid w-10 h-10 flex-none place-items-center rounded-lg bg-primary/15 text-primary"
        aria-hidden="true"
      >
        <Scale size={18} />
      </span>
      <span className="grid min-w-0 gap-1 text-xs">
        <strong>{comparedItems.length} selected</strong>
        <span className="text-muted text-2xs tracking-wide">
          {category?.toUpperCase()} bench
        </span>
      </span>
      <Link
        className="inline-flex items-center gap-1.5 ml-auto text-foreground text-xs font-bold no-underline"
        href="/compare"
      >
        Compare <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
      <Button
        variant="ghost"
        className="inline-grid flex-none place-items-center border border-border rounded-lg bg-surface text-foreground transition motion-reduce:transition-none duration-150 hover:border-primary/45 hover:text-primary motion-safe:enabled:active:scale-95 motion-safe:enabled:active:duration-150 motion-reduce:duration-150 w-9 h-9"
        type="button"
        aria-label="Clear comparison"
        onClick={clearCompare}
      >
        <X size={16} aria-hidden="true" />
      </Button>
    </aside>
  );
}
