import apiClient from './client';
import { Attribute } from '@/types/abac';
import { PaginatedResponse, ListParams, BasePageOptionDto } from '@/types';

export const attributesApi = {
  list: async (orgId: string, params: ListParams = {}): Promise<PaginatedResponse<Attribute>> => {
    let data: PaginatedResponse<Attribute> = {
      data: [],
      paginated: new BasePageOptionDto()
    }
    try {
      const response = await apiClient.get<{ data: PaginatedResponse<Attribute> }>(`/attributes`, params);
      data = response?.data;
    } catch (e: any) {
      console.log(e);
    }
    return data;
  },
};
