'use client';

import { useState } from 'react';
import type { Activity } from '@/components/molecules/ActivityList/ActivityList';

export function useActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'created',
      name: 'Acme Corp',
      entity: 'Organization',
      user: 'John Doe',
      time: '2 mins ago',
      icon: 'building',
      color: 'primary',
    },
    {
      id: '2',
      type: 'updated',
      name: 'Nexus API',
      entity: 'Project',
      user: 'Jane Smith',
      time: '15 mins ago',
      icon: 'folder-open',
      color: 'accent',
    },
    {
      id: '3',
      type: 'enabled',
      name: 'Beta Access',
      entity: 'Feature',
      user: 'Mike Wilson',
      time: '1 hour ago',
      icon: 'flag',
      color: 'success',
    },
    {
      id: '4',
      type: 'assigned',
      name: 'Admin Role',
      entity: 'Role',
      user: 'Sarah Connor',
      time: '3 hours ago',
      icon: 'shield',
      color: 'violet',
    },
    {
      id: '5',
      type: 'logged in',
      name: 'New Session',
      entity: 'User',
      user: 'David Brown',
      time: '5 hours ago',
      icon: 'users',
      color: 'warning',
    },
  ]);

  return { activities };
}
