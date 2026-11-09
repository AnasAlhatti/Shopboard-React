'use client';
import { usePathname, useSearchParams } from 'next/navigation';

export function useProductFilters() {
  const current = useSearchParams();
  const pathname = usePathname();
  function setParams(
    update:
      | URLSearchParams
      | Record<string, string>
      | ((value: URLSearchParams) => URLSearchParams),
  ) {
    const params =
      typeof update === 'function'
        ? update(new URLSearchParams(window.location.search))
        : new URLSearchParams(update);
    if (current.get('collection') === 'unique')
      params.set('collection', 'unique');
    window.history.replaceState(
      null,
      '',
      `${pathname}${params.size ? `?${params}` : ''}`,
    );
  }
  const filters: readonly [typeof current, typeof setParams] = [
    current,
    setParams,
  ];
  return filters;
}
