'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupApiInterceptors } from '@/lib/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Setup API interceptors with Clerk token
    setupApiInterceptors(async () => {
      try {
        // Try to get token with default template first
        const token = await getToken();
        return token;
      } catch (error) {
        // Token fetch failed silently
        return null;
      }
    });
  }, [getToken]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}