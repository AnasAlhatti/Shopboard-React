'use client';
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
      <RefreshNotice error={error} onRefresh={refresh} />
      <div className="grid gap-4 my-8 md:grid-cols-2">
        <div>
          <label htmlFor="unique-search" className="block mb-2">
            Search unique items
          </label>
          <Input
            className="w-full min-h-11 p-3 border border-border rounded-md bg-carbon text-foreground text-base focus-visible:focus:outline-2 focus-visible:focus:outline-primary focus-visible:focus:outline-offset-2 aria-invalid:border-primary"
            id="unique-search"
            type="search"
            value={search}
            onChange={(event) => update('search', event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="unique-category" className="block mb-2">
            Category
          </label>
          <select
            className="w-full min-h-11 p-3 border border-border rounded-md bg-carbon text-foreground text-base focus-visible:focus:outline-2 focus-visible:focus:outline-primary focus-visible:focus:outline-offset-2 aria-invalid:border-primary"
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
          </select>
        </div>
      </div>
      <p role="status">
        {shown.length} {shown.length === 1 ? 'item' : 'items'} available
      </p>
      {shown.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
