import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { SortBar, isSortOption, type SortOption } from './components/SortBar';
import './catalog.css';

function parseCategory(val: string | null): 'all' | 'cpu' | 'gpu' {
  if (val === 'cpu' || val === 'gpu') return val;
  return 'all';
}

function parseSortOption(val: string | null): SortOption {
  if (val && isSortOption(val)) return val;
  return 'featured';
}

export function CatalogPage() {
  const { products, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL search parameters on mount
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('search') ?? '',
  );
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'cpu' | 'gpu'
  >(() => parseCategory(searchParams.get('category')));
  const [maxPrice, setMaxPrice] = useState(() => {
    const param = searchParams.get('maxPrice');
    return param ? Number(param) : 1000;
  });
  const [maxTdp, setMaxTdp] = useState(() => {
    const param = searchParams.get('maxTdp');
    return param ? Number(param) : 400;
  });
  const [minCores, setMinCores] = useState(() => {
    const param = searchParams.get('minCores');
    return param ? Number(param) : 0;
  });
  const [minVram, setMinVram] = useState(() => {
    const param = searchParams.get('minVram');
    return param ? Number(param) : 0;
  });
  const [sortOption, setSortOption] = useState<SortOption>(() =>
    parseSortOption(searchParams.get('sort')),
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Synchronize state changes to URL search params
  useEffect(() => {
    const next = new URLSearchParams();
    if (selectedCategory !== 'all') next.set('category', selectedCategory);
    if (searchQuery.trim()) next.set('search', searchQuery.trim());
    if (maxPrice < 1000) next.set('maxPrice', String(maxPrice));
    if (maxTdp < 400) next.set('maxTdp', String(maxTdp));
    if (minCores > 0) next.set('minCores', String(minCores));
    if (minVram > 0) next.set('minVram', String(minVram));
    if (sortOption !== 'featured') next.set('sort', sortOption);
    setSearchParams(next, { replace: true });
  }, [
    selectedCategory,
    searchQuery,
    maxPrice,
    maxTdp,
    minCores,
    minVram,
    sortOption,
    setSearchParams,
  ]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(1000);
    setMaxTdp(400);
    setMinCores(0);
    setMinVram(0);
    setSortOption('featured');
  };

  // Memoized filter and sort pipeline
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.series.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.specs.cores && p.specs.cores.includes(q)) ||
          (p.specs.vram && p.specs.vram.toLowerCase().includes(q)),
      );
    }

    // 3. Price Filter
    result = result.filter((p) => p.price <= maxPrice);

    // 4. TDP Filter
    result = result.filter((p) => p.specs.tdp <= maxTdp);

    // 5. Cores Facet Filter (for CPUs)
    if (minCores > 0) {
      result = result.filter((p) => {
        if (p.category !== 'cpu') return true;
        return parseInt(p.specs.cores || '0', 10) >= minCores;
      });
    }

    // 6. VRAM Facet Filter (for GPUs)
    if (minVram > 0) {
      result = result.filter((p) => {
        if (p.category !== 'gpu') return true;
        return parseInt(p.specs.vram || '0', 10) >= minVram;
      });
    }

    // 7. Sorting
    const sorted = [...result];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'clock-desc':
        sorted.sort((a, b) => {
          const aClock = parseFloat(a.specs.boostClock) || 0;
          const bClock = parseFloat(b.specs.boostClock) || 0;
          return bClock - aClock;
        });
        break;
      case 'compute-desc':
        sorted.sort((a, b) => (b.specs.tflops ?? 0) - (a.specs.tflops ?? 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [
    products,
    selectedCategory,
    searchQuery,
    maxPrice,
    maxTdp,
    minCores,
    minVram,
    sortOption,
  ]);

  return (
    <main className="catalog-page page-width">
      <header className="catalog-header">
        <p className="eyebrow">Silicon Storefront</p>
        <h1>Engineered for absolute compute.</h1>
        <p>
          Explore precision-crafted desktop microprocessors and graphics
          engines built for extreme gaming, 3D rendering, and heavy AI workloads.
        </p>
      </header>

      {error && (
        <div className="home-page__error" role="status">
          <p>Failed to load silicon catalog: {error}</p>
          <button
            type="button"
            className="button button--secondary button--sm"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="catalog-empty" role="status">
          <p className="eyebrow">Loading silicon matrix...</p>
          <h3>Synchronizing hardware specifications</h3>
        </div>
      ) : (
        <div className="catalog-layout">
          <FilterSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            maxTdp={maxTdp}
            onMaxTdpChange={setMaxTdp}
            minCores={minCores}
            onMinCoresChange={setMinCores}
            minVram={minVram}
            onMinVramChange={setMinVram}
            onReset={handleReset}
            totalCount={products.length}
            filteredCount={filteredProducts.length}
          />

          <section className="catalog-content" aria-label="Available products">
            <SortBar
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              itemCount={filteredProducts.length}
            />

            <ProductGrid
              products={filteredProducts}
              viewMode={viewMode}
              totalCount={products.length}
            />
          </section>
        </div>
      )}
    </main>
  );
}
