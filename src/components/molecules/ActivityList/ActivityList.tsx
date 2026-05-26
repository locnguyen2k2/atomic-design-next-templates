'use client';

import { Icon } from '@/components/atoms/Icon';
import { Badge } from '@/components/atoms/Badge';
import { type SystemLog } from '@/types';

interface ActivityListProps {
  activities: SystemLog[];
}

function getActionVariant(action: string): 'primary' | 'success' | 'warning' | 'danger' | 'muted' {
  const a = action.toLowerCase();
  if (a.includes('create') || a.includes('add')) return 'success';
  if (a.includes('update') || a.includes('edit')) return 'primary';
  if (a.includes('delete') || a.includes('remove')) return 'danger';
  if (a.includes('login') || a.includes('auth')) return 'warning';
  return 'muted';
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="activity-list space-y-2 px-5 py-1">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="activity-item flex gap-3 p-3 bg-bg-surface rounded-lg border border-border hover:border-border-subtle transition-colors"
        >
          <div className="w-8 h-8 rounded bg-primary-dim text-primary flex items-center justify-center shrink-0">
            <Icon name="scroll" size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-2">
              <Badge variant={getActionVariant(activity.action)} className="uppercase text-[10px]">
                {activity.action}
              </Badge>
              <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">
                {new Date(activity.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-medium text-text-primary">
                {activity.entity}
                {activity.entity_id && <span className="text-[10px] text-text-muted ml-1 font-mono">({activity.entity_id})</span>}
              </div>
              <div className="text-xs text-text-secondary">
                By {activity.user_name || 'System'}{activity.ip_address && <span className="text-text-muted ml-1">• {activity.ip_address}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
