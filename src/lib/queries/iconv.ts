// src/lib/queries/iconv.ts
import { queryOptions } from '@tanstack/react-query'
import { ensureIconvLoaded } from '@/lib/encoding'

export const iconvReadyQueryOptions = queryOptions({
  queryKey: ['iconv', 'ready'] as const,
  queryFn: ensureIconvLoaded,
  // No need to refetch; it's a one-time module preload
  staleTime: Infinity,
  gcTime: Infinity,
})

