import apiClient from './client';
import { type Subscription, BaseCursorOptionDto, CursorResponse } from '@/types';

export const subscriptionsApi = {
  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: Subscription[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Subscription> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: CursorResponse<Subscription> }>('/subscriptions/cursor', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Subscription> => {
    return await apiClient.get(`/subscriptions/${id}`);
  },

  create: async (subscription: Partial<Subscription>): Promise<Subscription> => {
    return await apiClient.post('/subscriptions', subscription);
  },

  update: async (id: string, subscription: Partial<Subscription>): Promise<Subscription> => {
    return await apiClient.patch(`/subscriptions/${id}`, subscription);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subscriptions/${id}`);
  },
};
