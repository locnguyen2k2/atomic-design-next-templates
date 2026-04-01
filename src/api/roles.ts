import apiClient from './client';
import type { Role, PaginatedResponse, ListParams } from '@/types';

export const rolesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Role>> => {
    const { data: response } = await apiClient.get('/roles', { params });
    const data = response?.data;
    return {
      data: data?.roles || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/roles/${id}`);
    return data;
  },

  create: async (role: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.post('/roles', role);
    return data;
  },

  update: async (id: string, role: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.patch(`/roles/${id}`, role);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },
};
