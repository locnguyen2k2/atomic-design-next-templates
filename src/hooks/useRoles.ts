import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { rolesApi } from '@/api';
import type { Role, ListParams } from '@/types';
import { useAppStore } from '@/stores';

export function useRoles(params: ListParams = {}) {
  const { currentOrg } = useAppStore();
  return useQuery({
    queryKey: ['roles', params, currentOrg],
    queryFn: () => rolesApi.list(params),
  });
}

export function useRolesCursor(params: { limit?: number; keyword?: string; organizationId?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ['roles', 'cursor', params],
    queryFn: ({ pageParam }) => rolesApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => rolesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      rolesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
