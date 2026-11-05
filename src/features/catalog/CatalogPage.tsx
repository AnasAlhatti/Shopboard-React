import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { SortBar, type SortOption } from './components/SortBar';
import './catalog.css';

export function CatalogPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL search parameters on mount
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('search') ?? '',
  );
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'cpu' | 'gpu'
  >(() => (searchParams.get('category') as 'all' | 'cpu' | 'gpu') ?? 'all');
  const [maxPrice, setMaxPrice] = useState(() => {
    const param = searchParams.get('maxPrice');
    return param ? Number(param) : 1000;
  });
  const [maxTdp, setMaxTdp] = useState(() => {
    const param = searchParams.get('maxTdp');
    return param ? Number(param) : 400;
  });
  const [sortOption, setSortOption] = useState<SortOption>(
    () => (searchParams.get('sort') as SortOption) ?? 'featured',
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Synchronize state changes to URL search params
  useEffect(() => {
    const next = new URLSearchParams();
    if (selectedCategory !== 'all') next.set('category', selectedCategory);
    if (searchQuery.trim()) next.set('search', searchQuery.trim());
    if (maxPrice < 1000) next.set('maxPrice', String(maxPrice));
    if (maxTdp < 400) next.set('maxTdp', String(maxTdp));
    if (sortOption !== 'featured') next.set('sort', sortOption);
    setSearchParams(next, { replace: true });
  }, [
    selectedCategory,
    searchQuery,
    maxPrice,
    maxTdp,
    sortOption,
    setSearchParams,
  ]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(1000);
    setMaxTdp(400);
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

    // 5. Sorting
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
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, maxPrice, maxTdp, sortOption]);

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
          Failed to load silicon catalog: {error}
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

            <ProductGrid products={filteredProducts} viewMode={viewMode} />
          </section>
        </div>
      )}
    </main>
  );
}
