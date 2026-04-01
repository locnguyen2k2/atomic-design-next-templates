'use client';

import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { PermissionMatrix } from '@/components/organisms/PermissionMatrix';
import { usePermissions } from '@/hooks/usePermissions';
import { useState, useEffect } from 'react';

interface RoleFormProps {
  data?: any;
  mode: 'create' | 'view' | 'edit';
  activeTab?: string;
  onChange?: (data: any) => void;
}

export function RoleForm({ data, mode, activeTab = 'general', onChange }: RoleFormProps) {
  const { resources, actions } = usePermissions();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    permissions: {}, // Format: { "resource:action": true }
    ...data,
  });

  const isReadOnly = mode === 'view';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  const handleTogglePermission = (roleId: string, resource: string, action: string) => {
    if (isReadOnly) return;
    
    const key = `${resource}:${action}`;
    const newPermissions = { ...formData.permissions };
    if (newPermissions[key]) {
      delete newPermissions[key];
    } else {
      newPermissions[key] = true;
    }
    
    const newData = { ...formData, permissions: newPermissions };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  useEffect(() => {
    if (data) setFormData({ ...formData, ...data });
  }, [data]);

  if (activeTab === 'permissions') {
    return (
      <div className="space-y-4">
        <PermissionMatrix
          roles={[{ id: formData.id || 'new', name: formData.name || 'New Role' }]}
          resources={resources}
          actions={actions}
          matrix={{ [formData.id || 'new']: formData.permissions }}
          onToggle={handleTogglePermission}
        />
      </div>
    );
  }

  if (activeTab === 'metadata') {
    return (
      <div className="space-y-4 text-sm text-text-muted">
        <div>
          <span className="font-medium">Created at:</span> {formData.created_at ? new Date(formData.created_at).toLocaleString() : 'N/A'}
        </div>
        <div>
          <span className="font-medium">Updated at:</span> {formData.updated_at ? new Date(formData.updated_at).toLocaleString() : 'N/A'}
        </div>
        <div>
          <span className="font-medium">ID:</span> {formData.id || 'N/A'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormField label="Role Name" required>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Admin"
          disabled={isReadOnly}
        />
      </FormField>

      <FormField label="Role Slug" required hint="Used for programmatic checks">
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="e.g. admin"
          disabled={isReadOnly || mode === 'edit'}
        />
      </FormField>

      <FormField label="Description">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="form-input w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:opacity-50"
          placeholder="Describe the responsibilities of this role..."
          disabled={isReadOnly}
        />
      </FormField>
    </div>
  );
}
