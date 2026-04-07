import apiClient from './client';
import type { Organization, PaginatedResponse, ListParams } from '@/types';

export const organizationsApi = {
  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: {
      organizations: Organization[];
      paginated: {
        next_cursor: string | null;
        has_next: boolean;
      };
    };
  }> => {
    return await apiClient.get('/organizations/cursor', params);
  },

  list: async (params: ListParams = {}): Promise<PaginatedResponse<Organization>> => {
    const response = await apiClient.get('/organizations', params) as { data: any };
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
    return await apiClient.get(`/organizations/${id}`);
  },

  create: async (org: Partial<Organization>): Promise<Organization> => {
    return await apiClient.post('/organizations', org);
  },

  update: async (id: string, org: Partial<Organization>): Promise<Organization> => {
    return await apiClient.patch(`/organizations/${id}`, org);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },
};
