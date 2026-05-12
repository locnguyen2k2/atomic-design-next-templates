'use client';

import { useQuery } from '@tanstack/react-query';
import { statsApi, type GrowthEntity, type GrowthPeriod } from '@/api/stats';
import { useAppStore } from '@/stores/appStore';

export function useGrowthStats(entity: GrowthEntity, period: GrowthPeriod) {
  const currentOrg = useAppStore((state) => state.currentOrg);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['growth', entity, currentOrg, period],
    queryFn: () => statsApi.getGrowth(entity, currentOrg, period),
    enabled: !!currentOrg && !!entity && !!period,
  });

  return {
    growthData: data?.data?.data,
    title: data?.data?.title,
    min: data?.data?.min,
    max: data?.data?.max,
    isLoading,
    error,
    refetch,
  };
}
