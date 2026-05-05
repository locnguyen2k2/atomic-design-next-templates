import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '@/api';
import type { Subscription } from '@/types';

export function useSubscriptionsCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['subscriptions', 'cursor', params],
    queryFn: ({ pageParam }) => subscriptionsApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionsApi.get(id),
    enabled: !!id,
  });
}
