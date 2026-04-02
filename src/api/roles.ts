import apiClient from './client';
import type { Role, PaginatedResponse, ListParams } from '@/types';

export const rolesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Role>> => {
    const { data: response } = await apiClient.get('/roles', { params });
    const data = response?.data;
    return {
      // data: data?.roles || [],
      data: [
        { id: 'role-001', name: 'Super Admin', slug: 'super-admin', description: 'Full unrestricted access to all resources and operations.', organization_id: 'org-001', created_at: '2024-01-10T08:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' },
        { id: 'role-002', name: 'Org Admin', slug: 'org-admin', description: 'Administrative access limited to a single organization.', organization_id: 'org-001', created_at: '2024-01-15T09:00:00.000Z', updated_at: '2025-01-20T10:00:00.000Z' },
        { id: 'role-003', name: 'Project Manager', slug: 'project-manager', description: 'Create and manage projects within assigned organization.', organization_id: 'org-001', created_at: '2024-02-01T10:00:00.000Z', updated_at: '2025-02-15T12:00:00.000Z' },
        { id: 'role-004', name: 'Developer', slug: 'developer', description: 'Read access to projects plus feature flag management.', organization_id: 'org-001', created_at: '2024-02-10T11:00:00.000Z', updated_at: '2025-03-01T09:00:00.000Z' },
        { id: 'role-005', name: 'Viewer', slug: 'viewer', description: 'Read-only access to all resources within scope.', organization_id: 'org-001', created_at: '2024-03-01T08:00:00.000Z', updated_at: '2025-02-28T14:00:00.000Z' },
      ],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    };
  },

  get: async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/roles/${id}`);
    return data;
  },

  create: async (role: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.post('/roles', role);
    return data;
  },

  update: async (id: string, role: Partial<Role>): Promise<Role> => {
    const { data } = await apiClient.patch(`/roles/${id}`, role);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },
};
