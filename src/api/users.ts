import apiClient from './client';
import type { User, PaginatedResponse, ListParams } from '@/types';

export const usersApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get('/users', { params });
    return data;
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
