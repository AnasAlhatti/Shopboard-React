import { QueryClient } from '@tanstack/react-query';

// Server data has one cache. Cart and comparison state remain in their providers.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: false, refetchOnWindowFocus: false },
  },
});
