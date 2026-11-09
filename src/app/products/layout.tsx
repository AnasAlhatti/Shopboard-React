import { Suspense, type ReactNode } from 'react';
import { CollectionTabs } from '../../features/catalog/components/CollectionTabs';
export interface ProductsLayoutProps {
  children: ReactNode;
}
export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <>
      <div className="mx-auto w-shell max-w-page pt-8">
        <Suspense fallback={<p>Product collections</p>}>
          <CollectionTabs />
        </Suspense>
      </div>
      {children}
    </>
  );
}
