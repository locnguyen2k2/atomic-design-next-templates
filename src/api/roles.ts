import apiClient from './client';
import { type Role, type PaginatedResponse, type ListParams, BasePageOptionDto, CursorResponse, BaseCursorOptionDto } from '@/types';

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

  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string; organization_id?: string } = {}): Promise<{
    data: Role[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Role> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const { organization_id, ...rest } = params;
      const headers: Record<string, string> = {};
      if (organization_id) headers['organization-id'] = organization_id;

      const response = await apiClient.get<{ data: CursorResponse<Role> }>('/roles/cursor', rest, headers);
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
