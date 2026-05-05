import { useInfiniteQuery } from '@tanstack/react-query';
import { policiesApi } from '@/api';

export function useResourceTypesCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['resourceTypes', 'cursor', params],
    queryFn: ({ pageParam }) => policiesApi.listResourceTypesCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => undefined,
  });
}
