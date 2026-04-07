import apiClient from './client';
import type { Project, PaginatedResponse, ListParams } from '@/types';

export const projectsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get('/projects', { ...params }) as { data: any };
    const data = response?.data;
    return {
      data: data?.projects || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string } = {}): Promise<{
    data: {
      projects: Project[];
      paginated: {
        next_cursor: string | null;
        has_next: boolean;
      };
    };
  }> => {
    return await apiClient.get('/projects/cursor', params);
  },

  get: async (id: string): Promise<Project> => {
    return await apiClient.get(`/projects/${id}`);
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    return await apiClient.post('/projects', project);
  },

  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    return await apiClient.patch(`/projects/${id}`, project);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
