import { Cpu, Gauge, Layers, RotateCcw, Search } from 'lucide-react';

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
    <aside className="catalog-filters" aria-label="Catalog filters">
      <div className="catalog-filters__header">
        <h2 className="catalog-filters__title">
          <Layers size={18} aria-hidden="true" /> Filters
        </h2>
        <span className="catalog-filters__count">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>

      {/* Search Input */}
      <div className="filter-group">
        <label htmlFor="catalog-search" className="filter-label">
          Search silicon
        </label>
        <div className="filter-search-wrap">
          <Search size={16} className="filter-search-icon" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. 9950X, Zenith, 24GB..."
            className="filter-search-input"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <span className="filter-label" id="category-filter-label">
          Category
        </span>
        <div
          className="category-pills"
          role="group"
          aria-labelledby="category-filter-label"
        >
          <button
            type="button"
            className={`pill-button${selectedCategory === 'all' ? ' is-active' : ''}`}
            onClick={() => onCategoryChange('all')}
            aria-pressed={selectedCategory === 'all'}
          >
            All Silicon
          </button>
          <button
            type="button"
            className={`pill-button${selectedCategory === 'cpu' ? ' is-active' : ''}`}
            onClick={() => onCategoryChange('cpu')}
            aria-pressed={selectedCategory === 'cpu'}
          >
            <Cpu size={14} aria-hidden="true" /> CPUs
          </button>
          <button
            type="button"
            className={`pill-button${selectedCategory === 'gpu' ? ' is-active' : ''}`}
            onClick={() => onCategoryChange('gpu')}
            aria-pressed={selectedCategory === 'gpu'}
          >
            <Gauge size={14} aria-hidden="true" /> GPUs
          </button>
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="filter-group">
        <div className="filter-range-header">
          <label htmlFor="price-range" className="filter-label">
            Max Price
          </label>
          <span className="filter-range-val">${maxPrice.toLocaleString()}</span>
        </div>
        <input
          id="price-range"
          type="range"
          min={250}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="filter-slider"
        />
        <div className="filter-range-hints">
          <span>$250</span>
          <span>$1,000</span>
        </div>
      </div>

      {/* Max TDP Slider */}
      <div className="filter-group">
        <div className="filter-range-header">
          <label htmlFor="tdp-range" className="filter-label">
            Max TDP (Power Draw)
          </label>
          <span className="filter-range-val">{maxTdp}W</span>
        </div>
        <input
          id="tdp-range"
          type="range"
          min={65}
          max={400}
          step={25}
          value={maxTdp}
          onChange={(e) => onMaxTdpChange(Number(e.target.value))}
          className="filter-slider"
        />
        <div className="filter-range-hints">
          <span>65W</span>
          <span>400W</span>
        </div>
      </div>

      {/* Cores Facet (CPU or All) */}
      {selectedCategory !== 'gpu' && (
        <div className="filter-group">
          <span className="filter-label" id="cores-filter-label">
            CPU Physical Cores
          </span>
          <div
            className="category-pills"
            role="group"
            aria-labelledby="cores-filter-label"
          >
            {[0, 8, 16].map((cores) => (
              <button
                key={cores}
                type="button"
                className={`pill-button${minCores === cores ? ' is-active' : ''}`}
                onClick={() => onMinCoresChange(cores)}
                aria-pressed={minCores === cores}
              >
                {cores === 0 ? 'Any Cores' : `${cores}+ Cores`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VRAM Facet (GPU or All) */}
      {selectedCategory !== 'cpu' && (
        <div className="filter-group">
          <span className="filter-label" id="vram-filter-label">
            GPU Video Memory (VRAM)
          </span>
          <div
            className="category-pills"
            role="group"
            aria-labelledby="vram-filter-label"
          >
            {[0, 12, 16, 24].map((vram) => (
              <button
                key={vram}
                type="button"
                className={`pill-button${minVram === vram ? ' is-active' : ''}`}
                onClick={() => onMinVramChange(vram)}
                aria-pressed={minVram === vram}
              >
                {vram === 0 ? 'Any VRAM' : `${vram}GB+`}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="button button--quiet button--full"
        onClick={onReset}
      >
        <RotateCcw size={14} aria-hidden="true" /> Reset all filters
      </button>
    </aside>
  );
}
