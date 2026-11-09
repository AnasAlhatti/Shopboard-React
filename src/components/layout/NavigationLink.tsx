'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { getProductCollection } from '../../shared/products/utils/getProductCollection';
import { cn } from '../../lib/utils';
export interface NavigationLinkProps extends Omit<
  ComponentProps<typeof Link>,
  'className'
> {
  className?: string | ((state: { isActive: boolean }) => string);
  end?: boolean;
}
export function NavigationLink({
  href,
  className,
  end,
  ...props
}: NavigationLinkProps) {
  const path = usePathname();
  const params = useSearchParams();
  const url = String(href).split('?')[0];
  const isUnique = String(href).includes('collection=unique');
  const isActive =
    (end ? path === url : path === url || path.startsWith(`${url}/`)) &&
    (url !== '/products' ||
      isUnique ===
        (getProductCollection(path, params.get('collection')) === 'unique'));
  return (
    <Link
      {...props}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        typeof className === 'function' ? className({ isActive }) : className,
      )}
    />
  );
}
