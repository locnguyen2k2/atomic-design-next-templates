import apiClient from './client';
import type { Project, PaginatedResponse, ListParams } from '@/types';

export const projectsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Project>> => {
    const { data: response } = await apiClient.get('/projects', { params });
    const data = response?.data;
    return {
      data: data?.projects || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get(`/projects/${id}`);
    return data;
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.post('/projects', project);
    return data;
  },

  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.patch(`/projects/${id}`, project);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
