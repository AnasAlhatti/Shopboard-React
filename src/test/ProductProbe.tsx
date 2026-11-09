import { Button } from '../components/ui/Button';
import { useProducts } from '../shared/products/hooks/useProducts';
export function ProductProbe() {
  const { products, error, refresh } = useProducts();
  return (
    <section>
      <p>{products.map((product) => product.name).join(', ')}</p>
      {Boolean(error) && (
        <p role="status">Refresh failed; existing results remain.</p>
      )}
      <Button
        onClick={() => {
          void refresh().catch(() => {});
        }}
      >
        Refresh probe
      </Button>
    </section>
  );
}
