import { useSearchParams } from 'react-router-dom';
import { useCourseProducts } from '../../../shared/products/hooks/useCourseProducts';
import { UniqueItemCard } from './UniqueItemCard';

export function UniqueItemsList() {
  const products = useCourseProducts();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const category = params.get('category') ?? '';
  const categories = [...new Set(products.map((product) => product.category))];
  const shown = products.filter(
    (product) =>
      (!category || product.category === category) &&
      product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  function update(name: string, value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(name, value);
        else next.delete(name);
        return next;
      },
      { replace: true },
    );
  }
  if (products.length === 0)
    return (
      <section className="async-state" role="status">
        <h2>No unique items available</h2>
        <p>Check back soon for the next collection.</p>
      </section>
    );
  return (
    <>
      <div className="unique-items-filters">
        <div>
          <label htmlFor="unique-search">Search unique items</label>
          <input
            className="ui-input"
            id="unique-search"
            type="search"
            value={search}
            onChange={(event) => update('search', event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="unique-category">Category</label>
          <select
            className="ui-input"
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
        <div className="unique-items-grid">
          {shown.map((product) => (
            <UniqueItemCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <section className="async-state">
          <h2>No matching unique items</h2>
          <p>Try a different search or category.</p>
          <button
            type="button"
            className="button button--quiet"
            onClick={() => setParams({})}
          >
            Reset filters
          </button>
        </section>
      )}
    </>
  );
}
