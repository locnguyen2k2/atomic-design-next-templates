import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { departmentsApi } from '@/api';
import type { Department } from '@/types';

export function useDepartmentsCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['departments', 'cursor', params],
    queryFn: ({ pageParam }) => departmentsApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentsApi.get(id),
    enabled: !!id,
  });
}
