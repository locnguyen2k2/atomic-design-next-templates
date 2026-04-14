import apiClient from './client';
import { type Role, type PaginatedResponse, type ListParams, BasePageOptionDto } from '@/types';

export const rolesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Role>> => {
    let data: PaginatedResponse<Role> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Role> }>('/roles', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
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
