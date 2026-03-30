import apiClient from './client';
import type { Feature, PaginatedResponse, ListParams } from '@/types';

export const featuresApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Feature>> => {
    const { data } = await apiClient.get('/features', { params });
    return data;
  },

  get: async (id: string): Promise<Feature> => {
    const { data } = await apiClient.get(`/features/${id}`);
    return data;
  },

  create: async (feature: Partial<Feature>): Promise<Feature> => {
    const { data } = await apiClient.post('/features', feature);
    return data;
  },

  update: async (id: string, feature: Partial<Feature>): Promise<Feature> => {
    const { data } = await apiClient.patch(`/features/${id}`, feature);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/features/${id}`);
  },
};
