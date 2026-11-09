import { useState, type ReactNode } from 'react';
import { SWRConfig } from 'swr';

export interface NextTestRouterProps {
  children: ReactNode;
  initialEntries?: string[];
}
export function NextTestRouter({
  children,
  initialEntries,
}: NextTestRouterProps) {
  const [cache] = useState(() => {
    if (initialEntries) {
      window.history.replaceState(null, '', initialEntries[0]);
      for (const href of initialEntries.slice(1))
        window.history.pushState(null, '', href);
    }
    return new Map();
  });
  return (
    <SWRConfig
      value={{
        provider: () => cache,
        shouldRetryOnError: false,
        dedupingInterval: 0,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
