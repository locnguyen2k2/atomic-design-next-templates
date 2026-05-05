import apiClient from './client';
import { type Clearance, BaseCursorOptionDto, CursorResponse } from '@/types';

export const clearancesApi = {
  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: Clearance[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Clearance> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: CursorResponse<Clearance> }>('/clearances/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Clearance> => {
    return await apiClient.get(`/clearances/${id}`);
  },

  create: async (clearance: Partial<Clearance>): Promise<Clearance> => {
    return await apiClient.post('/clearances', clearance);
  },

  update: async (id: string, clearance: Partial<Clearance>): Promise<Clearance> => {
    return await apiClient.patch(`/clearances/${id}`, clearance);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clearances/${id}`);
  },
};
