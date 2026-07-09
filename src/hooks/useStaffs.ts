import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { staffsApi } from '@/api';
import type { Staff, ListParams } from '@/types';
import { useAppStore } from '@/stores';

export function useStaffs(params: ListParams = {}) {
  const { currentOrg } = useAppStore();
  return useQuery({
    queryKey: ['staffs', params, currentOrg],
    queryFn: () => staffsApi.list(params),
  });
}

export function useStaffsCursor(params: { limit?: number; keyword?: string; organizationId?: string } = {}) {
  const { currentOrg } = useAppStore();
  const orgId = params.organizationId || currentOrg;
  return useInfiniteQuery({
    queryKey: ['staffs', 'cursor', params, orgId],
    queryFn: ({ pageParam }) => staffsApi.listCursor({ ...params, cursor: pageParam, organization_id: orgId }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
    enabled: !!orgId,
  });
}

export function useStaff(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffsApi.get(id),
    enabled: !!id,
  });
}

export function useCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
  });
}

export function useUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) =>
      staffsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      queryClient.invalidateQueries({ queryKey: ['staff', id] });
    },
  });
}

export function useDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
  });
}
