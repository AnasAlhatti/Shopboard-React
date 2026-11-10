import { Cpu, Gauge, Layers, RotateCcw, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: 'all' | 'cpu' | 'gpu';
  onCategoryChange: (category: 'all' | 'cpu' | 'gpu') => void;
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  maxTdp: number;
  onMaxTdpChange: (val: number) => void;
  minCores: number;
  onMinCoresChange: (cores: number) => void;
  minVram: number;
  onMinVramChange: (vram: number) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterSidebar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  maxTdp,
  onMaxTdpChange,
  minCores,
  onMinCoresChange,
  minVram,
  onMinVramChange,
  onReset,
  totalCount,
  filteredCount,
}: FilterSidebarProps) {
  return (
    <aside
      className="bg-surface border border-border rounded-lg p-4 grid gap-4 sm:grid-cols-2 lg:flex lg:flex-col lg:self-start lg:p-5 lg:gap-5"
      aria-label="Catalog filters"
    >
      <div className="col-span-full flex items-baseline justify-between border-b border-border pb-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground m-0">
          <Layers size={18} aria-hidden="true" /> Filters
        </h2>
        <span className="text-xs text-muted">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>

      {/* Search Input */}
      <div className="col-span-full flex flex-col gap-1.5">
        <label
          htmlFor="catalog-search"
          className="text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Search silicon
        </label>
        <div className="relative flex items-center">
          <Search
            size={16}
            className="absolute left-3 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            id="catalog-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. 9950X, Zenith, 24GB..."
            className="w-full bg-background border border-border rounded-md text-foreground pt-2 pr-3 pb-2 pl-9 text-sm outline-none transition duration-200 motion-reduce:transition-none focus:border-primary"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-wide text-muted"
          id="category-filter-label"
        >
          Category
        </span>
        <div
          className="flex flex-col gap-1.5"
          role="group"
          aria-labelledby="category-filter-label"
        >
          <Button
            variant="ghost"
            type="button"
            className={cn(
              `flex items-center gap-2 w-full py-2 px-3 rounded-sm bg-transparent border border-border text-muted text-sm font-medium cursor-pointer text-left transition duration-200 motion-reduce:transition-none hover:bg-raised hover:text-foreground${selectedCategory === 'all' ? ' bg-surface border-border text-primary font-bold' : ''}`,
            )}
            onClick={() => onCategoryChange('all')}
            aria-pressed={selectedCategory === 'all'}
          >
            All Silicon
          </Button>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              `flex items-center gap-2 w-full py-2 px-3 rounded-sm bg-transparent border border-border text-muted text-sm font-medium cursor-pointer text-left transition duration-200 motion-reduce:transition-none hover:bg-raised hover:text-foreground${selectedCategory === 'cpu' ? ' bg-surface border-border text-primary font-bold' : ''}`,
            )}
            onClick={() => onCategoryChange('cpu')}
            aria-pressed={selectedCategory === 'cpu'}
          >
            <Cpu size={14} aria-hidden="true" /> CPUs
          </Button>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              `flex items-center gap-2 w-full py-2 px-3 rounded-sm bg-transparent border border-border text-muted text-sm font-medium cursor-pointer text-left transition duration-200 motion-reduce:transition-none hover:bg-raised hover:text-foreground${selectedCategory === 'gpu' ? ' bg-surface border-border text-primary font-bold' : ''}`,
            )}
            onClick={() => onCategoryChange('gpu')}
            aria-pressed={selectedCategory === 'gpu'}
          >
            <Gauge size={14} aria-hidden="true" /> GPUs
          </Button>
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label
            htmlFor="price-range"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Max Price
          </label>
          <span className="text-sm font-bold text-primary tabular-nums">
            ${maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          id="price-range"
          type="range"
          min={250}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>$250</span>
          <span>$1,000</span>
        </div>
      </div>

      {/* Max TDP Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label
            htmlFor="tdp-range"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Max TDP (Power Draw)
          </label>
          <span className="text-sm font-bold text-primary tabular-nums">
            {maxTdp}W
          </span>
        </div>
        <input
          id="tdp-range"
          type="range"
          min={65}
          max={400}
          step={5}
          value={maxTdp}
          onChange={(e) => onMaxTdpChange(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>65W</span>
          <span>400W</span>
        </div>
      </div>

      {/* Cores Facet (CPU or All) */}
      {selectedCategory !== 'gpu' && (
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide text-muted"
            id="cores-filter-label"
          >
            CPU Physical Cores
          </span>
          <div
            className="flex flex-col gap-1.5"
            role="group"
            aria-labelledby="cores-filter-label"
          >
            {[0, 8, 16].map((cores) => (
              <Button
                variant="ghost"
                key={cores}
                type="button"
                className={cn(
                  `flex items-center gap-2 w-full py-2 px-3 rounded-sm bg-transparent border border-border text-muted text-sm font-medium cursor-pointer text-left transition duration-200 motion-reduce:transition-none hover:bg-raised hover:text-foreground${minCores === cores ? ' bg-surface border-border text-primary font-bold' : ''}`,
                )}
                onClick={() => onMinCoresChange(cores)}
                aria-pressed={minCores === cores}
              >
                {cores === 0 ? 'Any Cores' : `${cores}+ Cores`}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* VRAM Facet (GPU or All) */}
      {selectedCategory !== 'cpu' && (
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-semibold uppercase tracking-wide text-muted"
            id="vram-filter-label"
          >
            GPU Video Memory (VRAM)
          </span>
          <div
            className="flex flex-col gap-1.5"
            role="group"
            aria-labelledby="vram-filter-label"
          >
            {[0, 12, 16, 24].map((vram) => (
              <Button
                variant="ghost"
                key={vram}
                type="button"
                className={cn(
                  `flex items-center gap-2 w-full py-2 px-3 rounded-sm bg-transparent border border-border text-muted text-sm font-medium cursor-pointer text-left transition duration-200 motion-reduce:transition-none hover:bg-raised hover:text-foreground${minVram === vram ? ' bg-surface border-border text-primary font-bold' : ''}`,
                )}
                onClick={() => onMinVramChange(vram)}
                aria-pressed={minVram === vram}
              >
                {vram === 0 ? 'Any VRAM' : `${vram}GB+`}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        type="button"
        className="w-full"
        onClick={onReset}
        size="lg"
      >
        <RotateCcw size={14} aria-hidden="true" /> Reset all filters
      </Button>
    </aside>
  );
}
