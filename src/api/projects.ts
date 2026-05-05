import apiClient from './client';
import { type Project, type PaginatedResponse, type ListParams, BasePageOptionDto, CursorResponse, BaseCursorOptionDto } from '@/types';

export const projectsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Project>> => {
    let data: PaginatedResponse<Project> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Project> }>('/projects', params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string; organization_id?: string } = {}): Promise<{
    data: Project[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Project> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const { organization_id, ...rest } = params;
      const headers: Record<string, string> = {};
      if (organization_id) headers['organization-id'] = organization_id;

      const response = await apiClient.get<{ data: CursorResponse<Project> }>('/projects/cursor', rest, headers);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
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
