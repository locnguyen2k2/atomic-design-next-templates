'use client';

import { useState, useEffect } from 'react';
import { statsApi } from '@/api/stats';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    organizations: 0,
    projects: 0,
    features: 0,
    roles: 24,
    activeUsers: 1250,
    currentOrgProjects: 0,
    currentOrgFeatures: 0,
    staffs: 0,
    orgGrowth: 0,
    projectGrowth: 0,
    featureGrowth: 0,
    staffGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const [orgs, projects, features, staffs] = await Promise.all([
          statsApi.getPercentGrowth('organizations', 'month'),
          statsApi.getPercentGrowth('projects', 'month'),
          statsApi.getPercentGrowth('features', 'month'),
          statsApi.getPercentGrowth('staffs', 'month'),
        ]);

        setStats(prev => ({
          ...prev,
          organizations: orgs.data.total,
          projects: projects.data.total,
          features: features.data.total,
          staffs: staffs.data.total,
          orgGrowth: orgs.data.percent_growth,
          projectGrowth: projects.data.percent_growth,
          featureGrowth: features.data.percent_growth,
          staffGrowth: staffs.data.percent_growth,
          currentOrgProjects: projects.data.current,
          currentOrgFeatures: features.data.current,
        }));
      } catch (error) {
        console.log('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
