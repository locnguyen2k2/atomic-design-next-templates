import apiClient from './client';
import { type Feature, type PaginatedResponse, type ListParams, BasePageOptionDto } from '@/types';

export const featuresApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Feature>> => {
    let data: PaginatedResponse<Feature> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Feature> }>('/features', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
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
