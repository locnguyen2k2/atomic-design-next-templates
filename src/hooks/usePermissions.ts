'use client';

import { useState } from 'react';

export function usePermissions() {
  const [resources] = useState(['organizations', 'projects', 'features', 'roles', 'users']);
  const [actions] = useState(['read', 'create', 'update', 'delete']);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});

  const togglePermission = (roleId: string, resource: string, action: string) => {
    const key = `${resource}:${action}`;
    setMatrix(prev => {
      const rolePerms = prev[roleId] || {};
      const newRolePerms = { ...rolePerms, [key]: !rolePerms[key] };
      return { ...prev, [roleId]: newRolePerms };
    });
  };

  const saveChanges = async () => {
    // Mock save
    console.log('Saving matrix:', matrix);
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  return { resources, actions, matrix, togglePermission, saveChanges };
}
