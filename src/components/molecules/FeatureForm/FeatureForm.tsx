'use client';

import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { Checkbox } from '@/components/atoms/Checkbox';
import { useState, useEffect } from 'react';

interface FeatureFormProps {
  data?: any;
  mode: 'create' | 'view' | 'edit';
  onChange?: (data: any) => void;
}

export function FeatureForm({ data, mode, onChange }: FeatureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    organization_id: '',
    project_id: '',
    is_enabled: false,
    ...data,
  });

  const isReadOnly = mode === 'view';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newData = { 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  useEffect(() => {
    if (data) setFormData({ ...formData, ...data });
  }, [data]);

  return (
    <div className="space-y-4">
      <FormField label="Feature Name" required>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Beta Access"
          disabled={isReadOnly}
        />
      </FormField>

      <FormField label="Feature Slug" required hint="Identifier for code integration">
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="e.g. beta_access"
          disabled={isReadOnly || mode === 'edit'}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Organization ID" required>
          <Input
            name="organization_id"
            value={formData.organization_id}
            onChange={handleChange}
            placeholder="org_123"
            disabled={isReadOnly || mode === 'edit'}
          />
        </FormField>
        <FormField label="Project ID" required>
          <Input
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            placeholder="proj_456"
            disabled={isReadOnly || mode === 'edit'}
          />
        </FormField>
      </div>

      <div className="flex items-center gap-2 py-2">
        <Checkbox
          id="is_enabled"
          name="is_enabled"
          checked={formData.is_enabled}
          onChange={(checked) => {
            const newData = { ...formData, is_enabled: checked };
            setFormData(newData);
            if (onChange) onChange(newData);
          }}
          disabled={isReadOnly}
        />
        <label htmlFor="is_enabled" className="text-sm font-medium text-text-primary cursor-pointer">
          Feature Enabled
        </label>
      </div>

      <FormField label="Description">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="form-input w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:opacity-50"
          placeholder="Describe what this feature toggle controls..."
          disabled={isReadOnly}
        />
      </FormField>
    </div>
  );
}
