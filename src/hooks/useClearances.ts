import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { clearancesApi } from '@/api';
import type { Clearance } from '@/types';

export function useClearancesCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['clearances', 'cursor', params],
    queryFn: ({ pageParam }) => clearancesApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useClearance(id: string) {
  return useQuery({
    queryKey: ['clearance', id],
    queryFn: () => clearancesApi.get(id),
    enabled: !!id,
  });
}
