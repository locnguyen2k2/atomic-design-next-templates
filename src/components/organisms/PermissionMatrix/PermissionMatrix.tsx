'use client';

import React from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';

interface Role {
  id: string;
  name: string;
}

interface PermissionMatrixProps {
  roles: Role[];
  resources: string[];
  actions: string[];
  matrix: Record<string, Record<string, boolean>>;
  onToggle: (role: string, resource: string, action: string) => void;
}

export function PermissionMatrix({
  roles,
  resources,
  actions,
  matrix,
  onToggle,
}: PermissionMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider border-b border-border">
              Resource / Action
            </th>
            {roles.map((role) => (
              <th
                key={role.id}
                className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider border-b border-border"
                colSpan={actions.length}
              >
                {role.name}
              </th>
            ))}
          </tr>
          <tr>
            <th className="px-4 py-2 border-b border-border-subtle"></th>
            {roles.map((role) => (
              <React.Fragment key={role.id}>
                {actions.map((action) => (
                  <th
                    key={`${role.id}-${action}`}
                    className="px-2 py-2 text-center text-xs font-medium text-text-muted border-b border-border-subtle border-r border-border-subtle last:border-r-0"
                  >
                    {action}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource}>
              <td className="px-4 py-3 text-sm font-medium text-text-primary border-b border-border-subtle">
                {resource}
              </td>
              {roles.map((role) => (
                <React.Fragment key={`${resource}-${role.id}`}>
                  {actions.map((action) => (
                    <td
                      key={`${resource}-${role.id}-${action}`}
                      className="px-2 py-3 text-center border-b border-border-subtle border-r border-border-subtle last:border-r-0"
                    >
                      <Checkbox
                        checked={matrix[role.id]?.[`${resource}:${action}`] || false}
                        onChange={() => onToggle(role.id, resource, action)}
                      />
                    </td>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
