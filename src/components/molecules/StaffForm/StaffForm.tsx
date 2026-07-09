'use client';

import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/stores';
import { SelectWithCursor } from '../SelectWithCursor';
import { useDepartmentsCursor, useOrganizationsCursor } from '@/hooks';

interface StaffFormProps {
  data?: any;
  mode: 'create' | 'view' | 'edit';
  onChange?: (data: any) => void;
}

export function StaffForm({ data, mode, onChange }: StaffFormProps) {
  const { currentOrg } = useAppStore();
  const [formData, setFormData] = useState({
    organization_id: currentOrg || '',
    department_id: currentOrg || '',
    ...data,
  });
  const [organizationSearch, setOrganizationSearch] = useState("");
  const { data: organizationPages, fetchNextPage: fetchNextOrganization, hasNextPage: hasNextOrganization, isFetchingNextPage: isFetchingNextOrganization, isLoading: isOrganizationsLoading } = useOrganizationsCursor({ keyword: organizationSearch });
  const organizations = useMemo(() => organizationPages?.pages.flatMap((page) => page.data) || [], [organizationPages]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const { data: departmentPages, fetchNextPage: fetchNextDepartment, hasNextPage: hasNextDepartment, isFetchingNextPage: isFetchingNextDepartment, isLoading: isDepartmentsLoading } = useDepartmentsCursor({ keyword: departmentSearch });
  const departments = useMemo(() => departmentPages?.pages.flatMap((page) => page.data) || [], [departmentPages]);
  const isReadOnly = mode === 'view';

  const handleChange = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
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
      <FormField label="Full Name" required>
        <Input
          name="name"
          value={`${formData.user.first_name} ${formData.user.last_name}`}
          placeholder="e.g. Nexus API"
          disabled={true}
        />
      </FormField>

      <FormField label="Organization ID" required>
        <Input
          name="organization_id"
          value={formData.organization_id}
          onChange={(e) => handleChange('organization_id', e.target.value)}
          placeholder="e.g. org_123"
          disabled={isReadOnly || mode === 'edit'}
        />
      </FormField>

      <FormField label="Organization Id" required hint="Unique identifier used in URLs">
        <SelectWithCursor
          label="Organization"
          placeholder="Select Organization"
          items={organizations}
          isLoading={isOrganizationsLoading || isFetchingNextOrganization}
          hasMore={!!hasNextOrganization}
          onLoadMore={() => fetchNextOrganization()}
          onSearch={(query) => setOrganizationSearch(query)}
          onSelect={(item) => handleChange('organization_id', item.id)}
          selectedId={formData.organization_id}
          disabled={isReadOnly || mode === 'edit'}
        />
      </FormField>


      <FormField label="Department Id" required hint="Unique identifier used in URLs">
        <SelectWithCursor
          label="Department"
          placeholder="Select Department"
          items={departments}
          isLoading={isDepartmentsLoading || isFetchingNextDepartment}
          hasMore={!!hasNextDepartment}
          onLoadMore={() => fetchNextDepartment()}
          onSearch={(query) => setDepartmentSearch(query)}
          onSelect={(item) => handleChange("department_id", item.id)}
          selectedId={formData.department_id}
          disabled={isReadOnly || mode === 'edit'}
        />
      </FormField>

      <FormField label="Status">
        <textarea
          name="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          rows={3}
          className="form-input w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 disabled:opacity-50"
          placeholder="Describe the project..."
          disabled={isReadOnly}
        />
      </FormField>
    </div>
  );
}
