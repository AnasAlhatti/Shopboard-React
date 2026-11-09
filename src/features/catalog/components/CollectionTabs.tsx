'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getProductCollection } from '../../../shared/products/utils/getProductCollection';
import { cn } from '../../../lib/utils';
export function CollectionTabs() {
  const params = useSearchParams();
  const unique =
    getProductCollection(usePathname(), params.get('collection')) === 'unique';
  function href(collection: string) {
    const next = new URLSearchParams();
    if (collection === 'unique') next.set('collection', collection);
    const search = params.get('search');
    if (search) next.set('search', search);
    return `/products${next.size ? `?${next}` : ''}`;
  }
  return (
    <nav
      aria-label="Product collections"
      className="flex gap-2 border-b border-border pb-4"
    >
      <Link
        href={href('hardware')}
        aria-current={!unique ? 'page' : undefined}
        className={cn(
          `rounded-lg px-4 py-3 font-semibold ${!unique ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted hover:text-foreground'}`,
        )}
      >
        Hardware
      </Link>
      <Link
        href={href('unique')}
        aria-current={unique ? 'page' : undefined}
        className={cn(
          `rounded-lg px-4 py-3 font-semibold ${unique ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted hover:text-foreground'}`,
        )}
      >
        Unique Items
      </Link>
    </nav>
  );
}
