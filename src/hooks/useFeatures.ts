import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featuresApi } from '@/api';
import type { Feature, ListParams } from '@/types';
import { useAppStore } from '@/stores';

export function useFeatures(params: ListParams = {}) {
  const { currentOrg, currentProject } = useAppStore();
  return useQuery({
    queryKey: ['features', params, currentOrg, currentProject],
    queryFn: () => featuresApi.list(params),
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
