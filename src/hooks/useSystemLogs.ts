'use client';

import { useState, useEffect } from 'react';
import { systemLogsApi } from '@/api/system-logs';
import { type SystemLog, type ListParams, type PaginatedResponse, BasePageOptionDto } from '@/types';

export function useSystemLogs(initialParams: ListParams = { page: 1, limit: 10 }) {
  const [data, setData] = useState<PaginatedResponse<SystemLog>>({
    data: [],
    paginated: new BasePageOptionDto()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<ListParams>(initialParams);

  const fetchLogs = async (currentParams: ListParams) => {
    setIsLoading(true);
    try {
      const response = await systemLogsApi.pagination(currentParams);
      setData(response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(params);
  }, [params]);

  const setPage = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const setSearch = (keyword: string) => {
    setParams(prev => ({ ...prev, keyword, page: 1 }));
  };

  const setDateRange = (from?: string, to?: string) => {
    setParams(prev => ({ ...prev, from_date: from, to_date: to, page: 1 }));
  };

  return {
    logs: data.data,
    paginated: data.paginated,
    isLoading,
    setPage,
    setSearch,
    setDateRange,
    refresh: () => fetchLogs(params)
  };
}
