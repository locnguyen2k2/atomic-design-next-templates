import apiClient from './client';
import { type Feature, type PaginatedResponse, type ListParams, BasePageOptionDto, CursorResponse, BaseCursorOptionDto } from '@/types';

export const featuresApi = {
  list: async (params: ListParams = {}, project_id: string, organization_id: string): Promise<PaginatedResponse<Feature>> => {
    let data: PaginatedResponse<Feature> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    if (!project_id || !organization_id || project_id === "" || organization_id === "") {
      return data;
    }
    const headers: Record<string, string> = {};
    if (project_id) headers['project-id'] = project_id;
    if (organization_id) headers['organization-id'] = organization_id;
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Feature> }>('/features', params, headers);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  listCursor: async (params: { cursor?: string; limit?: number; keyword?: string; organization_id?: string; project_id?: string } = {}): Promise<{
    data: Feature[];
    paginated: {
      next_cursor: string | null;
      has_next: boolean;
    };
  }> => {
    let data: CursorResponse<Feature> = {
      data: [],
      paginated: new BaseCursorOptionDto()
    }
    try {
      const { organization_id, project_id, ...rest } = params;
      const headers: Record<string, string> = {};
      if (organization_id) headers['organization-id'] = organization_id;
      if (project_id) headers['project-id'] = project_id;

      const response = await apiClient.get<{ data: CursorResponse<Feature> }>('/features/cursor', rest, headers);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },

  get: async (id: string): Promise<Feature> => {
    return await apiClient.get(`/features/${id}`);
  },

  create: async (feature: Partial<Feature>): Promise<Feature> => {
    return await apiClient.post('/features', feature);
  },

  update: async (id: string, feature: Partial<Feature>): Promise<Feature> => {
    return await apiClient.patch(`/features/${id}`, feature);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/features/${id}`);
  },
};
