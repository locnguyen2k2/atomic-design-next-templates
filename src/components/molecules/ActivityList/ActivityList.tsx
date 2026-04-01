'use client';

import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import { IconName } from '@/types';

export interface Activity {
  id: string;
  type: string;
  name: string;
  entity: string;
  user: string;
  time: string;
  icon: IconName;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'violet';
}

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="activity-list flex flex-col px-5 py-1">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={cn(
            'activity-item flex items-center gap-4 py-3 group',
            index !== activities.length - 1 && 'border-b border-border-subtle'
          )}
        >
          <div
            className={cn(
              'activity-icon w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105',
              `bg-${activity.color}-dim text-${activity.color}`
            )}
          >
            <Icon name={activity.icon} />
          </div>
          <div className="activity-body flex-1 min-w-0">
            <div className="activity-title text-sm font-medium text-text-primary">
              <span className="capitalize">{activity.type}</span>{' '}
              <strong className="font-semibold">{activity.name}</strong>
            </div>
            <div className="activity-subtitle text-xs text-text-muted mt-0.5">
              {activity.entity} · by {activity.user}
            </div>
          </div>
          <div className="activity-time text-xs text-text-muted">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}
