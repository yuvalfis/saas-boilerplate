'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { userApi } from '@/lib/api/endpoints/user';

export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useAuth();
  
  const {
    data: fullProfile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userApi.getCurrentUser,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });

  return {
    user: fullProfile?.user || null,
    organization: fullProfile?.organization || null,
    fullProfile,
    isLoading: !isLoaded || isLoading,
    error,
    refetch,
  };
}