import apiClient from './client';
import type { Feature, PaginatedResponse, ListParams } from '@/types';

export const featuresApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Feature>> => {
    const response = await apiClient.get('/features', { ...params }) as { data: any };
    const data = response?.data;
    return {
      data: data?.features || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<Feature> => {
    return await apiClient.get(`/features/${id}`);
  },

  create: async (feature: Partial<Feature>): Promise<Feature> => {
    return await apiClient.post('/features', feature);
  },

  update: async (id: string, feature: Partial<Feature>): Promise<Feature> => {
    return await apiClient.patch(`/features/${id}`, feature);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/features/${id}`);
  },
};
