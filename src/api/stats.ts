import { tr } from 'date-fns/locale';
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
    min?: {
      label: string;
      value: number;
    };
    max?: {
      label: string;
      value: number;
    };
  };
  timestamp: string;
}

export interface PercentGrowthResponse {
  success: boolean;
  message: string;
  data: {
    percent_growth: number;
    total: number;
    current: number;
    title: string;
  };
  timestamp: string;
}

export type GrowthPeriod = 'day' | 'week' | 'month' | 'year';
export type GrowthEntity = 'features' | 'projects' | 'organizations' | 'roles' | 'users' | 'staffs';

export const statsApi = {
  getGrowth: async (entity: GrowthEntity, orgId: string, period: GrowthPeriod): Promise<GrowthResponse> => {
    try {
      return await apiClient.get<GrowthResponse>(`/${entity}/growth/${orgId}`, { period });
    } catch (e: any) {
      return {
        success: false,
        message: 'Failed to fetch growth data',
        data: {
          data: {
            labels: [],
            values: [],
          },
          title: '',
          from: '',
          to: '',
        },
        timestamp: '',
      } as GrowthResponse;
    }
  },
  getPercentGrowth: async (entity: string, period: GrowthPeriod): Promise<PercentGrowthResponse> => {
    try {
      return await apiClient.get<PercentGrowthResponse>(`/${entity}/percent-growth`, { period });
    } catch (e: any) {
      return {
        success: false,
        message: 'Failed to fetch percent growth',
        data: {
          percent_growth: 0,
          total: 0,
          current: 0,
          title: '',
        },
      } as PercentGrowthResponse;
    }
  },
};
