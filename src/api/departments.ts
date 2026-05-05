import apiClient from './client';
import { type Department, BaseCursorOptionDto, CursorResponse } from '@/types';

export const departmentsApi = {
  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: Department[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Department> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: CursorResponse<Department> }>('/departments/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Department> => {
    return await apiClient.get(`/departments/${id}`);
  },

  create: async (department: Partial<Department>): Promise<Department> => {
    return await apiClient.post('/departments', department);
  },

  update: async (id: string, department: Partial<Department>): Promise<Department> => {
    return await apiClient.patch(`/departments/${id}`, department);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};
