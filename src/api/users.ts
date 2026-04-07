import apiClient from './client';
import type { User, PaginatedResponse, ListParams } from '@/types';

export const usersApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', { ...params }) as { data: any };
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
    return await apiClient.get(`/users/${id}`);
  },

  getMe: async (): Promise<{ data: User }> => {
    return await apiClient.get('/users/me');
  },

  create: async (user: Partial<User>): Promise<User> => {
    return await apiClient.post('/users', user);
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    return await apiClient.patch(`/users/${id}`, user);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
