'use client';
import { useState } from 'react';
import { RefreshNotice } from '../../../components/ui/RefreshNotice';
import { useProductFilters } from '../../../shared/products/hooks/useProductFilters';
import { useProducts } from '../../../shared/products/hooks/useProducts';
import { isSortOption } from '../types/catalogFilters';
import { filterProducts } from '../utils/filterProducts';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { SortBar } from './SortBar';

function numberParam(value: string | null, fallback: number) {
  if (value === null) return fallback;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function CatalogBrowser() {
  const { products, error, refresh } = useProducts();
  const [params, setParams] = useProductFilters();
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
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value === defaultValue) next.delete(name);
      else next.set(name, value);
      return next;
    });
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
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-sidebar lg:gap-12">
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
        onReset={() => setParams({})}
        totalCount={products.length}
        filteredCount={filtered.length}
      />
      <section className="catalog-content" aria-label="Available products">
        <RefreshNotice error={error} onRefresh={refresh} />
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
