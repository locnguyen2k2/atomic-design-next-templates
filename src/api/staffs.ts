import apiClient from './client';
import { type Staff, type PaginatedResponse, type ListParams, BasePageOptionDto, CursorResponse, BaseCursorOptionDto } from '@/types';

export const staffsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Staff>> => {
    let data: PaginatedResponse<Staff> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Staff> }>('/staffs', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string; organization_id?: string } = {}): Promise<{
    data: Staff[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Staff> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const { organization_id, ...rest } = params;
      const headers: Record<string, string> = {};
      if (organization_id) headers['organization-id'] = organization_id;

      const response = await apiClient.get<{ data: CursorResponse<Staff> }>('/staffs/cursor', rest, headers);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Staff> => {
    return await apiClient.get(`/Staffs/${id}`);
  },

  create: async (Staff: Partial<Staff>): Promise<Staff> => {
    return await apiClient.post('/staffs', Staff);
  },

  update: async (id: string, Staff: Partial<Staff>): Promise<Staff> => {
    return await apiClient.patch(`/Staffs/${id}`, Staff);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/Staffs/${id}`);
  },
};
