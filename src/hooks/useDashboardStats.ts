'use client';

import { useState, useEffect } from 'react';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    organizations: 12,
    projects: 45,
    features: 89,
    roles: 24,
    activeUsers: 1250,
    currentOrgProjects: 5,
    currentOrgFeatures: 12,
    weeklyData: [
      { label: 'Mon', value: 40 },
      { label: 'Tue', value: 65 },
      { label: 'Wed', value: 45 },
      { label: 'Thu', value: 80 },
      { label: 'Fri', value: 72 },
      { label: 'Sat', value: 55 },
      { label: 'Sun', value: 90 },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  return { stats, isLoading };
}
