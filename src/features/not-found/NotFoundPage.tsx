import Link from 'next/link';
import { Button } from '../../components/ui/Button';
export function NotFoundPage() {
  return (
    <main className="mx-auto w-shell max-w-page py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="text-4xl">Page not found</h1>
      <p>This page or product does not exist.</p>
      <Button asChild>
        <Link href="/products">Back to products</Link>
      </Button>
    </main>
  );
}
