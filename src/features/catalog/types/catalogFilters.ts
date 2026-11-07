export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'clock-desc'
  | 'name-asc'
  | 'name-desc'
  | 'compute-desc';

export function isSortOption(value: string): value is SortOption {
  return (
    value === 'featured' ||
    value === 'price-asc' ||
    value === 'price-desc' ||
    value === 'clock-desc' ||
    value === 'name-asc' ||
    value === 'name-desc' ||
    value === 'compute-desc'
  );
}
