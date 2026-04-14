import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api';
import type { Organization, ListParams } from '@/types';

export function useOrganizationsCursor(params: { limit?: number; keyword?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['organizations', 'cursor', params],
    queryFn: ({ pageParam }) => organizationsApi.joinedCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useOrganizations(params: ListParams = {}) {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => organizationsApi.joinedPagination(params),
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) =>
      organizationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', id] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}
