import apiClient from './client';

export interface GrowthData {
  labels: string[];
  values: number[];
}

export interface GrowthResponse {
  success: boolean;
  message: string;
  data: {
    data: GrowthData;
    title: string;
    from: string;
    to: string;
  };
  timestamp: string;
}

export type GrowthPeriod = 'day' | 'week' | 'month' | 'year';
export type GrowthEntity = 'features' | 'projects' | 'organizations' | 'roles' | 'users';

export const statsApi = {
  getGrowth: async (entity: GrowthEntity, orgId: string, period: GrowthPeriod): Promise<GrowthResponse> => {
    return await apiClient.get<GrowthResponse>(`/${entity}/growth/${orgId}`, { period });
  },
};
