import apiClient from './client';
import { type Organization, type PaginatedResponse, type ListParams, BasePageOptionDto, BaseCursorOptionDto, CursorResponse } from '@/types';

export const organizationsApi = {
  joinedCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: Organization[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Organization> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: CursorResponse<Organization> }>('/organizations/joined/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  joinedPagination: async (params: ListParams = {}): Promise<PaginatedResponse<Organization>> => {
    let data: PaginatedResponse<Organization> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Organization> }>('/organizations/joined', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
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
