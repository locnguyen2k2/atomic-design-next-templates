"use client";

import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { useState, useEffect } from "react";

interface OrganizationFormProps {
  data?: any;
  mode: 'create' | 'view' | 'edit';
  onChange?: (data: any) => void;
}

export function OrganizationForm({ data, mode, onChange }: OrganizationFormProps) {
  const [formData, setFormData] = useState(() => ({
    name: '',
    slug: '',
    description: '',
    ...data,
  }));

  const isReadOnly = mode === 'view';

  const handleChange = (name: string, value: string) => {
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
      setFormData({
        name: '',
        slug: '',
        description: '',
        ...data,
      });
    }
  }, [data]);

  return (
    <div className="space-y-4">
      <FormField
        name="name"
        label="Organization Name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        placeholder="e.g. Acme Corp"
        required
        readOnly={isReadOnly}
      />

      <FormField
        name="slug"
        label="Organization Slug"
        value={formData.slug}
        onChange={(value) => handleChange('slug', value)}
        placeholder="e.g. acme-corp"
        required
        readOnly={isReadOnly || mode === 'edit'}
        hint="Unique identifier used in URLs"
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="form-input w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:opacity-50"
          placeholder="Describe the organization..."
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}