import apiClient from './client';
import type { Role, PaginatedResponse, ListParams } from '@/types';

export const rolesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Role>> => {
    const response = await apiClient.get('/roles', { ...params }) as { data: any };
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
    return await apiClient.get(`/roles/${id}`);
  },

  create: async (role: Partial<Role>): Promise<Role> => {
    return await apiClient.post('/roles', role);
  },

  update: async (id: string, role: Partial<Role>): Promise<Role> => {
    return await apiClient.patch(`/roles/${id}`, role);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },
};
