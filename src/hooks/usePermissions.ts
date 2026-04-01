'use client';

import { useState } from 'react';

export function usePermissions() {
  const [resources] = useState(['organizations', 'projects', 'features', 'roles', 'users']);
  const [actions] = useState(['read', 'create', 'update', 'delete']);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    'role_1': {
      'organizations:read': true,
      'organizations:create': true,
      'organizations:update': true,
      'organizations:delete': true,
      'projects:read': true,
      'projects:create': true,
    },
    'role_2': {
      'organizations:read': true,
      'projects:read': true,
      'features:read': true,
    }
  });

  const togglePermission = (roleId: string, resource: string, action: string) => {
    const key = `${resource}:${action}`;
    setMatrix(prev => {
      const rolePerms = { ...prev[roleId] } || {};
      rolePerms[key] = !rolePerms[key];
      return { ...prev, [roleId]: rolePerms };
    });
  };

  const saveChanges = async () => {
    // Mock save
    console.log('Saving matrix:', matrix);
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  return { resources, actions, matrix, togglePermission, saveChanges };
}
