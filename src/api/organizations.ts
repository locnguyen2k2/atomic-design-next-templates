import apiClient from './client';
import type { Organization, PaginatedResponse, ListParams } from '@/types';

export const organizationsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Organization>> => {
    const { data } = await apiClient.get('/organizations', { params });
    return data;
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
