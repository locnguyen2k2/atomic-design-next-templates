import apiClient from './client';
import type { User, PaginatedResponse, ListParams } from '@/types';

export const usersApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<User>> => {
    const { data: response } = await apiClient.get('/users', { params });
    const data = response?.data;
    return {
      data: data?.users || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  create: async (user: Partial<User>): Promise<User> => {
    const { data } = await apiClient.post('/users', user);
    return data;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${id}`, user);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
