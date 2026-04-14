import apiClient from './client';
import { type User, type PaginatedResponse, type ListParams, BasePageOptionDto } from '@/types';

export const usersApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<User>> => {
    let data: PaginatedResponse<User> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<User> }>('/users', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
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
