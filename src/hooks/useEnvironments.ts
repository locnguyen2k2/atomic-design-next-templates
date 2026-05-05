import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { environmentsApi } from '@/api';
import type { Environment } from '@/types';

export function useEnvironmentsCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['environments', 'cursor', params],
    queryFn: ({ pageParam }) => environmentsApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useEnvironment(id: string) {
  return useQuery({
    queryKey: ['environment', id],
    queryFn: () => environmentsApi.get(id),
    enabled: !!id,
  });
}
