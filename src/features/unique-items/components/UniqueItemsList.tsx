'use client';
import { NativeSelect } from '@/components/ui/NativeSelect';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RefreshNotice } from '../../../components/ui/RefreshNotice';
import { useCourseProducts } from '../../../shared/products/hooks/useCourseProducts';
import { useProductFilters } from '../../../shared/products/hooks/useProductFilters';
import { UniqueItemCard } from './UniqueItemCard';

export function UniqueItemsList() {
  const { products, error, refresh } = useCourseProducts();
  const [params, setParams] = useProductFilters();
  const search = params.get('search') ?? '';
  const category = params.get('category') ?? '';
  const categories = [...new Set(products.map((product) => product.category))];
  const shown = products.filter(
    (product) =>
      (!category || product.category === category) &&
      product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  function update(name: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(name, value);
      else next.delete(name);
      return next;
    });
  }
  if (products.length === 0)
    return (
      <section className="p-8 text-muted" role="status">
        <h2 className="text-foreground">No unique items available</h2>
        <p>Check back soon for the next collection.</p>
        <RefreshNotice error={error} onRefresh={refresh} />
      </section>
    );
  return (
    <>
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="unique-search"
            className="block mb-2 text-sm font-medium"
          >
            Search unique items
          </label>
          <Input
            className="p-3"
            id="unique-search"
            type="search"
            value={search}
            onChange={(event) => update('search', event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="unique-category"
            className="block mb-2 text-sm font-medium"
          >
            Category
          </label>
          <NativeSelect
            className="p-3"
            id="unique-category"
            value={category}
            onChange={(event) => update('category', event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm mb-0">
          {shown.length} {shown.length === 1 ? 'item' : 'items'} available
        </p>
        <RefreshNotice error={error} onRefresh={refresh} />
      </div>
      {shown.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((product) => (
            <UniqueItemCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <section className="p-8 text-muted">
          <h2 className="text-foreground">No matching unique items</h2>
          <p>Try a different search or category.</p>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setParams({})}
            size="lg"
          >
            Reset filters
          </Button>
        </section>
      )}
    </>
  );
}
