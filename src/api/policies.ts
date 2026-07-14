import apiClient from './client';
import { AbacPolicy } from '@/types/abac';
import { PaginatedResponse, ListParams, BasePageOptionDto, BaseCursorOptionDto, CursorResponse, SystemLog } from '@/types';

export const policiesApi = {
  list: async (orgId: string, params: ListParams = {}): Promise<PaginatedResponse<AbacPolicy>> => {
    let data: PaginatedResponse<AbacPolicy> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<AbacPolicy> }>(`/policies/organizations/${orgId}`, params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  logs: async (params: ListParams = {}): Promise<PaginatedResponse<SystemLog>> => {
    let data: PaginatedResponse<SystemLog> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      params.keyword = "/evaluate"
      const response = await apiClient.get<{ data: PaginatedResponse<SystemLog> }>('/system/logs', params);
      data = response?.data;
    } catch (e: any) {
      console.log('Failed to fetch system logs:', e);
    }
    return data;
  },

  get: async (orgId: string, id: string): Promise<AbacPolicy> => {
    return await apiClient.get(`/policies/${id}`);
  },

  create: async (orgId: string, policy: Partial<AbacPolicy>): Promise<AbacPolicy> => {
    return await apiClient.post(`/policies/organizations/${orgId}`, policy);
  },

  update: async (orgId: string, id: string, policy: Partial<AbacPolicy>): Promise<AbacPolicy> => {
    return await apiClient.patch(`/policies/${id}`, policy);
  },

  delete: async (orgId: string, id: string): Promise<void> => {
    await apiClient.delete(`/policies/${id}`);
  },

  evaluate: async (orgId: string, body: any): Promise<any> => {
    return await apiClient.post(`/policies/organizations/${orgId}/evaluate`, body);
  },

  listResourceTypesCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: { slug: string; name: string; description: string }[];
    paginated: {
      keyword: string;
      sort: string;
      sorted: string;
      from_date: string;
      to_date: string;
      limit: number;
      direction: string;
      number_records: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> => {
    let data: {
      data: { slug: string; name: string; description: string }[];
      paginated: {
        keyword: string;
        sort: string;
        sorted: string;
        from_date: string;
        to_date: string;
        limit: number;
        direction: string;
        number_records: number;
        has_next: boolean;
        has_prev: boolean;
      };
    } = {
      data: [],
      paginated: {
        keyword: '',
        sort: 'created_at',
        sorted: 'desc',
        from_date: '',
        to_date: '',
        limit: 10,
        direction: 'next',
        number_records: 0,
        has_next: false,
        has_prev: false
      }
    }
    try {
      const response = await apiClient.get<{ data: typeof data }>('/policies/resources/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },
};
