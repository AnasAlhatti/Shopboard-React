import { LayoutGrid, List } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

import { isSortOption, type SortOption } from '../types/catalogFilters';

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
    <div className="flex flex-col gap-2 bg-surface border border-border rounded-md py-2.5 px-4 mb-6 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted m-0">
        <strong className="text-foreground">{itemCount}</strong>{' '}
        {itemCount === 1 ? 'silicon product' : 'silicon products'} available
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor="catalog-sort" className="shrink-0 text-xs text-muted">
            Sort by
          </label>
          <select
            id="catalog-sort"
            value={sortOption}
            onChange={(e) => {
              if (isSortOption(e.target.value)) {
                onSortChange(e.target.value);
              }
            }}
            className="w-full min-w-0 bg-background border border-border rounded-sm text-foreground py-1.5 px-2.5 text-sm"
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

        <div
          className="flex shrink-0 border border-border rounded-sm overflow-hidden"
          role="group"
          aria-label="Layout view mode"
        >
          <Button
            variant="ghost"
            type="button"
            className={cn(
              `bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center${viewMode === 'grid' ? ' bg-raised text-primary' : ''}`,
            )}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid layout"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              `bg-transparent border-0 text-muted py-1.5 px-2 cursor-pointer flex items-center${viewMode === 'list' ? ' bg-raised text-primary' : ''}`,
            )}
            onClick={() => onViewModeChange('list')}
            aria-label="List layout"
            aria-pressed={viewMode === 'list'}
          >
            <List size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
