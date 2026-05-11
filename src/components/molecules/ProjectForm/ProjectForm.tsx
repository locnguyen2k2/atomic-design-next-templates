'use client';

import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores';

interface ProjectFormProps {
  data?: any;
  mode: 'create' | 'view' | 'edit';
  onChange?: (data: any) => void;
}

export function ProjectForm({ data, mode, onChange }: ProjectFormProps) {
  const { currentOrg } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    organization_id: currentOrg || '',
    ...data,
  });

  const isReadOnly = mode === 'view';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  useEffect(() => {
    if (mode === 'create' && !data) {
      if (onChange) onChange(formData);
    }
  }, []);

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(formData)) {
      setFormData((prev: any) => ({ ...prev, ...data }));
    }
  }, [data]);

  return (
    <div className="space-y-4">
      <FormField label="Project Name" required>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Nexus API"
          disabled={isReadOnly}
        />
      </FormField>

      <FormField label="Project Slug" required hint="Unique identifier used in URLs">
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="e.g. nexus-api"
          disabled={isReadOnly || mode === 'edit'}
          leftIcon={<span className="text-xs font-mono">/</span>}
        />
      </FormField>

      <FormField label="Organization ID" required>
        <Input
          name="organization_id"
          value={formData.organization_id}
          onChange={handleChange}
          placeholder="e.g. org_123"
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
          placeholder="Describe the project..."
          disabled={isReadOnly}
        />
      </FormField>
    </div>
  );
}
