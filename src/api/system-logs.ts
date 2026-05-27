import apiClient from './client';
import { type SystemLog, type PaginatedResponse, type ListParams, BasePageOptionDto } from '@/types';

export const systemLogsApi = {
  pagination: async (params: ListParams = {}): Promise<PaginatedResponse<SystemLog>> => {
    let data: PaginatedResponse<SystemLog> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<SystemLog> }>('/system/logs', params);
      data = response?.data;
    } catch (e: any) {
      console.log('Failed to fetch system logs:', e);
    }
    return data;
  },

  get: async (id: string): Promise<SystemLog> => {
    return await apiClient.get(`/system/logs/${id}`);
  },
};
