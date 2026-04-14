import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api';
import type { Project, ListParams } from '@/types';
import { useAppStore } from '@/stores';

export function useProjects(params: ListParams = {}) {
  const { currentOrg } = useAppStore();
  return useQuery({
    queryKey: ['projects', params, currentOrg],
    queryFn: () => projectsApi.list(params),
  });
}

export function useProjectsCursor(params: { limit?: number; keyword?: string } = {}) {
  const { currentOrg } = useAppStore();
  return useInfiniteQuery({
    queryKey: ['projects', 'cursor', params, currentOrg],
    queryFn: ({ pageParam }) => projectsApi.listCursor({ ...params, cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.paginated.has_next ? lastPage.paginated.next_cursor : undefined,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
