import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { filterProducts } from '../utils/filterProducts';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { SortBar } from './SortBar';
import { isSortOption } from '../types/catalogFilters';

function numberParam(value: string | null, fallback: number) {
  if (value === null) return fallback;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function CatalogBrowser() {
  const { products } = useProducts();
  const [params, setParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const category = params.get('category');
  const selectedCategory =
    category === 'cpu' || category === 'gpu' ? category : 'all';
  const searchQuery = params.get('search') ?? '';
  const maxPrice = numberParam(params.get('maxPrice'), 1000);
  const maxTdp = numberParam(params.get('maxTdp'), 400);
  const minCores = numberParam(params.get('minCores'), 0);
  const minVram = numberParam(params.get('minVram'), 0);
  const sort = params.get('sort');
  const sortOption = sort && isSortOption(sort) ? sort : 'featured';
  function updateFilter(name: string, value: string, defaultValue = '') {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === defaultValue) next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true },
    );
  }
  const filtered = filterProducts(products, {
    searchQuery,
    selectedCategory,
    maxPrice,
    maxTdp,
    minCores,
    minVram,
    sortOption,
  });
  return (
    <div className="catalog-layout">
      <FilterSidebar
        searchQuery={searchQuery}
        onSearchChange={(value) => updateFilter('search', value)}
        selectedCategory={selectedCategory}
        onCategoryChange={(value) => updateFilter('category', value, 'all')}
        maxPrice={maxPrice}
        onMaxPriceChange={(value) =>
          updateFilter('maxPrice', String(value), '1000')
        }
        maxTdp={maxTdp}
        onMaxTdpChange={(value) => updateFilter('maxTdp', String(value), '400')}
        minCores={minCores}
        onMinCoresChange={(value) =>
          updateFilter('minCores', String(value), '0')
        }
        minVram={minVram}
        onMinVramChange={(value) => updateFilter('minVram', String(value), '0')}
        onReset={() => setParams({}, { replace: true })}
        totalCount={products.length}
        filteredCount={filtered.length}
      />
      <section className="catalog-content" aria-label="Available products">
        <SortBar
          sortOption={sortOption}
          onSortChange={(value) => updateFilter('sort', value, 'featured')}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          itemCount={filtered.length}
        />
        <ProductGrid
          products={filtered}
          viewMode={viewMode}
          totalCount={products.length}
        />
      </section>
    </div>
  );
}
