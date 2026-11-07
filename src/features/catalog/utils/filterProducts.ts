import type { Product } from '../../../shared/types/product';
import type { SortOption } from '../types/catalogFilters';

interface ProductFilters {
  searchQuery: string;
  selectedCategory: 'all' | 'cpu' | 'gpu';
  maxPrice: number;
  maxTdp: number;
  minCores: number;
  minVram: number;
  sortOption: SortOption;
}

export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (
      filters.selectedCategory !== 'all' &&
      product.category !== filters.selectedCategory
    )
      return false;
    if (product.price > filters.maxPrice || product.specs.tdp > filters.maxTdp)
      return false;
    if (
      product.category === 'cpu' &&
      filters.minCores > 0 &&
      !(Number.parseInt(product.specs.cores ?? '0', 10) >= filters.minCores)
    )
      return false;
    if (
      product.category === 'gpu' &&
      filters.minVram > 0 &&
      !(Number.parseInt(product.specs.vram ?? '0', 10) >= filters.minVram)
    )
      return false;
    return [
      product.name,
      product.series,
      product.tagline,
      product.description,
      product.specs.cores ?? '',
      product.specs.vram ?? '',
    ].some((value) => value.toLowerCase().includes(query));
  });
  switch (filters.sortOption) {
    case 'price-asc':
      return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return filtered.sort((a, b) => b.price - a.price);
    case 'clock-desc':
      return filtered.sort(
        (a, b) =>
          (Number.parseFloat(b.specs.boostClock) || 0) -
          (Number.parseFloat(a.specs.boostClock) || 0),
      );
    case 'compute-desc':
      return filtered.sort(
        (a, b) => (b.specs.tflops ?? 0) - (a.specs.tflops ?? 0),
      );
    case 'name-asc':
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return filtered.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return filtered;
  }
}
