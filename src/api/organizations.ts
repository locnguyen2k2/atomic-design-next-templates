import apiClient from './client';
import type { Organization, PaginatedResponse, ListParams } from '@/types';

export const organizationsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Organization>> => {
    const { data: response } = await apiClient.get('/organizations', { params });
    const data = response?.data;
    return {
      data: data?.organizations || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<Organization> => {
    const { data } = await apiClient.get(`/organizations/${id}`);
    return data;
  },

  create: async (org: Partial<Organization>): Promise<Organization> => {
    const { data } = await apiClient.post('/organizations', org);
    return data;
  },

  update: async (id: string, org: Partial<Organization>): Promise<Organization> => {
    const { data } = await apiClient.patch(`/organizations/${id}`, org);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },
};
