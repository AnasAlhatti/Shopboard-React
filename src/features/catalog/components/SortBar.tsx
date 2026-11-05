import { LayoutGrid, List } from 'lucide-react';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'clock-desc'
  | 'name-asc'
  | 'name-desc'
  | 'compute-desc';

interface SortBarProps {
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  itemCount: number;
}

export function SortBar({
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  itemCount,
}: SortBarProps) {
  return (
    <div className="catalog-sortbar">
      <p className="catalog-sortbar__count">
        <strong>{itemCount}</strong> {itemCount === 1 ? 'silicon product' : 'silicon products'} available
      </p>

      <div className="catalog-sortbar__controls">
        <div className="sort-select-wrap">
          <label htmlFor="catalog-sort" className="sort-select-label">
            Sort by
          </label>
          <select
            id="catalog-sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="featured">Default (Featured)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="clock-desc">Highest Clock Speed</option>
            <option value="compute-desc">Compute Throughput (TFLOPs)</option>
          </select>
        </div>

        <div className="view-mode-toggle" role="group" aria-label="Layout view mode">
          <button
            type="button"
            className={`view-mode-btn${viewMode === 'grid' ? ' is-active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid layout"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`view-mode-btn${viewMode === 'list' ? ' is-active' : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-label="List layout"
            aria-pressed={viewMode === 'list'}
          >
            <List size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
