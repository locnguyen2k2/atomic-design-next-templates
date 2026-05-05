import apiClient from './client';
import { type Environment, BaseCursorOptionDto, CursorResponse } from '@/types';

export const environmentsApi = {
  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: Environment[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Environment> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: CursorResponse<Environment> }>('/environments/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Environment> => {
    return await apiClient.get(`/environments/${id}`);
  },

  create: async (environment: Partial<Environment>): Promise<Environment> => {
    return await apiClient.post('/environments', environment);
  },

  update: async (id: string, environment: Partial<Environment>): Promise<Environment> => {
    return await apiClient.patch(`/environments/${id}`, environment);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/environments/${id}`);
  },
};
