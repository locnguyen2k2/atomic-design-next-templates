'use client';

import React from 'react';
import { Icon } from '@/components/atoms/Icon';
import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/lib/utils';
import type { IconName } from '@/types/icon';

interface Role {
  id: string;
  name: string;
  slug?: string;
}

interface PermissionMatrixProps {
  roles: Role[];
  resources: string[];
  actions: string[];
  matrix: Record<string, Record<string, boolean>>;
  onToggle: (roleId: string, resource: string, action: string) => void;
}

const getResourceIcon = (res: string): IconName => {
  const map: Record<string, IconName> = {
    organizations: 'building',
    projects: 'folder-open',
    features: 'flag',
    roles: 'shield',
    users: 'users',
    permissions: 'key'
  };
  return map[res] || 'circle';
};

export function PermissionMatrix({
  roles,
  resources,
  actions,
  matrix,
  onToggle,
}: PermissionMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="permission-table">
        <thead>
          <tr>
            <th>Resource / Action</th>
            {roles.map((role) => (
              <th key={role.id}>
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="violet" className="text-[10px] px-2 py-0.5">
                    {role.name}
                  </Badge>
                  {role.slug && (
                    <span className="text-[9px] font-mono text-text-muted">
                      {role.slug}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <React.Fragment key={resource}>
              {/* Resource Header Row */}
              <tr className="bg-bg-elevated">
                <td className="p-2.5 font-bold text-sm text-text-primary border-b border-border">
                  <div className="flex items-center gap-2">
                    <Icon 
                      name={getResourceIcon(resource)} 
                      className="text-primary" 
                      size="sm" 
                    />
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                  </div>
                </td>
                {roles.map((role) => (
                  <td key={`${resource}-${role.id}`} className="border-b border-border"></td>
                ))}
              </tr>
              
              {/* Action Rows */}
              {actions.map((action) => (
                <tr key={`${resource}-${action}`}>
                  <td className="pl-8">
                    <Badge variant="muted" className="text-[10px] font-medium opacity-70">
                      {action}
                    </Badge>
                  </td>
                  {roles.map((role) => {
                    const isChecked = matrix[role.id]?.[`${resource}:${action}`] || false;
                    return (
                      <td key={`${resource}-${role.id}-${action}`}>
                        <div
                          className={cn("perm-check", isChecked && "checked")}
                          onClick={() => onToggle(role.id, resource, action)}
                          title={`${isChecked ? 'Revoke' : 'Grant'} ${action} on ${resource} for ${role.name}`}
                        >
                          <Icon name="check" size="sm" />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
