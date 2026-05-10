import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { featuresApi } from '@/api';
import type { Feature, ListParams } from '@/types';
import { useAppStore } from '@/stores';

export function useFeatures(params: ListParams = {}) {
  const { currentOrg, currentProject } = useAppStore();
  return useQuery({
    queryKey: ['features', params],
    queryFn: () => featuresApi.list(params, currentProject, currentOrg),
  });
}

export function useFeaturesCursor(params: { limit?: number; keyword?: string; organizationId?: string; projectId?: string } = {}) {
  const { currentOrg, currentProject } = useAppStore();
  const orgId = params.organizationId || currentOrg;
  const projId = params.projectId || currentProject;
  return useInfiniteQuery({
    queryKey: ['features', 'cursor', params, orgId, projId],
    queryFn: ({ pageParam }) => featuresApi.listCursor({ ...params, cursor: pageParam, organization_id: orgId, project_id: projId }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
    enabled: !!orgId && !!projId,
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => featuresApi.get(id),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featuresApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Feature> }) =>
      featuresApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      queryClient.invalidateQueries({ queryKey: ['feature', id] });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featuresApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}
