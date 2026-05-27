'use client';

import React from 'react';
import { Icon } from '@/components/atoms/Icon';
import { useSystemLogs } from '@/hooks/useSystemLogs';

interface RecentActivityTabProps {
  entityId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function RecentActivityTab({ entityId, createdAt, updatedAt }: RecentActivityTabProps) {
  const { logs, isLoading } = useSystemLogs({ 
    limit: 5, 
    ...(entityId ? { keyword: entityId } : {}) 
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-xs bg-bg-surface p-4 rounded-lg border border-border">
        <div>
          <span className="text-text-muted block mb-1">Created At</span>
          <span className="text-text-primary font-medium">{createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}</span>
        </div>
        <div>
          <span className="text-text-muted block mb-1">Last Updated</span>
          <span className="text-text-primary font-medium">{updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Icon name="history" size="sm" />
          Activity Log
        </h4>
        
        {isLoading ? (
          <div className="py-8 text-center animate-pulse text-text-muted text-sm">Loading activity...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-text-muted text-sm bg-bg-surface rounded-lg border border-dashed border-border">
            No recent activity found
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-sm p-3 bg-bg-surface rounded-lg border border-border">
                <div className="w-8 h-8 rounded bg-primary-dim text-primary flex items-center justify-center shrink-0">
                  <Icon name="scroll" size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-text-primary capitalize">{log.action}</span>
                    <span className="text-[10px] text-text-muted font-mono">{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    By {log.created_by || 'System'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
